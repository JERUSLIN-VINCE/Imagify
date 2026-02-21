import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from '../config/mongodb.js';
import userRouter from '../routes/userRouter.js';
import imageRouter from '../routes/imageRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - Dynamic for production and development
const allowedOrigins = [
  process.env.FRONTEND_URL,  // Production frontend URL
  'http://localhost:5173',    // Vite dev server
  'http://localhost:3000'   // Alternative dev server
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
