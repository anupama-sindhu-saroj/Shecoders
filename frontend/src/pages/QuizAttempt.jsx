import React, { useState, useEffect } from "react";
import ProctorPanel from "../components/ProctorPanel";

const QuizAttempt = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [violationsEnded, setViolationsEnded] = useState(false);

  if (!quizStarted) return <ProctorPanel onStartTest={() => setQuizStarted(true)} onEndTest={() => setViolationsEnded(true)} />;
  if (violationsEnded) return <h2>Test Ended</h2>;

  return <QuizApp testStarted={quizStarted} />;
}
export default QuizAttempt;
