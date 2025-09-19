#!/bin/sh
# Portable script for running CosmicFit Backend
# Compatible with: bash, ksh, zsh, dash, sh

echo "🚀 Starting CosmicFit Backend..."
echo "================================="

# Check if we are in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Error: Virtual environment not found"
    echo "Please create a virtual environment first:"
    echo "  python -m venv .venv"
    echo "  source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
. .venv/bin/activate

# Check if Python is available
if ! command -v python >/dev/null 2>&1; then
    echo "❌ Error: Python not found"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
pip install -r requirements.txt

# Initialize database
echo "🗄️  Initializing database..."
PYTHONPATH=. python migrations/0001_init.py

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
PYTHONPATH=. python scripts/seed_comprehensive.py

# Start FastAPI server
echo "🔥 Starting FastAPI server..."
echo "   Backend will be available at: http://localhost:8000"
echo "   API docs will be available at: http://localhost:8000/docs"
echo "   Press Ctrl+C to stop the server"
echo ""
uvicorn app.main:app --host 0.0.0.0 --port 9000 --reload
