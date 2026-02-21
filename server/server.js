import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();

// Middleware - order matters!
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle preflight
app.options('*', cors());

// MongoDB connection - lazy initialization
let isDbConnected = false;

const connectDB = async () => {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI not found in environment");
    return;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isDbConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    isDbConnected = false;
  }
};

// Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Root endpoint
app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  
  try {
    // Try to connect if not connected
    if (!isDbConnected) {
      await connectDB();
    }
    res.send('API Working');
  } catch (error) {
    console.error('Root endpoint error:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

// Export for Vercel
export default app;
