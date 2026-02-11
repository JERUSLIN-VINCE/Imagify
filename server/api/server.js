import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRouter.js';
import imageRouter from './routes/imageRoutes.js';

let app;

const initializeApp = async () => {
  if (!app) {
    app = express();
    app.use(express.json());
    const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173', 'http://localhost:3000', 'https://imagify-nine-gules.vercel.app', 'https://imagify-h4m4zydd0-jeruslin-vinces-projects.vercel.app'];
    app.use(cors({
      origin: allowedOrigins,
      credentials: true
    }));
    await connectDB();
    app.use('/api/users', userRouter);
    app.use('/api/image', imageRouter);
    app.get('/', (req, res) => {
        res.send("API Working fine")
    });
  }
  return app;
};

export default async (req, res) => {
  const app = await initializeApp();
  const handler = serverless(app);
  return handler(req, res);
};
