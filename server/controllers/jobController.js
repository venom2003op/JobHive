
import { validationResult } from "express-validator";
import Job from "../model/jobModel.js";

export const getAllJobs = async (req, res) => {

   let jobs;
   try{
    jobs=await Job.find({});
   }catch(err){
    return res.status(500).json({message:"Something went wrong",error:err.message});
   }
   res.json({jobs:jobs.map(job=>job.toObject({getters:true}))});
};

export const getAllJobsByUser = async (req, res) => {
  const { id } = req.params;
  let jobs;
  try{
    jobs=await Job.find({user:id});
  }catch(err){
    return res.status(500).json({message:"Something went wrong",error:err.message});
  }
  res.json({jobs:jobs.map(job=>job.toObject({getters:true}))});
};

export const createJob = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors);
    return res.status(422).json({errors:errors.array()});
  }
  const { title, description, location, salary, company, jobStatus, jobType } =
    req.body;
  const job = new Job({
    title,
    description,
    location,
    salary,
    company,
    jobStatus,
    jobType,
  });
  console.log(job)
  try{
    await job.save();
    return res.status(201).json({ message: "Job created successfully", data: job });
  }
  catch(err){
    return res.status(500).json({message:"Something went wrong",error:err.message})
  }
  
};

export const getJob = async (req, res) => {
  const { id } = req.params;
  let job;
  try{
    job=await Job.findById(id);
    if(!job){
      return res.status(404).json({message:"Job not found"});
    }
    return res.status(200).json({data:job});
  }
  catch(err){
    return res.status(500).json({message:"Something went wrong",error:err.message})
  }
};

export const updateJob =async (req, res) => {
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json({errors:errors.array()});
  }
  const {id}=req.params;
  
  const updatedJob=await Job.findByIdAndUpdate(id,req.body,{new:true});
  if(!updatedJob){
    return res.status(404).json({message:"Job not found"});
  }
  return res.status(200).json({message:"Job updated successfully",data:updatedJob});
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  let job;
  try{
    job=await Job.findByIdAndDelete(id);
    if(!job){
      return res.status(404).json({message:"Job not found"});
    }
    return res.status(200).json({message:"Job deleted successfully",job:job});
  }catch(err){
    return res.status(500).json({message:"Something went wrong",error:err.message})
  }
};
