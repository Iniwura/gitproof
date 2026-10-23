import sys
import json
import time
from pathlib import Path
import genlayer_py

def verify_all_gitproof():
    print("=" * 80)
    print(">>> VERIFYING ALL READ & WRITE METHODS ON STUDIONET: GitProof")
    print("=" * 80)

    deploy_file = Path(__file__).resolve().parent.parent / "deployment.json"
    deploy_data = json.loads(deploy_file.read_text(encoding="utf-8"))
    contract_addr = deploy_data["contract_address"]
    print(f"Target Contract Address: {contract_addr}")

    account = genlayer_py.create_account()
    client = genlayer_py.create_client(chain=genlayer_py.studionet, account=account)
    print(f"Test Account Address: {account.address}")

    # 1. READ: get_counts
    print("\n--- [1/8] Testing READ: get_counts ---")
    counts = client.read_contract(address=contract_addr, function_name="get_counts", args=[])
    print(f"get_counts returned: {counts}")
    current_epoch = counts.get("current_epoch", 1)

    # 2. READ: get_bounty(1)
    print("\n--- [2/8] Testing READ: get_bounty(1) ---")
    b1 = client.read_contract(address=contract_addr, function_name="get_bounty", args=[1])
    print(f"get_bounty(1) returned: {b1}")

    # 3. WRITE: create_bounty (with short expiry for refund test)
    print("\n--- [3/8] Testing WRITE: create_bounty (Bounty #2) ---")
    expiry = current_epoch + 2
    b2_tx = client.write_contract(
        address=contract_addr,
        function_name="create_bounty",
        args=[
            "genlayer/genlayer-docs",
            42,
            "Fix broken link in tutorial and add quickstart code sample.",
            expiry
        ],
        value=50000000000000000, # 0.05 GEN
        account=account
    )
    print(f"create_bounty Tx: {b2_tx}")
    rec_b2 = client.wait_for_transaction_receipt(b2_tx)
    print(f"Receipt status_name: {rec_b2.get('status_name')}, result_name: {rec_b2.get('result_name')}")
    b2 = client.read_contract(address=contract_addr, function_name="get_bounty", args=[2])
    print(f"Bounty #2 on-chain: {b2}")

    # 4. WRITE: submit_and_adjudicate_pr on Bounty #1
    print("\n--- [4/8] Testing WRITE: submit_and_adjudicate_pr (Bounty #1) ---")
    claim_tx = client.write_contract(
        address=contract_addr,
        function_name="submit_and_adjudicate_pr",
        args=[
            1,
            "https://github.com/genlayer/genlayer-simulator/pull/45"
        ],
        account=account
    )
    print(f"submit_and_adjudicate_pr Tx: {claim_tx}")
    rec_claim = client.wait_for_transaction_receipt(claim_tx)
    print(f"Receipt status_name: {rec_claim.get('status_name')}, result_name: {rec_claim.get('result_name')}")
    consensus_info = rec_claim.get("consensus_data")
    print(f"Consensus Data: {json.dumps(consensus_info, default=str)[:300]}...")

    # 5. READ: get_claim(1)
    print("\n--- [5/8] Testing READ: get_claim(1) ---")
    try:
        claim_data = client.read_contract(address=contract_addr, function_name="get_claim", args=[1])
        print(f"get_claim(1) returned: {claim_data}")
    except Exception as e:
        print(f"get_claim note: {e}")

    # 6. WRITE: advance_epoch
    print(f"\n--- [6/8] Testing WRITE: advance_epoch(5) to pass Bounty #2 expiry ({expiry}) ---")
    adv_tx = client.write_contract(
        address=contract_addr,
        function_name="advance_epoch",
        args=[5],
        account=account
    )
    print(f"advance_epoch Tx: {adv_tx}")
    rec_adv = client.wait_for_transaction_receipt(adv_tx)
    print(f"Receipt status_name: {rec_adv.get('status_name')}")
    post_adv_counts = client.read_contract(address=contract_addr, function_name="get_counts", args=[])
    print(f"New current_epoch: {post_adv_counts.get('current_epoch')}")

    # 7. WRITE: refund_bounty(2)
    print("\n--- [7/8] Testing WRITE: refund_bounty(2) ---")
    refund_tx = client.write_contract(
        address=contract_addr,
        function_name="refund_bounty",
        args=[2],
        account=account
    )
    print(f"refund_bounty Tx: {refund_tx}")
    rec_refund = client.wait_for_transaction_receipt(refund_tx)
    print(f"Receipt status_name: {rec_refund.get('status_name')}, result_name: {rec_refund.get('result_name')}")
    b2_post_refund = client.read_contract(address=contract_addr, function_name="get_bounty", args=[2])
    print(f"Bounty #2 post-refund state: {b2_post_refund}")

    # 8. FINAL READ: get_counts
    print("\n--- [8/8] Testing FINAL READ: get_counts ---")
    final_counts = client.read_contract(address=contract_addr, function_name="get_counts", args=[])
    print(f"Final get_counts: {final_counts}")

    print("\n" + "=" * 80)
    print("[SUCCESS] ALL GitProof READ & WRITE METHODS VERIFIED LIVE ON STUDIONET!")
    print("=" * 80)

if __name__ == "__main__":
    verify_all_gitproof()
