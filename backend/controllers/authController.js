import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js"; // ✅ new model
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

// ✅ SEND OTP (no user creation)
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any old OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    await Otp.create({
      email,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Your OTP Code",
      `<h3>Your OTP Code: <b>${otp}</b></h3><p>Valid for 5 minutes.</p>`
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record || record.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ email });
    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("❌ Verify OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ REGISTER
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      email,
      "Password Reset Link",
      `<h3>Password Reset Request</h3>
       <p>Click below to reset your password:</p>
       <a href="${resetLink}" target="_blank">${resetLink}</a>
       <p>This link expires in 15 minutes.</p>`
    );

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
