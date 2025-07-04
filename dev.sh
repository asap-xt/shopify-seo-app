#!/bin/bash

# Development startup script for Shopify SEO App

echo "🚀 Starting Shopify SEO App in development mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Shopify API credentials."
    echo "Required variables:"
    echo "  - SHOPIFY_API_KEY"
    echo "  - SHOPIFY_API_SECRET"
    echo "  - SHOPIFY_SCOPES"
    echo "  - SHOPIFY_APP_URL"
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend dev server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Development servers started!"
echo "Backend: http://localhost:8081"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 