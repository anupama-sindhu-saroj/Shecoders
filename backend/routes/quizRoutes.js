import express from "express";
import Quiz from "../models/Quiz.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ Use single JWT middleware

const router = express.Router();

// 📝 Save Quiz (Draft or Publish)

  router.post("/", protect, async (req, res) => {
  try {
    const quizData = req.body;
    console.log("📩 Incoming quiz data:", quizData);

    // Validate required fields
    if (!quizData.title || !quizData.questions?.length) {
      return res.status(400).json({ success: false, error: "Title or questions missing" });
    }

    const quiz = new Quiz({
      ...quizData,
      createdBy: req.user?._id,
    });

    const saved = await quiz.save();

    const link = `${process.env.CLIENT_URL}/quiz/${saved._id}`;

    return res.status(201).json({
      success: true,
      quiz: saved,
      link,
      message:
        saved.status === "published"
          ? "✅ Quiz published successfully!"
          : "💾 Draft saved successfully!",
    });
  } catch (err) {
    console.error("❌ Error saving quiz:", err);
    return res.status(500).json({ success: false, error: err.message || "Server error" });
  }
});


// 📤 Fetch All Quizzes for Dashboard
router.get("/", protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, quizzes });
  } catch (err) {
    console.error("❌ Error fetching quizzes:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🔗 Get a public quiz by ID (for shared links)
router.get("/public/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // ✅ Check visibility
    if (quiz.status !== "published" || !quiz.public) {
      return res
        .status(403)
        .json({
          success: false,
          error: "This quiz is private or not published yet",
        });
    }

    res.json({ success: true, quiz });
  } catch (err) {
    console.error("❌ Error fetching public quiz:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 📄 Get a specific quiz for editing (creator only)
router.get("/:id", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, error: "Quiz not found or unauthorized" });
    }

    res.json({ success: true, quiz });
  } catch (err) {
    console.error("❌ Error fetching quiz:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });

    // If quiz is published or user is creator
    const token = req.headers.authorization?.split(" ")[1];
    let userId = null;
    if (token) {
      // Decode token (use your auth middleware or JWT decode)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    if (quiz.status !== "published" && quiz.createdBy.toString() !== userId) {
      return res.status(403).json({ success: false, error: "This quiz is private" });
    }

    res.json({ success: true, quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
export default router;
