# 🔧 Vercel Deployment Troubleshooting Guide

## Common Build Errors and Solutions

### 1. "npm run build" Fails on Vercel

#### Solution A: Environment Variables
Make sure these are set in Vercel Dashboard → Environment Variables:
```
CI=false
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=https://classroom-portal-0epc.onrender.com
```

#### Solution B: Build Command Override
In Vercel Dashboard → Settings → Build & Development Settings:
- **Build Command**: `CI=false npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 2. ESLint Warnings Causing Build Failure

#### Solution: Disable ESLint in Production
Add to Vercel environment variables:
```
ESLINT_NO_DEV_ERRORS=true
DISABLE_ESLINT_PLUGIN=true
```

### 3. Memory Issues During Build

#### Solution: Increase Node.js Memory
In Vercel Dashboard → Environment Variables:
```
NODE_OPTIONS=--max_old_space_size=4096
```

### 4. TypeScript Errors (if any)

#### Solution: Skip Type Checking
Add to environment variables:
```
TSC_COMPILE_ON_ERROR=true
SKIP_PREFLIGHT_CHECK=true
```

## 🚀 Recommended Vercel Configuration

### Project Settings
- **Framework Preset**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`
- **Development Command**: `npm start`

### Environment Variables
```
CI=false
GENERATE_SOURCEMAP=false
REACT_APP_API_URL=https://classroom-portal-0epc.onrender.com
REACT_APP_ENVIRONMENT=production
ESLINT_NO_DEV_ERRORS=true
DISABLE_ESLINT_PLUGIN=true
```

### Node.js Version
- **Node.js Version**: 18.x (recommended)

## 🔍 Debugging Steps

### 1. Check Build Logs
- Go to Vercel Dashboard → Deployments
- Click on failed deployment
- Check "Build Logs" for specific errors

### 2. Test Locally
```bash
cd client
npm run build
```

### 3. Check Dependencies
```bash
npm audit
npm update
```

### 4. Clear Cache
In Vercel Dashboard → Settings → Functions:
- Clear build cache and redeploy

## 📋 Pre-Deployment Checklist

- [ ] All files committed to Git
- [ ] Build works locally (`npm run build`)
- [ ] No TypeScript/ESLint errors
- [ ] Environment variables configured
- [ ] Backend URL is correct
- [ ] CORS configured on backend

## 🆘 If Build Still Fails

### Option 1: Manual Build Override
In vercel.json:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build",
        "buildCommand": "CI=false npm run build"
      }
    }
  ]
}
```

### Option 2: Use Different Build Command
Try these build commands in Vercel:
- `npm run build`
- `CI=false npm run build`
- `npm run vercel-build`
- `yarn build`

### Option 3: Deploy Build Folder Directly
1. Run `npm run build` locally
2. Deploy only the `build` folder to Vercel
3. Use "Static" preset instead of "Create React App"

## 📞 Support
If you're still having issues, check:
1. Vercel build logs for specific error messages
2. Node.js version compatibility
3. Package.json dependencies
4. Environment variables spelling

Your frontend is ready for deployment! 🚀