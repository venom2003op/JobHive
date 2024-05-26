import express from "express";
import {check} from "express-validator"
const employerRouter = express.Router();
import {signupEmployer} from "../controllers/employerController.js";
import {emailVerification,verifyOtp} from "../controllers/emailVerificationController.js";

employerRouter.post("/signup",[
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Invalid Email"),
    check("password").isLength({min:6}).withMessage("Password should be atleast 6 characters long"),
    check("confirmPassword").isLength({min:6}).withMessage("Password should be atleast 6 characters long"),
],signupEmployer);

employerRouter.post("/emailVerification",[
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Invalid Email")
],emailVerification);

employerRouter.post("/verifyOtp",[
    check("email").isEmail().withMessage("Invalid Email"),
    check("otp").isLength({min:6}).withMessage("Invalid OTP")
],verifyOtp);       

// employerRouter.get("/auth/google",googleAuth20);

// employerRouter.get("/auth/google/callback",googleAuthCallback);

// employerRouter.get("/loginFailed",loginFailed);

// employerRouter.get("/loginSuccess",loginSuccess);

// employerRouter.get("/logout",logout);


export default employerRouter;