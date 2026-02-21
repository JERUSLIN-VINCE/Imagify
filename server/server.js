import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRouter.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - Allow all for production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction ? true : [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle preflight requests
app.options('*', cors());

// Connect to MongoDB (only once)
let dbConnected = false;

const getDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("DB connection error:", error);
    }
  }
};

// API Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Health check endpoint
app.get('/', async (req, res) => {
  try {
    await getDB();
    res.send("API Working fine");
  } catch (error) {
    res.status(500).send("API Error: " + error.message);
  }
});

// For Vercel serverless - wrap everything in a handler
const moduleExports = app;
export default moduleExports;
