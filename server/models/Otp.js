import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
},
  otp: {
    type: String,   // MUST be string
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

export default mongoose.model("Otp", otpSchema);
