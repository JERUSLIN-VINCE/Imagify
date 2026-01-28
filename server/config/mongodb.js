import mongoose from "mongoose";
import dotenv from "dotenv";
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("DB connection failed", error);
    }
}
export default connectDB;
