import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle preflight
app.options('*', cors());

// MongoDB connection - lazy initialization
let isDbConnected = false;

const connectDB = async () => {
  if (isDbConnected) return;
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI not found");
    return;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isDbConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB error:", error.message);
  }
};

// Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Root endpoint - minimal
app.get('/', async (req, res) => {
  try {
    if (!isDbConnected) {
      await connectDB();
    }
    res.send('API Working');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Export for Vercel
export default app;
