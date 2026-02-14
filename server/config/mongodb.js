import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);
    console.log("MONGODB_URI value:", process.env.MONGODB_URI ? "set (length: " + process.env.MONGODB_URI.length + ")" : "not set");
    
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Don't exit process in serverless - just log the error
    }
};

export default connectDB;
