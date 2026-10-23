import pytest
import json
from contracts.git_proof import GitProof, BountyStatus, ClaimStatus, UserError


def test_create_bounty_success(gl_env):
    contract = GitProof()
    gl_env.message.sender_address = "0xSponsor1111111111111111111111111111111111"
    gl_env.message.value = 1000000000000000000  # 1 GEN

    b_id = contract.create_bounty(
        repo_name="facebook/react",
        issue_number=1024,
        acceptance_criteria="Add useActionState hook with full TypeScript coverage and unit tests.",
        expiry_epoch=10,
    )

    assert b_id == 1
    counts = contract.get_counts()
    assert counts["bounty_count"] == 1
    assert counts["total_locked_escrow"] == 1000000000000000000

    bounty = contract.get_bounty(1)
    assert bounty["repo_name"] == "facebook/react"
    assert bounty["issue_number"] == 1024
    assert bounty["status"] == int(BountyStatus.OPEN)
    assert bounty["payout_wei"] == 1000000000000000000


def test_create_bounty_validation_failures(gl_env):
    contract = GitProof()
    gl_env.message.sender_address = "0xSponsor"
    gl_env.message.value = 0

    # 1. Zero deposit
    with pytest.raises(UserError, match="must be greater than zero"):
        contract.create_bounty("org/repo", 1, "test criteria", 10)

    # 2. Invalid repo name
    gl_env.message.value = 100
    with pytest.raises(UserError, match="owner/repo"):
        contract.create_bounty("invalid_repo_name", 1, "test criteria", 10)

    # 3. Empty criteria
    with pytest.raises(UserError, match="cannot be empty"):
        contract.create_bounty("org/repo", 1, "   ", 10)

    # 4. Past expiry epoch
    with pytest.raises(UserError, match="in the future"):
        contract.create_bounty("org/repo", 1, "criteria", 1)


def test_submit_and_adjudicate_pr_accepted(gl_env):
    contract = GitProof()
    gl_env.message.sender_address = "0xSponsor"
    gl_env.message.value = 500000000000000000  # 0.5 GEN
    contract.create_bounty("ethereum/go-ethereum", 42, "Implement EIP-4844 blob verification", 20)

    # Setup contributor and PR
    contributor = "0xContributor999999999999999999999999999999"
    gl_env.message.sender_address = contributor
    gl_env.message.value = 0

    pr_url = "https://github.com/ethereum/go-ethereum/pull/1337"
    diff_url = pr_url + ".diff"

    # Mock web render and prompt
    gl_env.nondet.web.rendered_pages[diff_url] = "diff --git a/blob.go b/blob.go\n+ func VerifyBlobKZGProof() error { return nil }"
    gl_env.nondet.prompt_responses["blob"] = json.dumps({
        "passed": True,
        "confidence_score": 92,
        "rationale": "High quality PR with proper KZG verification tests."
    })

    claim_id = contract.submit_and_adjudicate_pr(1, pr_url)
    assert claim_id == 1

    claim = contract.get_claim(1)
    assert claim["status"] == int(ClaimStatus.ACCEPTED)
    assert claim["confidence_score"] == 92
    assert "KZG" in claim["verdict_rationale"]

    # Verify bounty state updated to CLAIMED and escrow cleared
    bounty = contract.get_bounty(1)
    assert bounty["status"] == int(BountyStatus.CLAIMED)
    assert bounty["claimed_by"] == contributor
    assert bounty["accepted_pr_url"] == pr_url

    counts = contract.get_counts()
    assert counts["total_locked_escrow"] == 0

    # Verify payout transfer occurred
    assert len(gl_env.transfers) == 1
    assert gl_env.transfers[0] == (contributor, 500000000000000000)


def test_submit_and_adjudicate_pr_rejected(gl_env):
    contract = GitProof()
    gl_env.message.sender_address = "0xSponsor"
    gl_env.message.value = 200
    contract.create_bounty("org/repo", 5, "Fix critical race condition", 10)

    # Contributor submits spam/empty PR
    gl_env.message.sender_address = "0xSpammer"
    gl_env.message.value = 0
    pr_url = "https://github.com/org/repo/pull/1"

    gl_env.nondet.default_prompt_response = json.dumps({
        "passed": False,
        "confidence_score": 20,
        "rationale": "PR only updates README with typo fix, does not fix race condition."
    })

    claim_id = contract.submit_and_adjudicate_pr(1, pr_url)
    claim = contract.get_claim(claim_id)

    assert claim["status"] == int(ClaimStatus.REJECTED)
    assert claim["confidence_score"] == 20

    # Bounty must remain OPEN for other developers
    bounty = contract.get_bounty(1)
    assert bounty["status"] == int(BountyStatus.OPEN)
    assert len(gl_env.transfers) == 0


def test_refund_expired_bounty(gl_env):
    contract = GitProof()
    sponsor = "0xSponsorOriginal"
    gl_env.message.sender_address = sponsor
    gl_env.message.value = 1000
    contract.create_bounty("org/repo", 1, "Some task", 5)

    # Try to refund before deadline -> fail
    with pytest.raises(UserError, match="Cannot refund before expiry"):
        contract.refund_bounty(1)

    # Advance past expiry
    contract.advance_epoch(10)
    assert contract.get_counts()["current_epoch"] == 11

    # Non-sponsor tries to refund -> fail
    gl_env.message.sender_address = "0xAttacker"
    with pytest.raises(UserError, match="Only the original sponsor"):
        contract.refund_bounty(1)

    # Sponsor refunds -> success
    gl_env.message.sender_address = sponsor
    contract.refund_bounty(1)

    bounty = contract.get_bounty(1)
    assert bounty["status"] == int(BountyStatus.REFUNDED)
    assert len(gl_env.transfers) == 1
    assert gl_env.transfers[0] == (sponsor, 1000)
