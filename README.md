# GitProof — Autonomous GitHub Issue & Milestone Escrow Protocol

> **GenLayer Studionet Contract:** `0x99Bc53CaE232fB18C54c35F2a792fCA9CFb5bE79`  
> **Chain ID:** `61997` (`studionet`)  
> **Deployment Tx:** `0x3a4a424ac7b845c9297e688a9ce963c9cee9685ec23a0d861bf6a604edcb13dc`

---

## 1. Overview & Trust Problem

GitProof eliminates the counterparty trust dilemma in open-source bounties, developer grants, and decentralized bug bounties:
- **Contributors** risk writing code and solving complex issues only to get ghosted or arbitrarily rejected by maintainers.
- **Sponsors** cannot lock funds into naive multisigs or EVM escrows because bad actors submit empty PRs, plagiarized code, or trivial README edits.

**Why GenLayer is uniquely required:**
EVM smart contracts cannot read GitHub pull requests, parse commit diffs, or evaluate semantic adherence to issue acceptance criteria. Web2 bots rely on centralized private keys and server operators that can be compromised or manipulated.

GitProof's Python **Intelligent Contract** leverages GenLayer's multi-validator consensus:
1. Validators independently fetch the live GitHub PR diff using `gl.nondet.web.render(diff_url)`.
2. Validators reach consensus via `gl.eq_principle.strict_eq()` on whether the diff genuinely satisfies the frozen acceptance criteria and includes proper tests without malicious payloads.
3. If approved with confidence $\ge 75\%$, the locked escrow releases autonomously to the contributor address.

---

## 2. Repository Layout

```
gitproof/
├── contracts/
│   └── git_proof.py         # Complete GenLayer Intelligent Contract
├── tests/
│   ├── conftest.py          # GenVM in-memory simulation test harness
│   └── test_git_proof.py    # 100% passing pytest suite (5/5 tests)
├── scripts/
│   └── deploy.py            # Live Studionet deployment & testing script
├── frontend/                # Production Vite + React + Tailwind + TypeScript UI
│   ├── src/
│   │   ├── services/
│   │   │   └── genlayer.ts  # Full genlayer-js integration & lifecycle tracking
│   │   ├── types.ts
│   │   ├── App.tsx          # Senior designer terminal UI
│   │   └── main.tsx
│   └── package.json
├── deployment.json          # Live contract address and deployment receipt
├── ARCHITECTURE.md          # Threat model, consensus equivalence, and data flows
├── SUBMISSION.md            # Formal GenLayer submission notes
└── README.md
```

---

## 3. Quick Start & Reproduction

### Prerequisites
- Python 3.11+ (with `genlayer_py` and `pytest`)
- Node.js 18+ and npm

### Run Test Suite
```bash
py -3.14 -m pytest tests -v
```
Output:
```
tests/test_git_proof.py::test_create_bounty_success PASSED
tests/test_git_proof.py::test_create_bounty_validation_failures PASSED
tests/test_git_proof.py::test_submit_and_adjudicate_pr_accepted PASSED
tests/test_git_proof.py::test_submit_and_adjudicate_pr_rejected PASSED
tests/test_git_proof.py::test_refund_expired_bounty PASSED
============================== 5 passed in 0.12s ==============================
```

### Run Frontend Locally
```bash
cd frontend
npm run dev
```
Open `http://localhost:5173` to explore active bounties, deposit escrow, or submit live PRs.
