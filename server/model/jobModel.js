import mongoose from "mongoose";
const jobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true,
        default:'my city'
    },
    salary:{
        type:String,
        required:true,
        min:4
    },
    company:{
        type:String,
        required:true
    },
    jobStatus:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    jobType:{
        type:String,
        enum:['full-time','part-time','internship'],
        default:'full-time'
    }

},{timestamps:true})

export default mongoose.model('Job',jobSchema)