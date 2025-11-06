#!/bin/bash
echo "Building frontend..."
cd client
npm install
npm run build
echo "Build completed!"