import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  sendOtp,
  verifyOtp,
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import "../config/passport.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Google Sign-In
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  }
);

export default router;
