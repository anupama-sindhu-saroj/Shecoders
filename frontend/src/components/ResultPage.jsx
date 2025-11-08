import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  // Expecting submissionId to be passed via state
  const submissionId = location.state?.submissionId;

  useEffect(() => {
    if (!submissionId) return navigate("/"); // redirect if no submission

    const fetchSubmission = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(res.data.submission);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  if (!result) return <p>Loading results...</p>;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
      <p className="mb-2">Score: {result.totalScore} / {result.maxScore}</p>
      <p className="mb-4">Quiz Time: {result.timeTaken} seconds</p>

      <div className="space-y-3">
        {result.answers.map((ans, idx) => (
          <div key={idx} className="p-3 border rounded-md border-gray-700">
            <p className="font-semibold">{ans.questionId}</p>
            <p>Your answer: {ans.selectedOptions?.join(", ") || "No answer"}</p>
            <p>Points: {ans.pointsAwarded}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
