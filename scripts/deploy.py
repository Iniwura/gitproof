import sys
import json
from pathlib import Path
import genlayer_py

def deploy_git_proof():
    print("=" * 70)
    print(">>> Deploying GitProof to GenLayer Studionet...")
    print("=" * 70)

    account = genlayer_py.create_account()
    client = genlayer_py.create_client(chain=genlayer_py.studionet, account=account)
    print(f"Deployer account: {account.address}")

    contract_path = Path(__file__).resolve().parent.parent / "contracts" / "git_proof.py"
    code = contract_path.read_text(encoding="utf-8")

    tx_hash = client.deploy_contract(code=code, account=account)
    print(f"Deployment Tx Hash: {tx_hash}")

    receipt = client.wait_for_transaction_receipt(tx_hash)
    contract_addr = receipt.get("to_address") or receipt.get("data", {}).get("contract_address")
    print(f"[OK] GitProof successfully deployed at: {contract_addr}")

    # Write deployment metadata
    deploy_info = {
        "contract_name": "GitProof",
        "contract_address": contract_addr,
        "deployment_tx": tx_hash,
        "network": "studionet",
        "deployer": account.address,
        "status": receipt.get("status_name", "ACCEPTED")
    }

    out_file = Path(__file__).resolve().parent.parent / "deployment.json"
    out_file.write_text(json.dumps(deploy_info, indent=2), encoding="utf-8")
    print(f"Deployment info saved to: {out_file}")

    # Test view call
    counts = client.read_contract(address=contract_addr, function_name="get_counts", args=[])
    print(f"Initial get_counts: {counts}")

    # Test sample bounty creation
    print("\n>>> Testing create_bounty on-chain...")
    try:
        bounty_tx = client.write_contract(
            address=contract_addr,
            function_name="create_bounty",
            args=[
                "genlayer/genlayer-simulator",
                101,
                "Implement WebSocket subscription for validator consensus rounds with unit tests.",
                20
            ],
            value=100000000000000000, # 0.1 GEN
            account=account
        )
        print(f"create_bounty Tx Hash: {bounty_tx}")
        b_receipt = client.wait_for_transaction_receipt(bounty_tx)
        print(f"create_bounty status: {b_receipt.get('status_name')}")

        bounty_data = client.read_contract(address=contract_addr, function_name="get_bounty", args=[1])
        print(f"Bounty 1 on-chain state: {bounty_data}")
    except Exception as e:
        print(f"Live write warning: {e}")

    return contract_addr

if __name__ == "__main__":
    deploy_git_proof()
