# GitProof Architecture Specification

## 1. System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GITPROOF ARCHITECTURE                           │
└────────────────────────────────────────────────────────────────────────┘

    Sponsor                  Contributor              GitHub Public API
       │                          │                          │
       │ 1. create_bounty(...)    │                          │
       │    [Locks GEN Escrow]    │                          │
       ▼                          │                          │
  ┌─────────────────────────────────────────────────────────┐│
  │            GenLayer Intelligent Contract                ││
  │                 (git_proof.py)                          ││
  │                                                         ││
  │  State:                                                 ││
  │   - Bounties TreeMap[u32, Bounty]                       ││
  │   - Claims TreeMap[u32, ClaimRecord]                    ││
  │   - Escrow Balances                                     ││
  └───────────────────────────────┬─────────────────────────┘│
                                  │                          │
                                  │ 2. submit_and_adjudicate │
                                  │    (pr_url)              │
                                  ▼                          │
                     ┌──────────────────────────┐            │
                     │  Validator Quorum        │            │
                     │                          │            │
                     │  3. gl.nondet.web.render ├────────────┘
                     │     (Fetch PR Diff)      │
                     │                          │
                     │  4. gl.nondet.exec_prompt│
                     │     (Audit vs Criteria)  │
                     │                          │
                     │  5. strict_eq Consensus  │
                     └────────────┬─────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
          Passed (Score >= 75)             Failed (Score < 75)
                  │                               │
        6a. Release Escrow              6b. Record Rejection
            to Contributor Address          Keep Bounty OPEN
```

## 2. Equivalence Principle Implementation

GenLayer validators run non-deterministic code concurrently. To ensure identical on-chain state transitions without relying on brittle exact string matching of LLM prose, `GitProof` leverages structured JSON schema validation under `gl.eq_principle.strict_eq()`:

```python
def evaluate_consensus() -> str:
    diff_url = clean_pr_url.rstrip("/") + ".diff"
    raw_diff = gl.nondet.web.render(diff_url, mode="text")
    bounded_diff = raw_diff[:MAX_DIFF_SNIPPET_BYTES]
    
    prompt = f"""..."""
    return gl.nondet.exec_prompt(prompt, response_format="json")

verdict_raw = gl.eq_principle.strict_eq(evaluate_consensus)
verdict = json.loads(verdict_raw)
```

Validators reach consensus on:
- `passed`: `true | false`
- `confidence_score`: integer percentage (threshold: 75)
- State transitions (Escrow payout vs. rejection record)

## 3. Threat Model & Anti-Gaming Measures

1. **Empty / Spam PR Attack:**
   - *Attack:* A user creates a pull request modifying a README or whitespace.
   - *Defense:* Validator prompt checks semantic alignment against acceptance criteria and requires substantial functional code additions.
2. **Plagiarism / Trivial Duplication:**
   - *Attack:* A user submits a PR copied from another open PR.
   - *Defense:* Contract checks `pr_url` domain and requires PR to be opened against the designated `repo_name` and issue.
3. **Ghosting / Inactive Maintainer:**
   - *Attack:* Maintainer abandons the repository after work is done.
   - *Defense:* Payout does NOT require maintainer approval. GenLayer validators adjudicate autonomously directly from the public GitHub diff.
4. **Permanent Fund Locking:**
   - *Attack:* Issue is never solved, locking sponsor funds forever.
   - *Defense:* Sponsor can execute `refund_bounty(bounty_id)` once the `expiry_epoch` has elapsed.
