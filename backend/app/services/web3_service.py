import os
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_typed_data
from dotenv import load_dotenv

load_dotenv()

RPC_URL = os.getenv("RPC_URL")
CHAIN_ID = int(os.getenv("CHAIN_ID", "1"))
ADMIN_PRIVATE_KEY = os.getenv("ADMIN_PRIVATE_KEY")
REWARD_MANAGER_ADDRESS = Web3.to_checksum_address(os.getenv("REWARD_MANAGER_ADDRESS", "0x0000000000000000000000000000000000000000"))

web3 = Web3(Web3.HTTPProvider(RPC_URL)) if RPC_URL else None
admin_account = Account.from_key(ADMIN_PRIVATE_KEY) if ADMIN_PRIVATE_KEY else None

EIP712_DOMAIN = {
    "name": "CosmicFit RewardManager",
    "version": "1",
    "chainId": CHAIN_ID,
    "verifyingContract": REWARD_MANAGER_ADDRESS,
}

CLAIM_TYPES = {
    "Claim": [
        {"name": "wallet", "type": "address"},
        {"name": "rewardType", "type": "string"},
        {"name": "amount", "type": "uint256"},
        {"name": "nonce", "type": "uint256"},
    ]
}

def sign_claim_voucher(wallet: str, reward_type: str, amount: int, nonce: int) -> dict:
    if not admin_account:
        raise RuntimeError("Admin private key not configured")
    message = {"wallet": wallet, "rewardType": reward_type, "amount": amount, "nonce": nonce}
    typed = {"domain": EIP712_DOMAIN, "primaryType": "Claim", "types": {**CLAIM_TYPES, "EIP712Domain": []}, "message": message}
    encoded = encode_typed_data(full_message=typed)
    signature = Account.sign_message(encoded, private_key=admin_account.key).signature.hex()
    return {"domain": EIP712_DOMAIN, "types": CLAIM_TYPES, "message": message, "signature": signature}

def avatar_seed_from_wallet(wallet: str) -> str:
    return Web3.keccak(text=wallet).hex()[:16]
