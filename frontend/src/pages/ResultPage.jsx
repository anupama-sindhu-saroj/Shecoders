import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-purple-900 to-black text-purple-200">
        <div className="animate-pulse text-xl">Loading your result...</div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-purple-900 to-black text-purple-300 text-xl">
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
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-purple-100 p-6">
      <div className="max-w-3xl mx-auto bg-purple-950/30 backdrop-blur-lg border border-purple-700/40 rounded-2xl p-8 shadow-2xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-purple-400 hover:text-purple-300 transition mb-6"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-purple-300 mb-4">
          Quiz Result:{" "}
          <span className="text-white">{quiz.title || "Untitled Quiz"}</span>
        </h1>

        <div className="text-lg mb-4">
          <p className="text-gray-300 mb-1">Attempt ID: {submission._id}</p>
          <p className="font-semibold text-purple-200 mb-2">
            Total Score:{" "}
            <span className="text-purple-400">
              {submission.totalScore}/{submission.maxScore}
            </span>
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <span className="bg-green-700/40 text-green-300 px-3 py-1 rounded-full">
              ✅ Correct: {correctCount}
            </span>
            <span className="bg-red-700/40 text-red-300 px-3 py-1 rounded-full">
              ❌ Wrong: {wrongCount}
            </span>
            <span className="bg-gray-700/40 text-gray-300 px-3 py-1 rounded-full">
              ⚪ Unanswered: {unansweredCount}
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-purple-200 border-b border-purple-800 pb-2">
          Question Review
        </h2>

        {quiz.questions.map((q, index) => {
          const ans = submission.answers.find(
            (a) => a.questionId.toString() === q._id.toString()
          );
          const toOption = (v) => toOptionTextFromValue(v, q);

          let userAnswer = "N/A";
          if (!ans) {
            userAnswer = "Unanswered";
          } else if (q.type === "short") {
            userAnswer = ans.shortAnswer || "N/A";
          } else if (q.type === "truefalse") {
            userAnswer =
              ans.trueFalseValue !== null && ans.trueFalseValue !== undefined
                ? String(ans.trueFalseValue)
                : "N/A";
          } else {
            userAnswer =
              (ans.selectedOptions || []).map(toOption).join(", ") || "N/A";
          }

          let correctAnswer = "N/A";
          if (q.type === "short") {
            correctAnswer = q.expectedAnswer || "N/A";
          } else if (q.type === "truefalse") {
            correctAnswer =
              q.trueFalseValue !== null && q.trueFalseValue !== undefined
                ? String(q.trueFalseValue)
                : "N/A";
          } else {
            correctAnswer =
              (q.correct || []).map(toOption).join(", ") || "N/A";
          }

          const statusColor = ans
            ? ans.isCorrect
              ? "text-green-400"
              : "text-red-400"
            : "text-gray-400";

          return (
            <div
              key={q._id}
              className="bg-black/40 border border-purple-800 rounded-xl p-5 mb-4 hover:shadow-purple-700/40 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg text-white mb-2">
                Q{index + 1}: {q.text}
              </h3>
              <p className="text-gray-300">
                Your Answer: <span className={statusColor}>{userAnswer}</span>
              </p>
              {!ans?.isCorrect && (
                <p className="text-gray-400 mt-1">
                  Correct Answer:{" "}
                  <span className="text-purple-300">{correctAnswer}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPage;
