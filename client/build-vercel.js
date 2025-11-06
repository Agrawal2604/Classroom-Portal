#!/usr/bin/env node

// Custom build script for Vercel
const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');

try {
  // Set environment variables
  process.env.CI = 'false';
  process.env.GENERATE_SOURCEMAP = 'false';
  process.env.ESLINT_NO_DEV_ERRORS = 'true';
  process.env.DISABLE_ESLINT_PLUGIN = 'true';
  
  console.log('📦 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('🔨 Building React app...');
  execSync('react-scripts build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}