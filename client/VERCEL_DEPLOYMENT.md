# 🚀 Vercel Deployment Guide for Frontend

## Your Backend URL
✅ **Backend API**: https://classroom-portal-0epc.onrender.com

## Step-by-Step Vercel Deployment

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/login with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your classroom portal

3. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://classroom-portal-0epc.onrender.com
   REACT_APP_ENVIRONMENT=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: classroom-portal-frontend
# - Directory: ./
# - Override settings? Y
# - Build Command: npm run build
# - Output Directory: build
# - Development Command: npm start
```

## Important Configuration

### Vercel Settings
- **Framework**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Node.js Version**: 18.x

### Environment Variables (Required)
```
REACT_APP_API_URL=https://classroom-portal-0epc.onrender.com
REACT_APP_ENVIRONMENT=production
```

## After Deployment

### 1. Update Backend CORS
Your backend is already configured to allow Vercel domains, but you may need to update the specific domain after deployment.

### 2. Test Your Application
- Frontend: `https://your-app-name.vercel.app`
- Test login with: teacher@test.com / password123

### 3. Custom Domain (Optional)
You can add a custom domain in Vercel dashboard under "Domains"

## Troubleshooting

### Common Issues
1. **Build Fails**: Check Node.js version compatibility
2. **API Calls Fail**: Verify REACT_APP_API_URL environment variable
3. **CORS Errors**: Update backend CORS configuration
4. **Routing Issues**: Vercel.json handles SPA routing

### Logs
- Check build logs in Vercel dashboard
- Check function logs for runtime errors

## Your URLs After Deployment
- **Frontend**: https://classroom-portal-frontend.vercel.app (example)
- **Backend**: https://classroom-portal-0epc.onrender.com ✅

## Files Created for Deployment
- ✅ vercel.json - Vercel configuration
- ✅ .env.production - Environment variables
- ✅ Updated package.json - Build scripts
- ✅ .gitignore - Ignore unnecessary files