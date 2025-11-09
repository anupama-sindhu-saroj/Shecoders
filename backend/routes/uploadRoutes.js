import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or invalid file format",
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
      message: "✅ Image uploaded successfully",
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
});

export default router;
