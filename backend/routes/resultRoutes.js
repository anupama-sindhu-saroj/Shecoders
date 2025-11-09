import express from "express";
import Submission from "../models/Submission.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();


router.get("/", async (req, res) => {
  const { quizId, attemptId } = req.query;

  try {
   
    if (!quizId || !attemptId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing quizId or attemptId" });
    }

   
    const submission = await Submission.findById(attemptId).lean();
    if (!submission)
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });

   
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });

   
    return res.json({
      success: true,
      message: "Result fetched successfully",
      submission,
      quiz,
    });
  } catch (err) {
    console.error("❌ Error fetching result:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

export default router;
