# 🗄️ Database Setup Guide

This guide will help you set up the database connection for your Classroom Assignment Portal.

## 📋 Prerequisites

- Node.js installed
- Internet connection (for cloud database)
- OR MongoDB installed locally

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud) - **Recommended**

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/classroom-portal?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. **Install MongoDB:**
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Install and start the MongoDB service

2. **Update .env file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/classroom-portal
   ```

## ⚙️ Environment Configuration

Create/update your `server/.env` file:

```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database Configuration (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/classroom-portal

# OR MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/classroom-portal?retryWrites=true&w=majority

# Security
JWT_SECRET=classroom_portal_jwt_secret_key_2024_secure_token

# Optional Database Settings
DB_MAX_POOL_SIZE=10
DB_TIMEOUT_MS=30000
```

## 🧪 Test Your Connection

Run these commands to test your database setup:

```bash
# Test database connection
node server/setupDatabase.js test

# Check database health
node server/setupDatabase.js health

# Seed database with sample data
node server/seedDatabase.js
```

## 🔧 Troubleshooting

### Common Issues:

1. **"MONGODB_URI is not defined"**
   - Make sure your `.env` file exists in the `server/` directory
   - Check that `MONGODB_URI` is set correctly

2. **"ENOTFOUND" or "Network timeout"**
   - Check your internet connection
   - Verify the MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas

3. **"Authentication failed"**
   - Check username and password in connection string
   - Verify database user permissions in MongoDB Atlas

4. **Local MongoDB not connecting**
   - Ensure MongoDB service is running
   - Check if port 27017 is available
   - Try starting MongoDB manually: `mongod --dbpath "C:\data\db"`

### Connection String Examples:

**Local MongoDB:**
```
mongodb://localhost:27017/classroom-portal
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/classroom-portal?retryWrites=true&w=majority
```

**Local MongoDB with Authentication:**
```
mongodb://username:password@localhost:27017/classroom-portal
```

## 📊 Database Structure

The application uses these collections:
- `users` - Student and teacher accounts
- `assignments` - Assignment details
- `submissions` - Student submissions and grades

## 🔐 Security Best Practices

1. **Never commit .env files** to version control
2. **Use strong passwords** for database users
3. **Whitelist specific IPs** in MongoDB Atlas
4. **Rotate JWT secrets** regularly
5. **Use environment-specific databases** (dev/prod)

## 🚀 Production Deployment

For production deployment:

1. **Use MongoDB Atlas** or dedicated MongoDB server
2. **Set strong JWT_SECRET**
3. **Enable database authentication**
4. **Use SSL/TLS connections**
5. **Set up database backups**

Example production .env:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:strong_password@production-cluster.xxxxx.mongodb.net/classroom-portal-prod?retryWrites=true&w=majority
JWT_SECRET=super_secure_jwt_secret_for_production_use_only
```

## 📞 Support

If you encounter issues:
1. Check the console output for specific error messages
2. Run the database test: `node server/setupDatabase.js test`
3. Verify your .env configuration
4. Check MongoDB Atlas dashboard for connection issues

## 🎯 Next Steps

After setting up the database:
1. Run `node server/seedDatabase.js` to populate sample data
2. Start the server: `npm run server`
3. Start the client: `npm run client`
4. Access the application at http://localhost:3000