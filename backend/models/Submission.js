import mongoose from "mongoose";

const submissionSchema = mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      selectedOptions: [String],
      trueFalseValue: Boolean,
      shortAnswer: String,
      isCorrect: Boolean,
      pointsAwarded: Number
    }
  ],
  totalScore: Number,
  maxScore: Number,
  timeTaken: Number,
  submittedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
