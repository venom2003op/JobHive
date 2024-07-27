import {catchAsyncError} from './catchAsyncError.js'
import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js'
import bcrypt from 'bcrypt'

export const isAuthorized = catchAsyncError(async (req,res,next)=>{
  let {token} = req.cookies;
  if(!token){
    return res.status(401).json({message:"You are not authorized to access this route"})
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET);
  req.user = await userModel.findById(decoded.id);
  next();
})