# 🔗 Blockchain Certificate Verification System

## Project Structure
```
blockchain-cert/
├── blockchain/          # Solidity smart contracts + Hardhat
├── backend/             # Node.js + Express + MongoDB
├── frontend/            # React + Tailwind + ethers.js
└── README.md
```

## Setup Instructions

### 1. Blockchain
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network mumbai
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## Roles
- **Institute** — Upload & issue certificates
- **Student** — View & share certificates
- **Employer** — Verify certificates instantly

## How It Works
1. Institute uploads PDF → hashed with SHA-256
2. Hash + IPFS CID stored on Polygon blockchain via smart contract
3. Student gets unique Certificate ID / QR Code
4. Employer uploads certificate → re-hashed → compared on-chain
5. ✅ Match = VERIFIED | ❌ No Match = FAKE
