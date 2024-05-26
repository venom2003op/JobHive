import express from "express";
import {check} from "express-validator"
const jobRouter = express.Router();
import {
  createJob,
  getAllJobs,
  getAllJobsByUser,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

jobRouter.get("/", getAllJobs);

jobRouter.get("/user/:id", getAllJobsByUser);

jobRouter.post("/",[check('title').not().isEmpty().withMessage('Title is required'),
    check('description').isLength({min:20}).withMessage('Description should be atleast 20 characters'),
    check('location').not().isEmpty().withMessage('Location is required'),
    check('salary').not().isEmpty().isLength({min:4}).withMessage('Salary should be atleast 4 characters'),
    check('company').not().isEmpty().withMessage('Company is required'),
    check('jobStatus').isIn(['interview','declined','pending']).withMessage('Job status should be interview, declined or pending') ,
    check('jobType').isIn(['full-time','part-time','internship']).withMessage('Job type should be full-time part-time or internship ')
] ,createJob);
jobRouter.get("/:id", getJob);
jobRouter.patch("/:id",[
  check('title').not().isEmpty().withMessage('Title is required') ,
  check('description').isLength({min:20}).withMessage('Description should be atleast 20 characters'),
  check('location').not().isEmpty().withMessage('Location is required'),
  check('salary').not().isEmpty().isLength({min:4}).withMessage('Salary should be atleast 4 characters'),
  check('company').not().isEmpty().withMessage('Company is required') ,
  check('jobStatus').isIn(['interview','declined','pending']).withMessage('Job status should be interview, declined or pending'),
  check('jobType').isIn(['full-time','part-time','internship']).withMessage('Job type should be full-time part-time or internship ')
], updateJob);
jobRouter.delete("/:id", deleteJob);

export default jobRouter;
