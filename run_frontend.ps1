# PowerShell script for running CosmicFit Frontend
Write-Host "🚀 Starting CosmicFit Frontend..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check if frontend directory exists
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: frontend directory not found" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js not found" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Set-Location frontend

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error: Failed to install dependencies" -ForegroundColor Red
        Write-Host "Try running: npm install --legacy-peer-deps --force" -ForegroundColor Yellow
        exit 1
    }
}

# Start dev server
Write-Host "🔥 Starting Vite dev server..." -ForegroundColor Yellow
Write-Host "   Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
npm run dev
