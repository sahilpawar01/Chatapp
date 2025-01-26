import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === "production" ? "https://your-frontend-url.onrender.com" : "http://localhost:4001",
    credentials: true
}));

const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/dist")));
}

try {
    mongoose.connect(URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log(error);
}

//routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Handle React routing in production
if (process.env.NODE_ENV === "production") {
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Server is Running on port ${PORT}`);
});