import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from '../routes/userRouter.js';
import imageRouter from '../routes/imageRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Debug endpoint to check environment
app.get('/debug', (req, res) => {
  res.json({
    mongoUriExists: !!process.env.MONGODB_URI,
    jwtSecretExists: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    mongooseReadyState: mongoose.connection.readyState,
  });
});

// Health check without DB
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB lazily
let isDbConnected = false;

const connectDB = async () => {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    return true;
  }
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set');
    return false;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isDbConnected = true;
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.error('MongoDB error:', error.message);
    return false;
  }
};

// API Routes - with lazy DB connection
app.use('/api/users', async (req, res, next) => {
  if (!isDbConnected) {
    await connectDB();
  }
  next();
}, userRouter);

app.use('/api/image', async (req, res, next) => {
  if (!isDbConnected) {
    await connectDB();
  }
  next();
}, imageRouter);

// Root endpoint with DB connection
app.get('/', async (req, res) => {
  if (!isDbConnected) {
    const connected = await connectDB();
    if (!connected) {
      res.status(500).json({ error: 'Database connection failed' });
      return;
    }
  }
  res.json({ message: 'API Working', database: 'Connected' });
});

export default app;
