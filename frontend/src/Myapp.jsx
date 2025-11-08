// src/App.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProctorPanel from "./components/ProctorPanel";
import QuizApp from "./components/QuizApp";
import "./Myapp.css";
export default function Myapp() {
  const [testStarted, setTestStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const { quizId } = useParams();
  const navigate = useNavigate();
  const handleStartTest = () => {
    setTestStarted(true);
    // ✅ After smile detection, navigate to actual quiz attempt page
    navigate(`/quiz/${quizId}/attempt`);
  };
  const handleEndTest = () => {
    alert("Test ended due to too many violations!");
    setQuizEnded(true);
  };

  return (
    <div className="min-h-screen w-fullbg-[#0a0f1e] text-[#d3d7de] flex flex-col">
      {!testStarted && !quizEnded ? (
        // Show proctor panel before test starts
        <div className="flex flex-col items-center justify-center h-screen">
          <ProctorPanel onStartTest={handleStartTest} onEndTest={handleEndTest} />
        </div>
      ) : quizEnded ? (
        <div className="flex items-center justify-center h-screen text-red-400 text-lg">
          Quiz ended due to violations.
        </div>
      ) : (
        // After smiling, show the main quiz UI (your original QuizVault frontend)
        <QuizApp testStarted={testStarted}/>
      )}
    </div>
  );
}
