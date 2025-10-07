import Admin from "../../models/AdminModel/AdminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Generate JWT token
const generateToken = (id) => jwt.sign({ id, role: "admin" }, "Raghu", { expiresIn: "30d" });
console.log("JWT Secret:", process.env.JWT_SECRET);
// 🧾 Register Admin
export const registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const admin = await Admin.create({ email, password });
  res.status(201).json({ _id: admin._id, email: admin.email, token: generateToken(admin._id) });
};

// 🔐 Login Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    res.json({ _id: admin._id, email: admin.email, token: generateToken(admin._id) });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Step 1: Send OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  admin.otp = otp;
  admin.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await admin.save({ validateBeforeSave: false });

  // Send OTP by email (using nodemailer)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "raghvendra.levontechno@gmail.com", pass: "cfcw hszk avlz dqpr" },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: admin.email,
    subject: "Your OTP for Admin Password Reset",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  });

  res.json({ message: "OTP sent to email" });
};

// Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const admin = await Admin.findOne({ email, otp, otpExpire: { $gt: Date.now() } });
  if (!admin) return res.status(400).json({ message: "Invalid or expired OTP" });

  res.json({ message: "OTP verified, proceed to change password" });
};

// Step 3: Change Password
export const changePassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  admin.password = password; // pre-save hook will hash automatically
  admin.otp = undefined;
  admin.otpExpire = undefined;

  await admin.save();
  res.json({ message: "Password changed successfully" });
};

