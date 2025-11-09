import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuizAnalytics.css";

export default function Analytics() {
  const [quizId, setQuizId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/submissions/analytics/${id}`);
      if (res.data.success && res.data.analytics) {
        setAnalytics(res.data.analytics);
      } else {
        setAnalytics(null);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) handleFetch(quizId);
  }, [quizId]);

  return (
    <div id="analytics-view" className="analytics-container">
      <div className="header">
        <h1 className="title">
          <i className="fas fa-tachometer-alt icon"></i> Performance Analytics
        </h1>

        <div className="quiz-selector">
          <label htmlFor="quiz-selector">Analyze Quiz:</label>
          <select
            id="quiz-selector"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
          >
            <option value="">Select a Quiz</option>
            <option value="67901a7c1234567890abcdef">Networking Basics</option>
            <option value="67a12b8f1234567890abcd99">React Hooks</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading analytics...</div>}

      {analytics && (
        <>
          <div className="kpi-cards">
            <div className="card">
              <p>Class Average Score</p>
              <p className="large-number">
                {analytics.avgScore}<span>%</span>
              </p>
              <p className="small-text">Target: 80%</p>
            </div>

            <div className="card">
              <p>Highest Score</p>
              <p className="large-number">{analytics.highestScore}<span>%</span></p>
              <p className="small-text">Top Performer: {analytics.topUser}</p>
            </div>

            <div className="card">
              <p>Pass Rate (≥ 70%)</p>
              <p className="large-number">{analytics.passRate}<span>%</span></p>
              <p className="small-text">Total Attempts: {analytics.totalAttempts}</p>
            </div>

            <div className="card">
              <p>Avg. Time Taken</p>
              <p className="large-number">
                {Math.floor(analytics.avgTime / 60)}<span>m {analytics.avgTime % 60}s</span>
              </p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h3>
              <i className="fas fa-users icon-small"></i> Student Performance Leaderboard
            </h3>
            <div className="table-wrapper">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name (User ID)</th>
                    <th>Final Score</th>
                    <th>Attempts</th>
                    <th>Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.leaderboard.map((s) => (
                    <tr key={s.rank}>
                      <td>{s.rank}</td>
                      <td>{s.name} ({s.userId})</td>
                      <td>{s.scorePercent}%</td>
                      <td>{s.attempts}</td>
                      <td>{s.timeTaken}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
