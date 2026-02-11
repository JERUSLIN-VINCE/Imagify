import express from "express";
import {registerUser, loginUser,userCredits} from "../controllers/userController.js";
import  userAuth  from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/register", (req, res) => {
    res.send("Use POST method for registration");
});
userRouter.post("/login", loginUser);
userRouter.get("/login", (req, res) => {
    res.send("Use POST method for login");
});
userRouter.get("/credits",userAuth,userCredits);

export default userRouter;

