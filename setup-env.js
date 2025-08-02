#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up environment variables for your portfolio...\n');

// Frontend environment setup
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
const frontendEnvContent = `# Frontend Environment Variables
# API Configuration
VITE_API_URL=http://localhost:5000/api

# For production, uncomment and update the line below:
# VITE_API_URL=https://your-backend-domain.vercel.app/api
`;

// Backend environment setup
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const backendEnvContent = `# Backend Environment Variables
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Environment
NODE_ENV=development

# For production, change NODE_ENV to 'production'
`;

try {
  // Create frontend .env file
  if (!fs.existsSync(frontendEnvPath)) {
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Created frontend/.env file');
  } else {
    console.log('⚠️  frontend/.env already exists, skipping...');
  }

  // Create backend .env file
  if (!fs.existsSync(backendEnvPath)) {
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    console.log('✅ Created backend/.env file');
  } else {
    console.log('⚠️  backend/.env already exists, skipping...');
  }

  console.log('\n📝 Next steps:');
  console.log('1. Update backend/.env with your MongoDB connection string');
  console.log('2. For production deployment:');
  console.log('   - Update frontend/.env with your production API URL');
  console.log('   - Set environment variables in Vercel dashboard');
  console.log('3. Start your development servers:');
  console.log('   - Backend: cd backend && npm start');
  console.log('   - Frontend: cd frontend && npm run dev');

} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
} 