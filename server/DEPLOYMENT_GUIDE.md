# 🚀 Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas database (already configured)

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Navigate to your project
cd "C:\Users\agraw\OneDrive\Desktop\Assignment portal"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Create GitHub repository and push
# (Follow GitHub's instructions to create a new repository)
```

### 2. Deploy on Render

#### Option A: Using Render Dashboard
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `classroom-portal-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Option B: Using render.yaml (Recommended)
1. Push the `render.yaml` file to your repository
2. Render will automatically detect and deploy using the configuration

### 3. Set Environment Variables
In Render Dashboard → Your Service → Environment:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://himanshi_26:HIMANSHI26@cluster0.zxv4ai4.mongodb.net/classroom-portal?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_for_production_2024
```

### 4. Update Frontend Configuration
After deployment, update your frontend to use the Render URL:

```javascript
// In client/src/utils/api.js
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-app-name.onrender.com' 
    : 'http://localhost:3001',
  timeout: 15000,
});
```

## Important Notes

### Security
- Generate a new JWT_SECRET for production
- Never commit .env files to GitHub
- Use Render's environment variables for sensitive data

### Database
- Your MongoDB Atlas database is already configured
- No changes needed for the database connection

### CORS
- Update the allowedOrigins in server.js with your frontend URL
- Add your production frontend domain to the CORS configuration

### Free Tier Limitations
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep may take 30+ seconds
- Consider upgrading for production use

## Testing Deployment

### 1. Health Check
```bash
curl https://your-app-name.onrender.com/api/test
```

### 2. Login Test
```bash
curl -X POST https://your-app-name.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"password123"}'
```

## Troubleshooting

### Common Issues
1. **Build Fails**: Check Node.js version compatibility
2. **Database Connection**: Verify MongoDB URI and network access
3. **CORS Errors**: Update allowedOrigins with your frontend URL
4. **Environment Variables**: Ensure all required vars are set in Render

### Logs
- Check Render logs in the dashboard
- Look for startup errors and connection issues

## Post-Deployment Checklist
- [ ] Service deploys successfully
- [ ] Health check endpoint works
- [ ] Database connection established
- [ ] Authentication endpoints work
- [ ] CORS configured for frontend
- [ ] Environment variables set
- [ ] Frontend updated with production API URL

## Your Deployment URLs
- **API Base**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/api/test`
- **Login Endpoint**: `https://your-app-name.onrender.com/api/auth/login`

Replace `your-app-name` with your actual Render service name.