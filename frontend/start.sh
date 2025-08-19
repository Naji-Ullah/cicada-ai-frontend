#!/bin/bash

echo "🚀 Starting AI Chat Application..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup.sh first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please run ./setup.sh first."
    exit 1
fi

# Start Django backend
echo "🔧 Starting Django backend..."
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo "🎨 Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8000"
echo "📊 Admin: http://localhost:8000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait 