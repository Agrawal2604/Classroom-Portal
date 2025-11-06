#!/usr/bin/env node

/**
 * Production startup script for Classroom Assignment Portal
 * This script ensures proper environment setup and graceful shutdown
 */

const cluster = require('cluster');
const os = require('os');

// Set production environment
process.env.NODE_ENV = 'production';

if (cluster.isMaster) {
  console.log('🚀 Starting Classroom Assignment Portal in production mode');
  console.log(`📊 Master process ${process.pid} is running`);
  
  // Fork workers (for production scaling)
  const numCPUs = process.env.WEB_CONCURRENCY || 1;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`💀 Worker ${worker.process.pid} died`);
    console.log('🔄 Starting a new worker');
    cluster.fork();
  });
  
} else {
  // Worker process - start the actual server
  require('./server.js');
  console.log(`👷 Worker ${process.pid} started`);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});