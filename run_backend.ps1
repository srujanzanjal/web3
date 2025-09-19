# PowerShell script for running CosmicFit Backend
Write-Host "🚀 Starting CosmicFit Backend..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if backend directory exists
if (-not (Test-Path "backend")) {
    Write-Host "❌ Error: backend directory not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "❌ Error: Virtual environment not found" -ForegroundColor Red
    Write-Host "Please create a virtual environment first:" -ForegroundColor Yellow
    Write-Host "  python -m venv .venv" -ForegroundColor Cyan
    Write-Host "  .venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    exit 1
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& .venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Set-Location backend
pip install -r requirements.txt

# Initialize database
Write-Host "🗄️  Initializing database..." -ForegroundColor Yellow
$env:PYTHONPATH = "."
python migrations\0001_init.py

# Seed database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
$env:PYTHONPATH = "."
python scripts\seed_comprehensive.py

# Start server
Write-Host "🔥 Starting FastAPI server..." -ForegroundColor Yellow
Write-Host "   Backend will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   API docs will be available at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
uvicorn app.main:app --host 0.0.0.0 --port 9000 --reload
