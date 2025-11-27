# 🔍 Troubleshooting Guide

## How to Check Backend Logs in Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **backend service** (e.g., `chat-backend`)
3. Click on the **"Logs"** tab
4. Look for error messages (they'll be in red)
5. Copy the error message and share it

## Common 500 Error Causes

### 1. JWT_SECRET Not Set

**Symptom:** Error mentions "JWT_SECRET" or token generation fails

**Fix:**
1. Go to backend service → **Environment** tab
2. Make sure `JWT_SECRET` is set
3. It should be a long random string, e.g., `my_super_secret_jwt_key_2024_xyz123`
4. Save and redeploy

### 2. MongoDB Connection Issue

**Symptom:** Error mentions "MongoDB" or "connection"

**Fix:**
1. Verify `MONGODB_URI` is set correctly in backend environment variables
2. Check MongoDB Atlas Network Access allows `0.0.0.0/0`
3. Verify the connection string is correct

### 3. Validation Error

**Symptom:** Error mentions "validation" or specific field names

**Fix:**
- Check that all required fields are provided
- Username: 3-20 characters
- Email: Valid email format
- Password: At least 6 characters

### 4. Duplicate User Error

**Symptom:** Error says "User already exists" or duplicate key error

**Fix:**
- Try a different username or email
- Or delete the existing user from MongoDB Atlas

## Quick Checklist

- [ ] `JWT_SECRET` is set in backend environment variables
- [ ] `MONGODB_URI` is set correctly
- [ ] `FRONTEND_URL` is set to your frontend URL
- [ ] `NODE_ENV` is set to `production`
- [ ] MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)
- [ ] Backend service is running (check status in Render)
- [ ] Check backend logs for specific error messages

## Getting Detailed Error Information

After the latest update, errors should now show more details in the response. Try registering again and check:

1. **Browser Console:** Look at the error response in the Network tab
2. **Backend Logs:** Check Render logs for detailed error information
3. **Error Response:** The API should now return more descriptive error messages

## Next Steps

1. **Check Render Logs** - This will show the exact error
2. **Verify Environment Variables** - Make sure all are set correctly
3. **Try Again** - After fixing issues, try registering again

## Still Having Issues?

Share the error message from:
- Render backend logs
- Browser console (Network tab → failed request → Response)

This will help identify the exact issue!

