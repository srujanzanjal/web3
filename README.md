# 🌌 CosmicFit - Web3 Fitness Challenge dApp

A gamified fitness tracking dApp where users earn FITT tokens and NFT badges for logging physical activities.

## 🏗️ Project Structure

```
cosmicfit/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── routes/         # API endpoints
│   │   ├── models.py       # Database models
│   │   ├── schemas.py      # Pydantic schemas
│   │   └── services/       # Web3 services
│   ├── scripts/            # Database seeding
│   ├── tests/              # API tests
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API service
│   └── package.json
└── run_backend.sh          # Backend startup script
└── run_frontend.sh         # Frontend startup script
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Virtual environment (recommended)

### 1. Setup Backend
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run backend
./run_backend.sh
```

### 2. Setup Frontend
```bash
# Install dependencies
cd frontend
npm install

# Run frontend
./run_frontend.sh
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🎯 Features

### ✅ Backend Features
- **Authentication**: SIWE (Sign-In With Ethereum) + JWT
- **Activity Logging**: 8 activity types with dynamic token calculation
- **Reward System**: EIP-712 signed vouchers for claiming
- **Badge System**: Bronze (10), Silver (25), Gold (50), Cosmic (100) activities
- **Leaderboard**: Real-time ranking by activities and tokens
- **Database**: SQLite with SQLAlchemy ORM

### ✅ Frontend Features
- **Wallet Connection**: MetaMask integration via RainbowKit
- **Dashboard**: Real-time stats and progress tracking
- **Activity Logging**: Form with validation and token preview
- **Reward Claims**: EIP-712 voucher generation and claiming
- **Leaderboard**: Live ranking with current user highlighting
- **Badge Gallery**: NFT badge collection with rarity display

## 🏆 Token System

### Activity Multipliers
- **Run**: 2 tokens/km
- **Walk**: 1 token/km  
- **Cycle**: 1.5 tokens/km
- **Swim**: 3 tokens/km
- **Pushups**: 0.2 tokens/pushup
- **Yoga**: 1 token/minute
- **Weightlifting**: 2 tokens/minute
- **Stretching**: 1 token/minute
- **Minimum**: 10 tokens per activity

### Badge Milestones
- 🥉 **Bronze**: 10 activities
- 🥈 **Silver**: 25 activities
- 🥇 **Gold**: 50 activities
- 🌌 **Cosmic**: 100 activities

## 🔧 Development

### Backend Commands
```bash
# Run tests
PYTHONPATH=backend pytest backend/tests/ -v

# Seed database
PYTHONPATH=backend python backend/scripts/seed_comprehensive.py

# Generate JWT token
PYTHONPATH=backend python backend/scripts/dev_jwt.py [wallet_address]
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev

# Build
npm run build

# Lint
npm run lint
```

## 📊 Sample Data

The seeding script creates:
- 5 users with different activity levels
- 235+ realistic activities across 3 months
- Proper token calculations based on activity types
- Badge progressions for testing
- Sample reward claims

## 🌐 API Endpoints

- `POST /auth/siwe` - SIWE authentication
- `GET /auth/me` - User profile
- `POST /activities/log` - Log activity
- `GET /activities/me` - User activities
- `GET /rewards/pending` - Pending rewards
- `POST /rewards/claim` - Claim reward
- `GET /rewards/history` - Reward history
- `GET /leaderboard` - Leaderboard
- `GET /badges/me` - User badges

## 🔐 Environment Variables

Create `backend/.env`:
```
RPC_URL=https://mainnet.infura.io/v3/demo
ADMIN_PRIVATE_KEY=0x1234567890abcdef...
JWT_SECRET=dev_secret_key_for_testing_only
```

## 🎉 Ready to Use!

Your CosmicFit dApp is now fully functional with:
- ✅ Real API integration
- ✅ Dynamic token calculation
- ✅ Proper badge milestones
- ✅ Sample data for testing
- ✅ Clean project structure
- ✅ Easy startup scripts

Start both servers and begin your cosmic fitness journey! 🚀
