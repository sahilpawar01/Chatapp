# 🔧 Fix Environment Variables in Render

## The Problem

Your frontend is still using the placeholder URL `your-backend-url.onrender.com` instead of your actual backend URL. This is why you're getting CORS errors and 404 errors.

## Solution: Update Frontend Environment Variables

### Step 1: Find Your Backend URL

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **backend service** (e.g., `chat-backend`)
3. Look at the top of the page - you'll see your backend URL
   - Example: `https://chat-backend-abc123.onrender.com`
4. **Copy this URL** - you'll need it in the next step

### Step 2: Update Frontend Environment Variables

1. In Render Dashboard, click on your **frontend service** (e.g., `chat-frontend`)
2. Go to the **"Environment"** tab (left sidebar)
3. Find these two environment variables:
   - `VITE_API_URL`
   - `VITE_SOCKET_URL`

4. **Update `VITE_API_URL`:**
   - Current (wrong): `https://your-backend-url.onrender.com/api`
   - Change to: `https://your-actual-backend-url.onrender.com/api`
   - Example: `https://chat-backend-abc123.onrender.com/api`
   - ⚠️ **Make sure it ends with `/api`**

5. **Update `VITE_SOCKET_URL`:**
   - Current (wrong): `https://your-backend-url.onrender.com`
   - Change to: `https://your-actual-backend-url.onrender.com`
   - Example: `https://chat-backend-abc123.onrender.com`
   - ⚠️ **Do NOT include `/api` here**

6. Click **"Save Changes"** at the bottom
7. Render will automatically rebuild and redeploy your frontend (takes 2-5 minutes)

### Step 3: Verify Backend FRONTEND_URL

While you're at it, also check your backend environment variables:

1. Go to your **backend service** in Render
2. Go to **"Environment"** tab
3. Check `FRONTEND_URL` is set to:
   - `https://chat-frontend-52ux.onrender.com`
4. If not, update it and save

### Step 4: Wait for Redeployment

- Frontend will automatically rebuild after you save the environment variables
- Wait for the deployment to complete (check the "Events" tab)
- You'll see "Live" status when it's ready

### Step 5: Test

1. Visit your frontend URL: `https://chat-frontend-52ux.onrender.com`
2. Try to register a new account
3. The CORS errors should be gone!

## Quick Reference

### Frontend Environment Variables (in Render)
```
VITE_API_URL = https://YOUR-BACKEND-URL.onrender.com/api
VITE_SOCKET_URL = https://YOUR-BACKEND-URL.onrender.com
```

### Backend Environment Variables (in Render)
```
MONGODB_URI = mongodb+srv://sahilpawarsitcomp_db_user:e1g9kA4kZsSGvdZN@cluster0.pi3qtso.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET = your_strong_random_secret_key_here
NODE_ENV = production
FRONTEND_URL = https://chat-frontend-52ux.onrender.com
```

## Important Notes

1. **Vite Environment Variables**: Vite requires environment variables to be prefixed with `VITE_`
2. **Rebuild Required**: After changing environment variables, the frontend must rebuild for changes to take effect
3. **No Trailing Slash**: Don't add trailing slashes to URLs (except `/api` in `VITE_API_URL`)
4. **HTTPS Required**: Make sure all URLs use `https://` not `http://`

## Still Having Issues?

If you're still getting errors after updating:

1. **Clear browser cache** or use incognito mode
2. **Check backend logs** in Render to see if requests are reaching the server
3. **Verify backend is running** - check the "Logs" tab in your backend service
4. **Double-check URLs** - make sure there are no typos

