import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attemptId: {
      type: String,
      required: true,
      unique: true,
    },
    questions: [
      {
        id: Number,
        text: String,
        chosenAnswer: mongoose.Schema.Types.Mixed,
        correctAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        timeTaken: Number,
        marksEarned: Number,
        maxMarks: Number,
        explanation: String,
      },
    ],
    totalScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    wrongCount: { type: Number, required: true },
    unansweredCount: { type: Number, required: true },
    timeTakenSeconds: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String },
    isReviewAllowed: { type: Boolean, default: true },
    quizTitle: { type: String }, // optional: store title for easy access
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
