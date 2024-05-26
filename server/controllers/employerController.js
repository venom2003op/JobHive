import { validationResult } from "express-validator";
import employerModel from "../model/employerModel.js";
import RegistrationMailOfEmployer from "../config/registrationmailofemployer.js";
import bcrypt from "bcryptjs";
import passport from "passport";
export const signupEmployer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const isFirstAccount = await employerModel.countDocuments() === 0;
    const role = isFirstAccount ? "admin" : "employer";
    const { name, email, password, confirmPassword } = req.body;
    let existingEmployer;
    try {
        existingEmployer = await employerModel.findOne({ email: email });
    }catch(err){
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
    if (existingEmployer) {
        return res.status(422).json({ message: "Employer already exists" });
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ message: "Confirm Passwords do not match" });
    }
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    }catch(err){
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
    const employer = new employerModel({
        name,
        email,
        password: hashedPassword,
        role
    });
    try{
        await employer.save();
        RegistrationMailOfEmployer(email, name);
        res.status(201).json({ message: "Employer created successfully", data: employer });
    }catch(err){
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

// export const googleAuth20 = async (req, res) => {
//     passport.authenticate("google", { scope: ["profile", "email"] });    
// }

// export const loginFailed=async(req,res)=>{
//     res.status(401).json({message:"Login failed",error:"Invalid credentials"})
// }

// export const loginSuccess=async(req,res)=>{
//     if(req.user){
//         res.status(200).json({message:"Login success",data:req.user})   
//     }else{
//         res.status(403).json({message:"Not Authorized",error:true})
//     }
// }

// export const googleAuthCallback = async (req, res) => {
//     passport.authenticate("google", {
//         successRedirect: "/AddJob", 
//         failureRedirect: "/error" })
// }   

// export const logout=async(req,res)=>{
//     req.logout();
//     res.redirect("/")
// }