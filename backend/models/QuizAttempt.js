import mongoose from "mongoose";

const UserAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions" },
  selectedOptions: [Number], // indexes of selected options
  shortAnswer: String,
  trueFalseAnswer: Boolean,
  isCorrect: Boolean, // computed during submission
  pointsEarned: { type: Number, default: 0 },
});

const QuizAttemptSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    answers: [UserAnswerSchema],
    score: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    finishedAt: Date,
    durationTaken: Number, // seconds/minutes user took
    status: {
      type: String,
      enum: ["in-progress", "completed", "timeout"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model("QuizAttempt", QuizAttemptSchema);
