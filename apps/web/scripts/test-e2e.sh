#!/bin/bash

# E2E Test Runner Script
# Starts the development server and runs Puppeteer tests

set -e

echo "🚀 Starting TravelSync E2E Test Runner..."

# Function to cleanup background processes
cleanup() {
    echo "🧹 Cleaning up background processes..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    # Kill any remaining processes on port 3001
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Check if port 3001 is already in use
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3001 is already in use. Attempting to kill existing process..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# Start the development server in background
echo "🔧 Starting development server on port 3001..."
pnpm dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to be ready..."
timeout=60
counter=0

while ! curl -s http://localhost:3001 > /dev/null 2>&1; do
    if [ $counter -eq $timeout ]; then
        echo "❌ Server failed to start within $timeout seconds"
        exit 1
    fi
    counter=$((counter + 1))
    sleep 1
    if [ $((counter % 10)) -eq 0 ]; then
        echo "   Still waiting... ($counter seconds)"
    fi
done

echo "✅ Server is ready!"

# Run the setup test first to verify Puppeteer is working
echo "🧪 Running Puppeteer setup test..."
pnpm run test:e2e -- tests/puppeteer-setup.test.ts

if [ $? -eq 0 ]; then
    echo "✅ Puppeteer setup test passed!"
    
    # Run a simple application test
    echo "🧪 Running simple application test..."
    pnpm run test:e2e -- tests/simple.test.ts
    
    if [ $? -eq 0 ]; then
        echo "✅ Simple application test passed!"
        echo "🎉 E2E tests completed successfully!"
    else
        echo "❌ Simple application test failed"
        exit 1
    fi
else
    echo "❌ Puppeteer setup test failed"
    exit 1
fi