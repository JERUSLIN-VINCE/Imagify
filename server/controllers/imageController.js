import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId;

    if (!userId || !prompt) {
      return res.status(400).json({ success: false, message: "Missing required details" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.creditBalance <= 0) {
      return res.status(400).json({ success: false, message: "Insufficient credits", creditBalance: 0 });
    }

    // Check if API key is configured
    if (!process.env.CLIPDROP_API) {
      return res.status(500).json({ success: false, message: "Image generation API key not configured. Please contact the administrator." });
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'x-api-key': process.env.CLIPDROP_API,
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64Image}`;

    const updatedUser = await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    }, { new: true });

    res.json({ 
      success: true, 
      message: "Image generated successfully", 
      creditBalance: updatedUser.creditBalance, 
      resultImage 
    });
  } catch (error) {
    console.log("Error generating image:", error.message);
    console.log("Error details:", error.response?.data || error);
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      return res.status(401).json({ success: false, message: "Invalid API key. Please contact the administrator." });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ success: false, message: "Rate limit exceeded. Please try again later." });
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ success: false, message: "Image generation service is unavailable." });
    }
    
    res.status(500).json({ success: false, message: "Failed to generate image. Please try again." });
  }
};
