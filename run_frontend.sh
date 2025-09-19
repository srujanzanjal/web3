#!/bin/sh
# Portable script for running CosmicFit Frontend
# Compatible with: bash, ksh, zsh, dash, sh

echo "🚀 Starting CosmicFit Frontend..."
echo "=================================="

# Check if we are in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if Node.js is available
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js not found"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm >/dev/null 2>&1; then
    echo "❌ Error: npm not found"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

cd frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        echo "Try running: npm install --legacy-peer-deps --force"
        exit 1
    fi
fi

# Start Vite dev server
echo "🔥 Starting Vite dev server..."
echo "   Frontend will be available at: http://localhost:5173"
echo "   Press Ctrl+C to stop the server"
echo ""
npm run dev
