#!/bin/bash

echo "Installing dependencies..."
(cd frontend && npm install) & (cd backend && npm install)
wait  # Ensure installations complete before proceeding

echo "Starting the servers..."
(cd backend && node server.js) & (cd frontend && npm run dev) &
sleep 3  # Allow time for servers to start

# Open the website in the browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000 &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 &
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start http://localhost:3000 &
else
    echo "Could not detect OS to open browser automatically."
fi

# Keep script running to prevent it from exiting immediately
wait
