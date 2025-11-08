import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Submission from "../models/Submission.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// POST /api/submissions
router.post("/", async (req, res) => {
  try {
    const { quizId, userId, userName, answers, totalScore, maxScore, timeTaken } = req.body;

    const submission = new Submission({
      quizId,
      userId,
      userName,
      answers,
      totalScore,
      maxScore,
      timeTaken,
    });

    await submission.save();

    res.status(201).json({ message: "Submission saved successfully", submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving submission", error: error.message });
  }
});

router.get("/quiz/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const submissions = await Submission.find({ userId: new mongoose.Types.ObjectId(userId) })
  .populate({ path: "quizId", select: "title duration category status" });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
});


// GET single submission by ID
router.get("/quiz/:quizId/user/:userId", async (req, res) => {
  
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("Fetching submissions for user:", userId);
    const submissions = await Submission.find({ userId }).populate("quizId");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submission", error: error.message });
  }
});
// ✅ Get all submissions by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Frontend sent userId:", userId);

    // Fetch submissions where userId matches string or ObjectId
    const submissions = await Submission.find({
      $or: [
        { userId }, // string
        { userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null }
      ]
    }).populate("quizId", "title duration category status");

    console.log("Submissions fetched from DB:", submissions);

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching user's submissions:", error);
    res.status(500).json({
      message: "Error fetching user's submissions",
      error: error.message,
      stack: error.stack,
    });
  }
});





router.get("/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate("userId", "name email");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json({ submission });
  } catch (err) {
    res.status(500).json({ message: "Error fetching submission", error: err.message });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body, // could contain answers, totalScore, isCorrect, etc.
      { new: true }
    );
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: "Error updating submission", error: error.message });
  }
});

export default router;