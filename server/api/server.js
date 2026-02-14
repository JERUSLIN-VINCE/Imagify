import express from 'express';
import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import userRouter from '../routes/userRouter.js';
import imageRouter from '../routes/imageRoutes.js';

const app = express();

// Allowed origins
const allowedOrigins = [
  'https://imagify-nine-gules.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Custom CORS middleware that works with Vercel serverless
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, token');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Root route
app.get('/', (req, res) => {
  res.send("API Working fine")
});

export default app;
