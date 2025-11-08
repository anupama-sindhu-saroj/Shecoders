import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";

import quizRoutes from "./routes/quizRoutes.js";




dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


// Passport session setup
app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

app.use("/api/quizzes", quizRoutes);


console.log("✅ Quiz routes mounted at /api/quizzes");

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
