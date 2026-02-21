import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRouter.js';
import imageRouter from './routes/imageRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// CORS - Allow all origins for production
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));

// Handle preflight
app.options('*', cors());

// DB connection flag
let isDbConnected = false;

// Connect to MongoDB
const initDB = async () => {
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
      console.log('DB connected');
    } catch (error) {
      console.error('DB connection error:', error);
    }
  }
};

// Routes
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

// Health check
app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    if (!isDbConnected) {
      await initDB();
    }
    res.send('API Working fine');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

// Export for Vercel
export default app;
