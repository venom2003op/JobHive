import express from "express";
import passport from "passport";
import "../strategies/local-strategy.js";
import {check} from "express-validator"
const userRouter = express.Router();
import {
  createUser,
  loginUser,
  forgetPassword,
  passwordReset,
  logoutUser,
  passwordResetPost,
} from "../controllers/userController.js";

userRouter.post("/signup",[check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().notEmpty().withMessage('Invalid email'),
    check('password').notEmpty().isLength({min:6}).withMessage('Password should be atleast 6 characters'),
   check('confirmPassword').notEmpty().isLength({min:6}).withMessage('Password should be atleast 6 characters')
],createUser);

userRouter.post(
  "/login",
  [
    check("email").not().isEmpty().withMessage("Email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password should be atleast 6 characters"),
  ],
  passport.authenticate("local"),
  loginUser
);

userRouter.post("/forgetpassword",[check('email').isEmail().withMessage('Invalid email')],forgetPassword);

userRouter.get("/passwordreset/:id/:token",passwordReset);

userRouter.post("/passwordreset/:id/:token", passwordResetPost);

userRouter.get("/logout",passport.authenticate("local"),logoutUser);

export default userRouter;