import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

 const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;
        
        // Basic Input validation
        if(!name || !email || !password){
            return res.status(400).json({success:false, message:"Please fill all the fields"});
        }
        
        // Simple email normalization
        const normalizedEmail = email.toLowerCase().trim();
        
        // Check if user already exists
        const existingUser = await userModel.findOne({email: normalizedEmail});
        if(existingUser){
            return res.status(409).json({success:false, message:"User already exists"});
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userData={
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        }
        
        const newUser = new userModel(userData);
        const user = await newUser.save();
        
        // Generate token
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: '7d' });
        
        res.status(201).json({
            success:true, 
            token, 
            user:{
                name:user.name, 
                creditBalance:user.creditBalance
            }
        });
    }
    catch(error){
        console.log("Error in registering user:", error);
        res.status(500).json({success:false, message:"Failed to create account. Please try again."});
    }
}

  const loginUser = async (req, res) => {
        try{
            const {email, password} = req.body;
            
            // Input validation
            if (!email || !password) {
                return res.status(400).json({success:false, message:"Please provide email and password"});
            }
            
            // Normalize email
            const normalizedEmail = email.toLowerCase().trim();
            const user = await userModel.findOne({email: normalizedEmail});
            
            // Generic error message - don't reveal if user exists
            if(!user){
                return res.status(401).json({success:false, message:"Invalid email or password"});
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            
            if(isMatch){
                // Generate token with expiration
                const token=jwt.sign({id:user._id}, process.env.JWT_SECRET || 'default-secret-key', { expiresIn: '7d' });
                
                // Return minimal user data - don't expose email if not necessary
                res.json({
                    success:true, 
                    token,
                    user:{
                        name:user.name, 
                        creditBalance:user.creditBalance
                    }
                });
            }
            else{
                // Generic error message - don't reveal which field is wrong
                return res.status(401).json({success:false, message:"Invalid email or password"});
            }
        }
        catch(error){
            console.log("Error in logging in user:", error);
            // Generic error message - don't expose internal details
            res.status(500).json({success:false, message:"Login failed. Please try again."});
        }
    }
    
const userCredits = async (req, res) => {
   try{
       const userId = req.userId;

       const user = await userModel.findById(userId);
       
       if(!user){
           return res.status(404).json({success:false, message:"User not found"});
       }
       
       res.json({
           success:true, 
           credits:user.creditBalance,
           user:{name:user.name}
       });
   }
   catch(error){
        console.log("Error fetching user credits:", error);
        res.status(500).json({success:false, message:"Failed to fetch credits"});
   }
}

export {registerUser, loginUser,userCredits};
