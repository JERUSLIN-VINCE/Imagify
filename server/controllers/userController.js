import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:"Please fill all the fields"});
        }
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({success:false, message:"Invalid email format"});
        }
        // Password validation
        if (password.length < 6) {
            return res.json({success:false, message:"Password must be at least 6 characters long"});
        }
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false, message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData={
            name,email,password:hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not configured");
        }
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET);
        res.send({success:true, token,user:{name:user.name, email:user.email, creditBalance:user.creditBalance}});
    }
    catch(error){
        console.log("Error in registering user:", error);
        res.json({success:false, message:"Internal server error"});
    }
}

  const loginUser = async (req, res) => {
        try{
            const {email, password} = req.body;
            if (!email || !password) {
                return res.json({success:false, message:"Please provide email and password"});
            }
            const user = await userModel.findOne({email});
            if(!user){
                return res.json({success:false, message:"User not found"});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                if (!process.env.JWT_SECRET) {
                    throw new Error("JWT_SECRET not configured");
                }
                const token=jwt.sign({id:user._id}, process.env.JWT_SECRET);
        res.send({success:true, token,user:{name:user.name, email:user.email,
             creditBalance:user.creditBalance}});
            }
            else{
                return res.json({success:false, message:"Invalid credentials"});
            }
        }
        catch(error){
            console.log("Error in logging in user:", error);
         res.json({success:false, message:"Internal server error"});
        }
    }
const userCredits = async (req, res) => {
   try{
       const userId = req.userId;

       const user = await userModel.findById(userId);
       res.json({success:true, credits:user.creditBalance,user:{name:user.name}});
   }
   catch(error){
            console.log("Error in logging in user:", error);
         res.json({success:false, message:error.message});
   }
}
export {registerUser, loginUser,userCredits};