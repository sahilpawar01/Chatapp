# Setup Guide

## Environment Variables Setup

### Backend .env File

Create a file named `.env` in the `backend` folder with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://sahilpawarsitcomp_db_user:e1g9kA4kZsSGvdZN@cluster0.pi3qtso.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `your_super_secret_jwt_key_change_this_in_production` with a strong, random secret key for production use.

### Frontend .env File

Create a file named `.env` in the `frontend` folder with the following content:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Running the Application

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Building for Production

### Backend

```bash
cd backend
npm run build  # Not needed for Node.js, but you can run:
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory.

## Deployment on Render

### Backend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository: `sahilpawar01/chat`
4. Configure:
   - **Name**: chat-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://sahilpawarsitcomp_db_user:e1g9kA4kZsSGvdZN@cluster0.pi3qtso.mongodb.net/chatdb?retryWrites=true&w=majority&appName=Cluster0`
   - `JWT_SECRET`: (Use a strong random string)
   - `FRONTEND_URL`: (Your frontend URL after deployment)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave empty for Render to assign)

### Frontend Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository: `sahilpawar01/chat`
4. Configure:
   - **Name**: chat-frontend
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: (Your backend API URL, e.g., `https://chat-backend.onrender.com/api`)
   - `VITE_SOCKET_URL`: (Your backend Socket.io URL, e.g., `https://chat-backend.onrender.com`)

**Note:** After deploying the backend, update the frontend environment variables with the actual backend URLs.

## Testing the Application

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Register a new account
4. Open another browser window/incognito and register another account
5. Start chatting between the two accounts!

