@echo off
REM Windows batch file for running CosmicFit Backend
echo 🚀 Starting CosmicFit Backend...
echo =================================

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist ".venv" (
    echo ❌ Error: Virtual environment not found
    echo Please create a virtual environment first:
    echo   python -m venv .venv
    echo   .venv\Scripts\activate
    pause
    exit /b 1
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call .venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing dependencies...
cd backend
pip install -r requirements.txt

REM Initialize database
echo 🗄️  Initializing database...
set PYTHONPATH=.
python migrations\0001_init.py

REM Seed database
echo 🌱 Seeding database with sample data...
set PYTHONPATH=.
python scripts\seed_comprehensive.py

REM Start server
echo 🔥 Starting FastAPI server...
echo    Backend will be available at: http://localhost:8000
echo    API docs will be available at: http://localhost:8000/docs
echo    Press Ctrl+C to stop the server
echo.
uvicorn app.main:app --host 0.0.0.0 --port 9000 --reload
