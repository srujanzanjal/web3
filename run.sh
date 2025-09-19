#!/bin/sh
# Universal launcher for CosmicFit
# Detects the operating system and runs the appropriate script

echo "🌌 CosmicFit Universal Launcher"
echo "==============================="
echo ""

# Detect operating system
case "$(uname -s)" in
    Linux*)
        OS="Linux"
        ;;
    Darwin*)
        OS="macOS"
        ;;
    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        OS="Windows"
        ;;
    *)
        OS="Unknown"
        ;;
esac

echo "🖥️  Detected OS: $OS"
echo ""

# Check if we are in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Project directories not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "🚀 Available commands:"
echo "  1) Start Backend"
echo "  2) Start Frontend"
echo "  3) Start Both (Backend + Frontend)"
echo "  4) Exit"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo "Starting Backend..."
        ./run_backend.sh
        ;;
    2)
        echo "Starting Frontend..."
        ./run_frontend.sh
        ;;
    3)
        echo "Starting Both Backend and Frontend..."
        echo "Backend will start in the background..."
        ./run_backend.sh &
        sleep 3
        echo "Frontend will start now..."
        ./run_frontend.sh
        ;;
    4)
        echo "Goodbye! 👋"
        exit 0
        ;;
    *)
        echo "Invalid option. Please choose 1-4."
        exit 1
        ;;
esac
