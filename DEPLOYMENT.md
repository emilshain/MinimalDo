# Deployment Guide

## Backend (Django) on Render

### 1. Prepare the repository
Push your code to GitHub (including backend/ folder with Procfile, runtime.txt, requirements.txt)

### 2. Create a Render account
Go to https://render.com and sign up

### 3. Create a new Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the repository and branch

### 4. Configure the service
- **Name**: `minimal-do-api` (or your choice)
- **Runtime**: Python
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: (should auto-detect from Procfile)
- **Root Directory**: `backend`

### 5. Set Environment Variables
In Render dashboard → Environment:
```
DEBUG=False
SECRET_KEY=<generate-a-random-key>
ALLOWED_HOSTS=minimal-do-api.onrender.com,your-frontend-domain.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
```

### 6. Deploy
Click "Deploy" and wait for completion. Your backend URL will be like:
`https://minimal-do-api.onrender.com`

---

## Frontend (React) on Vercel

### 1. Build frontend
From `frontend/` folder, run:
```bash
npm install
npm run build
```

### 2. Create a Vercel account
Go to https://vercel.com and sign up with GitHub

### 3. Import your project
- Click "Add New..." → "Project"
- Import your GitHub repository
- Select root directory as `frontend`

### 4. Configure build settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 5. Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://minimal-do-api.onrender.com/api
```

### 6. Deploy
Click "Deploy" and wait for completion. Your frontend URL will be like:
`https://minimal-do-frontend.vercel.app`

---

## Update Backend CORS

Go back to your Render service and update:
```
CORS_ALLOWED_ORIGINS=https://minimal-do-frontend.vercel.app
ALLOWED_HOSTS=minimal-do-api.onrender.com,minimal-do-frontend.vercel.app
```

Then redeploy the backend.

---

## Test the connection
1. Visit your Vercel frontend URL
2. Try to register/login
3. If CORS errors appear in console, double-check environment variables on both services
