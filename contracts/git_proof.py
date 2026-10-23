# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from enum import IntEnum
from dataclasses import dataclass
import json

from genlayer import *


# ─────────────────────────────────────────────────────────────
# Constants & Guardrails
# ─────────────────────────────────────────────────────────────

MAX_ACCEPTANCE_CRITERIA_LEN = 2048
MAX_DIFF_SNIPPET_BYTES = 12000
MIN_CONFIDENCE_THRESHOLD = 75


if "UserError" not in globals():
    class UserError(Exception):
        """User-revert exception for contract validation errors."""
        pass


def to_address(val) -> Address:
    if isinstance(val, Address):
        return val
    return Address(str(val))


class BountyStatus(IntEnum):
    OPEN = 0
    CLAIMED = 1
    REFUNDED = 2
    DISPUTED = 3


class ClaimStatus(IntEnum):
    PENDING = 0
    ACCEPTED = 1
    REJECTED = 2


@allow_storage
@dataclass
class Bounty:
    id: u32
    sponsor: Address
    repo_name: str            # e.g., "facebook/react" or "org/repo"
    issue_number: u32
    acceptance_criteria: str  # Plain English requirements and tests
    payout_wei: u256          # Locked escrow amount
    created_epoch: u64
    expiry_epoch: u64
    status: u32               # BountyStatus
    claimed_by: Address
    accepted_pr_url: str


@allow_storage
@dataclass
class ClaimRecord:
    claim_id: u32
    bounty_id: u32
    contributor: Address
    pr_url: str
    status: u32               # ClaimStatus
    confidence_score: u32     # 0 - 100 consensus confidence
    verdict_rationale: str
    evaluated_epoch: u64


# ─────────────────────────────────────────────────────────────
# Contract: GitProof
# ─────────────────────────────────────────────────────────────

