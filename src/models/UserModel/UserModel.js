import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    countryCode: {
      type: String,
      required: true,
      trim: true,
      match: /^\+\d{1,4}$/, // e.g. +91, +1, +44
    },
    userPhoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{7,15}$/, // allows 7–15 digits (international range)
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    accessPermissionPages: {
      type: [String], // e.g. ["overview", "companies"]
      default: [],
    },
    otp: String,             // For OTP-based forgot password
    otpExpire: Date,  
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("userPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
  next();
});

// 🔑 Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
