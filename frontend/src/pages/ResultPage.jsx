import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResultPage.css"; // ✅ new CSS file

const ResultPage = () => {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/results?quizId=${quizId}&attemptId=${attemptId}`,
          { withCredentials: true }
        );
        if (res.data.success) setData(res.data);
        else console.error("No data returned from backend");
      } catch (err) {
        console.error("❌ Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizId, attemptId]);

  if (loading)
    return (
      <div className="result-loading">
        <div>Loading your result...</div>
      </div>
    );

  if (!data)
    return (
      <div className="result-notfound">
        No result found.
      </div>
    );

  const { quiz, submission } = data;

  const toOptionTextFromValue = (val, q) => {
    if (val === null || val === undefined) return "N/A";
    const n = Number(val);
    if (!Number.isNaN(n) && Array.isArray(q.options) && q.options[n] !== undefined) {
      return q.options[n];
    }
    return val;
  };

  const correctCount = submission.answers.filter((a) => a.isCorrect).length;
  const wrongCount = submission.answers.filter((a) => !a.isCorrect).length;
  const unansweredCount = quiz.questions.length - submission.answers.length;

  return (
    <div className="result-container">
      <div className="result-card">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <h1 className="result-title">
          Quiz Result: <span>{quiz.title || "Untitled Quiz"}</span>
        </h1>

        <div className="score-summary">
          <p className="attempt-id">Attempt ID: {submission._id}</p>
          <p className="total-score">
            Total Score: <span>{submission.totalScore}/{submission.maxScore}</span>
          </p>

          <div className="stats-container">
            <span className="stat correct">✅ Correct: {correctCount}</span>
            <span className="stat wrong">❌ Wrong: {wrongCount}</span>
            <span className="stat unanswered">⚪ Unanswered: {unansweredCount}</span>
          </div>
        </div>

        <h2 className="review-heading">Question Review</h2>

        {quiz.questions.map((q, index) => {
          const ans = submission.answers.find(
            (a) => a.questionId.toString() === q._id.toString()
          );
          const toOption = (v) => toOptionTextFromValue(v, q);

          let userAnswer = "Unanswered";
          if (ans) {
            if (q.type === "short") userAnswer = ans.shortAnswer || "N/A";
            else if (q.type === "truefalse") userAnswer = String(ans.trueFalseValue);
            else userAnswer = (ans.selectedOptions || []).map(toOption).join(", ");
          }

          let correctAnswer = "N/A";
          if (q.type === "short") correctAnswer = q.expectedAnswer || "N/A";
          else if (q.type === "truefalse") correctAnswer = String(q.trueFalseValue);
          else correctAnswer = (q.correct || []).map(toOption).join(", ");

          return (
            <div
              key={q._id}
              className={`question-card ${ans ? (ans.isCorrect ? "correct-ans" : "wrong-ans") : "unanswered"}`}
            >
              <h3>Q{index + 1}: {q.text}</h3>
              <p><strong>Your Answer:</strong> {userAnswer}</p>
              {!ans?.isCorrect && (
                <p className="correct-answer"><strong>Correct Answer:</strong> {correctAnswer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPage;
