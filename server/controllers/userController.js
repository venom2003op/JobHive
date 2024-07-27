import {check, validationResult} from "express-validator"
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
const jwtSecret = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mailSender from "../config/mailSender.js";
import userModel from "../model/userModel.js";
import RegistrationMailOfuser from "../config/registrationmailofUser.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
export const createUser = catchAsyncError(async (req, res,next) => {
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      return next(new ErrorHandler(422,errors.array()))
  }
  //check for admin
  const count=await userModel.find();
  
  const {email, name , phone,password ,role,confirmPassword} = req.body;
  
  if(role==="admin" && count.length>0){
      return next(new ErrorHandler(422,"Only one admin is allowed!"))
  }

  if(password!==confirmPassword){
      return next(new ErrorHandler(422,"Passwords do not match!"))
  }
  const isEmail=await userModel.findOne({email:email});
  let existingUser;
  try{
      existingUser=await userModel.findOne({email:email });
  }catch(err){
      return next(new ErrorHandler(500,"Something went wrong!"))
  }
  if(existingUser){
      return next(new ErrorHandler(422,"User already exists!"))
  }
  
  const user = new userModel({
    email,
    name,
    phone,
    password,
    role,
  });
  try{
      await user.save();
      RegistrationMailOfuser(email);
      return res.status(200).json({message:"User registered successfully!"})
  }catch(err){
      return next(new ErrorHandler(500, "Something went wrong!"));
  }
  
})

export const loginUser = async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()})
    }
   
    return res.status(200).json({message:"Login successful"})
}

export const forgetPassword = async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()})
    }
    const {email}=req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        return res.status(500).json({message:"Something went wrong",error:err.message})
    }
    if(!existingUser){
        return res.status(422).json({message:"User does not exist"})
    }
    const secret = jwtSecret + existingUser.password;
    const token=jwt.sign({email:existingUser.email,id:existingUser._id},secret,{expiresIn:'5m'});   
    const link = `http://localhost:8050/api/v1/users/passwordreset/${existingUser._id}/${token}`;
    const reso=mailSender(existingUser.email,link)
    
    console.log(link);
    return res.status(200).json({message:"Email sent successfully"})
}
export const passwordReset = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);

  const existingUser = await User.findById({ _id: id });
  if (!existingUser) {
    return res.status(422).json({ message: "User does not exist" });
  }
  const secret = jwtSecret + existingUser.password;
  try {
    const verify = jwt.verify(token, secret);
    // Render a template instead of sending JSON response
    return res.render("forget", { email: verify.email,status:"not verified"});
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};

export const passwordResetPost = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword)
  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(422).json({ message: "Confirm Passwords do not match" });
  }

  // Find the user by ID
  const existingUser = await User.findById({ _id: id });
  if (!existingUser) {
    return res.status(422).json({ message: "User does not exist" });
  }

  const secret = jwtSecret + existingUser.password;
  try {
    // Verify the token
    const verify = jwt.verify(token, secret);
    
    // Hash the new password
    
    const hashedPassword = await bcrypt.hash(password, 12);
    // Update user's password
    existingUser.password = hashedPassword;
    // Save the updated user
    await existingUser.save();
    // Render a template indicating password reset success
    return res.render("forget", { email: verify.email, status: "verified" });
  } catch (err) {
    // If token verification fails, return an error
    return res.status(401).json({ message: "Token verification failed" });
  }
};


export const logoutUser = (req, res) => {
  // Check if the user is authenticated
  if (req.user) {
    // Logout the user
    req.logout((err) => {
      if (err) {
        // Handle any error that occurs during logout
        return res
          .status(500)
          .json({ message: "Logout error", error: err.message });
      }
      // Respond with a success message after successful logout
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    // If user is not authenticated, respond with a 401 Unauthorized status
    return res.status(401).json({ message: "Not authenticated" });
  }
};
