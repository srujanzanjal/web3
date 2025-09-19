import os, jwt, datetime, sys
from web3 import Web3
JWT_SECRET = os.getenv("JWT_SECRET", "dev_secret")
JWT_ALG = os.getenv("JWT_ALG", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "43200"))
addr = sys.argv[1] if len(sys.argv)>1 else "0x1234567890123456789012345678901234567890"
addr = Web3.to_checksum_address(addr)
exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRE_MINUTES)
print(jwt.encode({"sub": addr, "exp": exp}, JWT_SECRET, algorithm=JWT_ALG))
