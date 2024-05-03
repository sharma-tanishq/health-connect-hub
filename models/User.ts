import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    userId: { type: String, required: true },
    prescription: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User",userSchema );