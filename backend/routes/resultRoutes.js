import express from "express";
import Submission from "../models/Submission.js"; // Make sure this model matches your collection
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/results?quizId=...&attemptId=...
router.get("/",  async (req, res) => {
  try {
    const { quizId, attemptId } = req.query;

    if (!quizId || !attemptId) {
      return res.status(400).json({ success: false, error: "quizId and attemptId are required" });
    }

    // Find submission by quizId and _id (attemptId)
    const submission = await Submission.findOne({ 
      quizId: quizId, 
      _id: attemptId 
    }).populate("quizId").populate("userId", "name email"); // optional population if needed

    if (!submission) {
      return res.status(404).json({ success: false, error: "Result not found" });
    }

    res.json({ success: true, submission });
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
