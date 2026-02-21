import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import userRouter from '../routes/userRouter.js';
import imageRouter from '../routes/imageRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - Allow all for production (Vercel)
const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction ? true : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle preflight requests
app.options('*', cors());

// Connect to MongoDB
await connectDB();

// API Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Health check endpoint
app.get('/', (req, res) => {
    res.send("API Working fine")
});

export default app;
