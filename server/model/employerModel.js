import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum:['employer','admin'],
        default:'employer'
    },
    },{
        timestamps: true,
    });
export default mongoose.model("Recruiter", employerSchema);
    