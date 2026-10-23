# GenLayer Project Submission 1: GitProof

## Project Information
- **Project Name:** GitProof
- **Tagline:** Autonomous GitHub Issue & Milestone Bounty Protocol on GenLayer
- **Live Production URL:** https://frontend-five-orcin-98.vercel.app
- **GitHub Repository:** https://github.com/Iniwura/gitproof
- **Category:** Developer Tooling / B2B Web3 Infrastructure
- **Live Deployed Contract (Studionet):** `0x99Bc53CaE232fB18C54c35F2a792fCA9CFb5bE79`
- **Chain ID:** `61997` (`studionet`)
- **Deployment Transaction:** `0x3a4a424ac7b845c9297e688a9ce963c9cee9685ec23a0d861bf6a604edcb13dc`
- **Test Suite Status:** 5/5 passed (100% Green in 0.39s)

---

## 1. Problem Statement & Trust Dilemma
In decentralized software development and open-source bounties (Gitcoin, Bounties Network, etc.), the core failure mode is counterparty mistrust:
- Contributors fear doing days of engineering work only to be stiffed or ghosted by project maintainers.
- Sponsors fear depositing funds in simple multi-sigs where malicious contributors can submit trivial, empty, or plagiarized PRs.
- Traditional smart contracts cannot inspect GitHub diffs or reason over code quality. Web2 bounty bots rely on centralized custody and server keys.

## 2. The GenLayer Solution
GitProof turns open-source bounties into self-adjudicating escrow contracts:
1. **Sponsor Deposits Escrow:** Calls `create_bounty` with the target GitHub repo, issue number, and acceptance criteria in plain English.
2. **Contributor Submits PR:** When code is ready, the developer submits their PR URL to `submit_and_adjudicate_pr`.
3. **Validator Consensus:** GenLayer validators fetch the raw diff directly via `gl.nondet.web.render()`, execute consensus prompts evaluating code changes, unit tests, and anti-spam heuristics via `gl.eq_principle.strict_eq()`.
4. **Autonomous Payout:** Upon validator consensus approval (confidence $\ge 75\%$), escrow is transferred directly to the contributor on-chain without human intermediary bias.

## 3. Quality Bar Checklist
- [x] **Solves a Real Trust Problem:** Eliminates non-payment risks and review delays for open-source developers.
- [x] **Uses Live/Authoritative Data:** Scrapes live GitHub PR diffs (`.diff` endpoints) directly on-chain.
- [x] **Real Intelligent Contract:** Full Python contract utilizing `gl.Contract`, `TreeMap`, `gl.nondet.web.render`, `gl.nondet.exec_prompt`, and `gl.eq_principle.strict_eq`.
- [x] **Full Frontend Lifecycle:** Tracks mempool submission $\to$ leader diff scraping $\to$ validator equivalence consensus $\to$ on-chain payout.
- [x] **Credible Path to Continued Use:** Can be integrated into any public GitHub repository or hackathon prize pool immediately.
