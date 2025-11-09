import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Submission from "../models/Submission.js";

const router = express.Router();

/**
 * ✅ POST /api/submissions
 * Save and auto-evaluate quiz submission
 */

  router.post("/", async (req, res) => {
  try {
    const { quizId, userId, userName, answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let totalScore = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    const evaluatedAnswers = answers.map((ans) => {
      const question = quiz.questions.id(ans.questionId);
      if (!question) {
        return { ...ans, isCorrect: false, pointsAwarded: 0 }; // ✅ ensure defined
      }

      let isCorrect = false;

      const toOptionText = (entry) => {
        const n = Number(entry);
        if (!Number.isNaN(n) && question.options && question.options[n] !== undefined) {
          return String(question.options[n]);
        }
        return String(entry);
      };

      if (["single", "multiple"].includes(question.type)) {
        const correctTexts = (question.correct || []).map((c) =>
          toOptionText(c).trim().toLowerCase()
        );
        const selectedTexts = (ans.selectedOptions || []).map((s) =>
          toOptionText(s).trim().toLowerCase()
        );
        const correctSet = new Set(correctTexts);
        const selectedSet = new Set(selectedTexts);
        isCorrect =
          correctSet.size === selectedSet.size &&
          [...correctSet].every((t) => selectedSet.has(t));
      } else if (question.type === "truefalse") {
        isCorrect = ans.trueFalseValue === question.trueFalseValue;
      } else if (question.type === "short") {
        isCorrect =
          (question.expectedAnswer || "").trim().toLowerCase() ===
          (ans.shortAnswer || "").trim().toLowerCase();
      }

      const pointsAwarded = isCorrect ? question.points : 0;
      totalScore += pointsAwarded;

      return {
        questionId: question._id,
        selectedOptions: ans.selectedOptions || [],
        shortAnswer: ans.shortAnswer || "",
        trueFalseValue: ans.trueFalseValue ?? null,
        isCorrect, // ✅ ensure explicit true/false
        pointsAwarded,
      };
    });

    const submission = new Submission({
      quizId,
      userId,
      userName,
      answers: evaluatedAnswers,
      totalScore,
      maxScore,
      timeTaken,
    });

    await submission.save();

    res.status(201).json({
      message: "Submission saved successfully ✅",
      submission,
    });
  } catch (error) {
    console.error("❌ Error saving submission:", error);
    res.status(500).json({ message: "Error saving submission", error: error.message });
  }
});


/**
 * ✅ GET /api/submissions/user/:userId
 * Fetch all submissions for a given user
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const submissions = await Submission.find({ userId })
      .populate("quizId", "title duration category status")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("❌ Error fetching user submissions:", error);
    res.status(500).json({ message: "Error fetching submissions", error: error.message });
  }
});

/**
 * ✅ GET /api/results?quizId=...&attemptId=...
 * This endpoint is what ResultPage expects
 */
router.get("/results", async (req, res) => {
  try {
    const { quizId, attemptId } = req.query;

    const submission = await Submission.findById(attemptId);
    if (!submission)
      return res.status(404).json({ success: false, message: "Submission not found" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz)
      return res.status(404).json({ success: false, message: "Quiz not found" });

    res.json({ success: true, submission, quiz });
  } catch (err) {
    console.error("❌ Error fetching result:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
} );
/**
 * ✅ GET /api/analytics/:quizId
 * For quiz creators — fetch all submissions and compute analytics
 */
router.get("/analytics/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;

    const submissions = await Submission.find({ quizId }).sort({ totalScore: -1 });

    if (!submissions.length)
      return res.json({ success: true, message: "No submissions yet", analytics: null });

    const totalAttempts = submissions.length;
    const totalScoreSum = submissions.reduce((sum, s) => sum + s.totalScore, 0);
    const maxScore = submissions[0].maxScore || 1;
    const avgScore = (totalScoreSum / (totalAttempts * maxScore)) * 100;

    const passRate =
      (submissions.filter((s) => s.totalScore / s.maxScore >= 0.7).length /
        totalAttempts) *
      100;

    const highest = submissions[0];
    const topUser = highest.userName || "Unknown";

    const avgTime =
      submissions.reduce((sum, s) => sum + (s.timeTaken || 0), 0) / totalAttempts;

    const leaderboard = submissions.slice(0, 10).map((s, i) => ({
      rank: i + 1,
      name: s.userName,
      userId: s.userId,
      scorePercent: ((s.totalScore / s.maxScore) * 100).toFixed(1),
      attempts: 1,
      timeTaken: `${Math.floor(s.timeTaken / 60)}m ${s.timeTaken % 60}s`,
    }));

    res.json({
      success: true,
      analytics: {
        totalAttempts,
        avgScore: avgScore.toFixed(1),
        passRate: passRate.toFixed(1),
        highestScore: ((highest.totalScore / highest.maxScore) * 100).toFixed(1),
        topUser,
        avgTime: Math.round(avgTime),
        leaderboard,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching quiz analytics:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
