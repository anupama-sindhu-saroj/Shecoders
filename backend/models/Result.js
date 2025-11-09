import express from "express";
import Submission from "../models/Submission.js";
import Quiz from "../models/Quiz.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/results
 * Fetch a submission by quizId and attemptId, along with the quiz data
 * Query params: quizId, attemptId
 */
router.get("/", authMiddleware, async (req, res) => {
  const { quizId, attemptId } = req.query;

  try {
    // Fetch the submission
    const submission = await Submission.findById(attemptId).lean();
    if (!submission)
      return res.status(404).json({ success: false, message: "Submission not found" });

    // Fetch the quiz
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz)
      return res.status(404).json({ success: false, message: "Quiz not found" });

    // Return both
    return res.json({ success: true, submission, quiz });
  } catch (err) {
    console.error("Error fetching result:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
