import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Debug endpoint to check environment
app.get('/debug', (req, res) => {
  res.json({
    mongoUriExists: !!process.env.MONGODB_URI,
    jwtSecretExists: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
});

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'API Working', status: 'ok' });
});

export default app;
