import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined");
    }
    
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("DB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
