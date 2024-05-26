import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
// import googleStrategy from "./auth/google-auth.js";
import "./strategies/local-strategy.js";
const app = express();

import morgan from "morgan";
import jobRouter from "./router/jobRouter.js";
import userRouter from "./router/userRouter.js";
import contactRouter from "./router/contactRouter.js";
import employeeRouter from "./router/employerRouter.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { body } from "express-validator";
import bodyParser from "body-parser";

const MONGODBURL = process.env.MONGODB_URL;
if (process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// app.post("/", (req, res) => {
//   console.log(req.body);
//   res.status({ message: "Received!", data: req.body });
// });

app.use(
  session({
    secret: "amrit coder",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000*60},
    store: MongoStore.create({ mongoUrl: MONGODBURL }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v2/employees", employeeRouter);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
  req.session.visited=true;
  res.send("Hello World!");
});

app.get("/api/v1/status", (req, res) => {
  console.log(req.user);
  if(req.user){
    res.json({ status: "authenticated" });
  }
  else{
    res.json({ status: "not authenticated" });
  }
})


app.use('*',(req,res)=>{
  res.status(404).json({message:"Route not found"})
})

app.use((err,req,res,next)=>{
  console.error(err);
  res.status(500).json({message:"Something went wrong"})
})

const PORT = process.env.PORT || 8050;
console.log(process.env.PORT)
console.log(process.env.MONGO_URI)
try{
  mongoose.connect(
    MONGODBURL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Connection failed", err);
  });}
  catch(err){
    console.log(err)
  }
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
