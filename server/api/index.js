import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRouter from '../routes/userRouter.js';
import imageRouter from '../routes/imageRoutes.js';

const app = express();

// Favicon handler - prevent 404 errors
app.get('/favicon.ico', (req, res) => res.status(204));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS Configuration - Allow all for production (Vercel)
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle preflight requests
app.options('*', cors());

// Lazy MongoDB connection
let isDbConnected = false;

const connectDB = async () => {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return true;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  console.log("MongoDB URI exists:", !!mongoUri);
  
  if (!mongoUri) {
    console.error("MONGODB_URI not found in environment variables");
    return false;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isDbConnected = true;
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    isDbConnected = false;
    return false;
  }
};

// API Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Health check endpoint with DB connection
app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  console.log("Health check called, attempting DB connection...");
  
  try {
    if (!isDbConnected) {
      const connected = await connectDB();
      if (!connected) {
        res.status(500).send('Database connection failed');
        return;
      }
    }
    res.send('API Working');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

// Export the app for Vercel
export default app;
