import express from 'express';
import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import userRouter from '../routes/userRouter.js';
import imageRouter from '../routes/imageRoutes.js';

const app = express();

// Allowed origins - hardcoded for reliability
const allowedOrigins = [
  'https://imagify-nine-gules.vercel.app',
  'https://server-ashen-rho.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, token');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Root route
app.get('/', (req, res) => {
  res.send("API Working fine")
});

// Health check route to verify database connection
app.get('/api/health', async (req, res) => {
  try {
    const mongoose = await import('mongoose');
    const state = mongoose.default.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    res.json({
      success: true,
      database: {
        status: states[state] || 'unknown',
        readyState: state
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking database connection',
      error: error.message
    });
  }
});

export default app;
