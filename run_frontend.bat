@echo off
REM Windows batch file for running CosmicFit Frontend
echo 🚀 Starting CosmicFit Frontend...
echo ==================================

REM Check if frontend directory exists
if not exist "frontend" (
    echo ❌ Error: frontend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js not found
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

cd frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ Error: Failed to install dependencies
        echo Try running: npm install --legacy-peer-deps --force
        pause
        exit /b 1
    )
)

REM Start dev server
echo 🔥 Starting Vite dev server...
echo    Frontend will be available at: http://localhost:5173
echo    Press Ctrl+C to stop the server
echo.
npm run dev
