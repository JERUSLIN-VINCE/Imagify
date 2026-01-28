import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRouter.js';
import imageRouter from './routes/imageRoutes.js';
const PORT=process.env.PORT || 4000;
const app = express();
app.use(express.json());
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173', 'http://localhost:3000'];
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});