import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    specialization: { type: String, required: true },
    hospital: { type: String, required: true },
    docId: { type: String, required: true },
    photo: { type: String, required: false },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model("Doctor",doctorSchema );