class GitProof(gl.Contract):
    """
    GitProof: Autonomous GitHub Milestone & Bug Bounty Protocol.
    
    Replaces centralized bounty platforms and trusted arbiters by using
    GenLayer validator consensus to inspect live GitHub PR diffs, evaluate
    code against frozen issue criteria, and release escrow automatically.
    """

    bounties: TreeMap[u32, Bounty]
    claims: TreeMap[u32, ClaimRecord]
    
    bounty_count: u32
    claim_count: u32
    current_epoch: u64
    total_locked_escrow: u256

    def __init__(self):
        self.bounty_count = u32(0)
        self.claim_count = u32(0)
        self.current_epoch = u64(1)
        self.total_locked_escrow = u256(0)

    # ─────────────────────────────────────────────────────────
    # Public State-Changing Methods
    # ─────────────────────────────────────────────────────────

    @gl.public.write.payable
    def create_bounty(
        self,
        repo_name: str,
        issue_number: int,
        acceptance_criteria: str,
        expiry_epoch: int
    ) -> u32:
        """
        Locks escrow funds for an open-source issue with plain-English acceptance criteria.
        """
        sender = to_address(gl.message.sender_address)
        deposit = u256(gl.message.value)

        if deposit <= 0:
            raise UserError("Bounty payout must be greater than zero")

        if "/" not in repo_name or len(repo_name) > 100:
            raise UserError("repo_name must be in 'owner/repo' format (e.g. 'ethereum/solidity')")

        if issue_number <= 0:
            raise UserError("Invalid issue number")

        if len(acceptance_criteria.strip()) == 0:
            raise UserError("Acceptance criteria cannot be empty")

        if len(acceptance_criteria) > MAX_ACCEPTANCE_CRITERIA_LEN:
            raise UserError(f"Acceptance criteria exceeds maximum length of {MAX_ACCEPTANCE_CRITERIA_LEN}")

        if int(expiry_epoch) <= int(self.current_epoch):
            raise UserError("Expiry epoch must be in the future")

        b_id = u32(int(self.bounty_count) + 1)
        self.bounty_count = b_id

        bounty = Bounty(
            id=b_id,
            sponsor=sender,
            repo_name=str(repo_name).strip(),
            issue_number=u32(int(issue_number)),
            acceptance_criteria=str(acceptance_criteria).strip(),
            payout_wei=deposit,
            created_epoch=self.current_epoch,
            expiry_epoch=u64(int(expiry_epoch)),
            status=u32(BountyStatus.OPEN),
            claimed_by=to_address("0x0000000000000000000000000000000000000000"),
            accepted_pr_url="",
        )
        self.bounties[b_id] = bounty
        self.total_locked_escrow = u256(int(self.total_locked_escrow) + int(deposit))

        return b_id

    @gl.public.write
    def submit_and_adjudicate_pr(
        self,
        bounty_id: int,
        pr_url: str
    ) -> u32:
        """
        Contributor submits a GitHub PR URL.
        GenLayer validators independently fetch the PR diff and metadata from GitHub,
        reach consensus on criteria satisfaction via strict equivalence, and pay out if passed.
        """
        contributor = to_address(gl.message.sender_address)
        bid = u32(int(bounty_id))

        if bid not in self.bounties:
            raise UserError(f"Bounty {bounty_id} does not exist")

        bounty = self.bounties[bid]
        if bounty.status != u32(BountyStatus.OPEN):
            raise UserError("Bounty is not currently open for claims")

        if int(self.current_epoch) > int(bounty.expiry_epoch):
            raise UserError("Bounty deadline has expired")

        clean_pr_url = pr_url.strip()
        if not clean_pr_url.startswith("https://github.com/") or "/pull/" not in clean_pr_url:
            raise UserError("Invalid GitHub PR URL. Format must be: https://github.com/owner/repo/pull/123")

        # ── Non-Deterministic Verification Block via Strict Equivalence ──
        def evaluate_consensus() -> str:
            # Construct raw diff URL (append .diff to GitHub PR url)
            diff_url = clean_pr_url.rstrip("/") + ".diff"
            raw_diff = gl.nondet.web.render(diff_url, mode="text")
            bounded_diff = raw_diff[:MAX_DIFF_SNIPPET_BYTES]

            prompt = f"""
You are an impartial decentralized code auditor validating an open source GitHub bounty deliverable.

TARGET BOUNTY REQUIREMENTS:
Repository: {bounty.repo_name}
Target Issue: #{int(bounty.issue_number)}
Acceptance Criteria:
\"\"\"
{bounty.acceptance_criteria}
\"\"\"

SUBMITTED PULL REQUEST:
URL: {clean_pr_url}

CODE DIFF CONTENT:
\"\"\"
{bounded_diff}
\"\"\"

AUDIT SPECIFICATIONS:
1. Verify if the code changes in the diff solve the stated acceptance criteria.
2. Check for anti-gaming: reject empty commits, trivial typos/readme edits, or irrelevant code.
3. Reject if the code contains obvious malicious logic or severe security hazards.
4. If criteria are met and code is substantial, award passed=true with confidence >= 75.

OUTPUT FORMAT:
Respond with ONLY a valid JSON object matching this exact schema:
{{
  "passed": true,
  "confidence_score": 85,
  "rationale": "Diff implements required feature, adds unit tests, and satisfies all criteria."
}}
"""
            return gl.nondet.exec_prompt(prompt, response_format="json")

        c_id = u32(int(self.claim_count) + 1)
        self.claim_count = c_id

        try:
            verdict_raw = gl.eq_principle.strict_eq(evaluate_consensus)
            verdict = json.loads(verdict_raw) if isinstance(verdict_raw, str) else verdict_raw
        except Exception as e:
            # If consensus diverges or network fails, reject gracefully
            claim = ClaimRecord(
                claim_id=c_id,
                bounty_id=bid,
                contributor=contributor,
                pr_url=clean_pr_url,
                status=u32(ClaimStatus.REJECTED),
                confidence_score=u32(0),
                verdict_rationale=f"Consensus evaluation failure: {str(e)}",
                evaluated_epoch=self.current_epoch,
            )
            self.claims[c_id] = claim
            return c_id

        passed = bool(verdict.get("passed", False))
        confidence = int(verdict.get("confidence_score", 0))
        rationale = str(verdict.get("rationale", "No rationale provided"))

        if passed and confidence >= MIN_CONFIDENCE_THRESHOLD:
            # ── ACCEPTED: Release locked payout to contributor ──
            claim = ClaimRecord(
                claim_id=c_id,
                bounty_id=bid,
                contributor=contributor,
                pr_url=clean_pr_url,
                status=u32(ClaimStatus.ACCEPTED),
                confidence_score=u32(confidence),
                verdict_rationale=rationale,
                evaluated_epoch=self.current_epoch,
            )
            self.claims[c_id] = claim

            payout = int(bounty.payout_wei)
            bounty.status = u32(BountyStatus.CLAIMED)
            bounty.claimed_by = contributor
            bounty.accepted_pr_url = clean_pr_url
            self.bounties[bid] = bounty

            self.total_locked_escrow = u256(max(0, int(self.total_locked_escrow) - payout))
            gl.transfer(contributor, payout)

        else:
            # ── REJECTED: Bounty remains OPEN for revisions or other devs ──
            claim = ClaimRecord(
                claim_id=c_id,
                bounty_id=bid,
                contributor=contributor,
                pr_url=clean_pr_url,
                status=u32(ClaimStatus.REJECTED),
                confidence_score=u32(confidence),
                verdict_rationale=rationale,
                evaluated_epoch=self.current_epoch,
            )
            self.claims[c_id] = claim

        return c_id

    @gl.public.write
    def refund_bounty(self, bounty_id: int):
        """
        Sponsor reclaims locked funds if the bounty expired without any accepted claim.
        """
        sender = to_address(gl.message.sender_address)
        bid = u32(int(bounty_id))

        if bid not in self.bounties:
            raise UserError("Bounty does not exist")

        bounty = self.bounties[bid]
        if bounty.sponsor != sender:
            raise UserError("Only the original sponsor can refund this bounty")

        if bounty.status != u32(BountyStatus.OPEN):
            raise UserError("Bounty is not in OPEN status")

        if int(self.current_epoch) <= int(bounty.expiry_epoch):
            raise UserError("Cannot refund before expiry epoch has elapsed")

        payout = int(bounty.payout_wei)
        bounty.status = u32(BountyStatus.REFUNDED)
        self.bounties[bid] = bounty

        self.total_locked_escrow = u256(max(0, int(self.total_locked_escrow) - payout))
        gl.transfer(bounty.sponsor, payout)

    @gl.public.write
    def advance_epoch(self, delta: int = 1):
        """Advances protocol epoch for testing and deadline tracking."""
        if delta <= 0:
            raise UserError("Delta must be positive")
        self.current_epoch = u64(int(self.current_epoch) + int(delta))

    # ─────────────────────────────────────────────────────────
    # Public View Methods
    # ─────────────────────────────────────────────────────────

    @gl.public.view
    def get_bounty(self, bounty_id: int) -> dict:
        bid = u32(int(bounty_id))
        if bid not in self.bounties:
            raise UserError(f"Bounty {bounty_id} does not exist")
        b = self.bounties[bid]
        return {
            "id": int(b.id),
            "sponsor": str(b.sponsor),
            "repo_name": b.repo_name,
            "issue_number": int(b.issue_number),
            "acceptance_criteria": b.acceptance_criteria,
            "payout_wei": int(b.payout_wei),
            "created_epoch": int(b.created_epoch),
            "expiry_epoch": int(b.expiry_epoch),
            "status": int(b.status),
            "claimed_by": str(b.claimed_by),
            "accepted_pr_url": b.accepted_pr_url,
        }

    @gl.public.view
    def get_claim(self, claim_id: int) -> dict:
        cid = u32(int(claim_id))
        if cid not in self.claims:
            raise UserError(f"Claim {claim_id} does not exist")
        c = self.claims[cid]
        return {
            "claim_id": int(c.claim_id),
            "bounty_id": int(c.bounty_id),
            "contributor": str(c.contributor),
            "pr_url": c.pr_url,
            "status": int(c.status),
            "confidence_score": int(c.confidence_score),
            "verdict_rationale": c.verdict_rationale,
            "evaluated_epoch": int(c.evaluated_epoch),
        }

    @gl.public.view
    def get_counts(self) -> dict:
        return {
            "bounty_count": int(self.bounty_count),
            "claim_count": int(self.claim_count),
            "current_epoch": int(self.current_epoch),
            "total_locked_escrow": int(self.total_locked_escrow),
        }
