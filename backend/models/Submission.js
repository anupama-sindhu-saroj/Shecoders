import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedOptions: [String], 
  trueFalseValue: { type: Boolean, default: null }, 
  shortAnswer: { type: String, default: "" }, 
  isCorrect: { type: Boolean, default: false },
  pointsAwarded: { type: Number, default: 0 },
});

const submissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  userName: { type: String, required: true },
  answers: [answerSchema],
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  timeTaken: { type: Number, default: 0 },
});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
