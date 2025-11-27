# Render Deployment Guide - Step by Step

This guide will walk you through deploying both the backend and frontend to Render.

## Prerequisites
- GitHub account with the repository: `sahilpawar01/chat`
- Render account (sign up at https://render.com if needed)
- MongoDB Atlas connection string ready

---

## Step 1: Deploy Backend First

### 1.1 Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### 1.2 Connect GitHub Repository

1. If not connected, click **"Connect GitHub"** and authorize Render
2. Search for repository: `sahilpawar01/chat`
3. Click **"Connect"**

### 1.3 Configure Backend Service

Fill in the following details:

- **Name**: `chat-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 1.4 Set Environment Variables

Click on **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://sahilpawarsitcomp_db_user:e1g9kA4kZsSGvdZN@cluster0.pi3qtso.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | Generate a strong random string (e.g., use: `openssl rand -base64 32` or any random string) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | Leave empty for now, we'll update after frontend deployment |

**Note:** For `JWT_SECRET`, you can use any long random string. Example: `my_super_secret_jwt_key_2024_production_xyz123`

### 1.5 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (usually 2-5 minutes)
3. Once deployed, you'll see a URL like: `https://chat-backend-xxxx.onrender.com`
4. **Copy this URL** - you'll need it for frontend configuration

### 1.6 Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see: `{"status":"OK","message":"Server is running"}`

---

## Step 2: Deploy Frontend

### 2.1 Create Frontend Static Site

1. In Render Dashboard, click **"New +"**
2. Select **"Static Site"**

### 2.2 Connect GitHub Repository

1. Select the same repository: `sahilpawar01/chat`
2. Click **"Connect"**

### 2.3 Configure Frontend Service

Fill in the following details:

- **Name**: `chat-frontend` (or any name you prefer)
- **Branch**: `main`
- **Root Directory**: `frontend` ⚠️ **IMPORTANT: Set this to `frontend`**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 2.4 Set Environment Variables

Click **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com/api` (Replace with your actual backend URL) |
| `VITE_SOCKET_URL` | `https://your-backend-url.onrender.com` (Replace with your actual backend URL) |

**Example:**
- If your backend URL is `https://chat-backend-abc123.onrender.com`
- Then:
  - `VITE_API_URL` = `https://chat-backend-abc123.onrender.com/api`
  - `VITE_SOCKET_URL` = `https://chat-backend-abc123.onrender.com`

### 2.5 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://chat-frontend-xxxx.onrender.com`

### 2.6 Update Backend FRONTEND_URL

1. Go back to your backend service in Render
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL` to your frontend URL: `https://your-frontend-url.onrender.com`
4. Click **"Save Changes"** - this will trigger a redeploy

---

## Step 3: Final Configuration

### 3.1 Verify MongoDB Connection

1. Check backend logs in Render dashboard
2. You should see: `MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net`
3. If you see connection errors, verify your MongoDB Atlas:
   - Network Access: Add `0.0.0.0/0` (allow all IPs) or Render's IPs
   - Database User: Verify username and password

### 3.2 Test the Application

1. Visit your frontend URL
2. Register a new account
3. Open another browser/incognito window
4. Register another account
5. Start chatting!

---

## Troubleshooting

### Backend Issues

**Problem:** Backend fails to start
- **Solution:** Check logs, verify all environment variables are set correctly

**Problem:** MongoDB connection fails
- **Solution:** 
  1. Check MongoDB Atlas Network Access (allow all IPs: `0.0.0.0/0`)
  2. Verify connection string is correct
  3. Check database user credentials

**Problem:** CORS errors
- **Solution:** Make sure `FRONTEND_URL` in backend matches your frontend URL exactly

### Frontend Issues

**Problem:** API calls fail
- **Solution:** Verify `VITE_API_URL` is correct and includes `/api` at the end

**Problem:** Socket.io connection fails
- **Solution:** Verify `VITE_SOCKET_URL` is correct (without `/api`)

**Problem:** Build fails
- **Solution:** Check build logs, ensure all dependencies are in package.json

### Common Issues

**Problem:** Services go to sleep (free tier)
- **Solution:** Free tier services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds. Consider upgrading to paid tier for always-on service.

**Problem:** Environment variables not working
- **Solution:** After adding/updating env vars, service auto-redeploys. Wait for deployment to complete.

---

## Quick Reference

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://sahilpawarsitcomp_db_user:e1g9kA4kZsSGvdZN@cluster0.pi3qtso.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_strong_random_secret_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

---

## MongoDB Atlas Network Access Setup

If you haven't already:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster
3. Go to **"Network Access"** (left sidebar)
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
6. Click **"Confirm"**

This allows Render to connect to your MongoDB Atlas database.

---

## Success Checklist

- [ ] Backend deployed and accessible
- [ ] Backend health check returns OK
- [ ] Frontend deployed and accessible
- [ ] Frontend environment variables set correctly
- [ ] Backend FRONTEND_URL updated with frontend URL
- [ ] MongoDB connection successful (check logs)
- [ ] Can register new users
- [ ] Can login
- [ ] Can send messages between users
- [ ] Real-time messaging works

---

## Need Help?

- Check Render logs: Dashboard → Your Service → Logs
- Check MongoDB Atlas logs: Atlas Dashboard → Monitoring
- Verify all environment variables are set correctly
- Ensure root directories are set correctly (`backend` and `frontend`)

