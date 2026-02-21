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

// Lazy MongoDB connection - module level variable
let isDbConnected = false;

const connectDB = async () => {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return { success: true, message: 'Already connected' };
  }
  
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    return { success: false, message: 'MONGODB_URI not set in environment variables' };
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isDbConnected = true;
    return { success: true, message: 'Connected successfully' };
  } catch (error) {
    isDbConnected = false;
    return { success: false, message: error.message };
  }
};

// API Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Debug endpoint to check environment
app.get('/debug', (req, res) => {
  res.json({
    mongoUriExists: !!process.env.MONGODB_URI,
    jwtSecretExists: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
});

// Health check endpoint with DB connection
app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  console.log("Health check called, attempting DB connection...");
  
  if (!isDbConnected) {
    const result = await connectDB();
    if (!result.success) {
      console.error("DB Connection failed:", result.message);
      res.status(500).json({ 
        error: 'Database connection failed', 
        details: result.message,
        mongoUriExists: !!process.env.MONGODB_URI 
      });
      return;
    }
  }
  
  res.json({ message: 'API Working', database: 'Connected' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Export the app for Vercel
export default app;
