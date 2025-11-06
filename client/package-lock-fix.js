#!/usr/bin/env node

// Script to fix package-lock issues
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Fixing package-lock issues...');

try {
  // Remove package-lock.json and node_modules
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('📦 Removed package-lock.json');
  }
  
  if (fs.existsSync('node_modules')) {
    execSync('rm -rf node_modules', { stdio: 'inherit' });
    console.log('📦 Removed node_modules');
  }
  
  // Clean install
  console.log('📦 Running clean install...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('✅ Package-lock fixed!');
} catch (error) {
  console.error('❌ Fix failed:', error.message);
}