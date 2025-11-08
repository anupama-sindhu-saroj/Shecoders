import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String, default: null },
  type: { type: String, enum: ["single", "multiple", "truefalse", "short"], default: "single" },
  options: [String], // ✅ matches your frontend (["5","2","3"])
  correct: [String], // ✅ array of correct answers
  points: { type: Number, default: 1 },
  negative: { type: Boolean, default: false },
  trueFalseValue: { type: Boolean, default: null },
  expectedAnswer: { type: String, default: "" },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,
  difficulty: String,
  category: String,
  startDate: String,
  endDate: String,
  attemptLimit: Number,
  public: { type: Boolean, default: true},
  randomizeQuestions: { type: Boolean, default: false },
  randomizeOptions: { type: Boolean, default: false },
  negativeMarking: Number,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
