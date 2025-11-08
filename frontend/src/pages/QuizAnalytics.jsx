import React from "react";
import "./QuizAnalytics.css"; // We'll create this for custom styles

export default function Analytics() {
  return (
    <div id="analytics-view" className="analytics-container">
      {/* Header */}
      <div className="header">
        <h1 className="title">
          <i className="fas fa-tachometer-alt icon"></i> Performance Analytics
        </h1>

        {/* Quiz Selector */}
        <div className="quiz-selector">
          <label htmlFor="quiz-selector">Analyze Quiz:</label>
          <select id="quiz-selector">
            <option>Basics of Networking (Quiz ID: XYZ-101)</option>
            <option>Advanced React Hooks (Quiz ID: ABC-203)</option>
            <option>Introduction to Python (Quiz ID: DEF-005)</option>
            <option>Mathematics - Derivatives (Quiz ID: GHI-410)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-cards">
        <div className="card">
          <p>Class Average Score</p>
          <p className="large-number">78.5<span>%</span></p>
          <p className="small-text">Target: 80%</p>
        </div>

        <div className="card">
          <p>Highest Score</p>
          <p className="large-number">100<span>%</span></p>
          <p className="small-text">Top Performer: Alice Johnson</p>
        </div>

        <div className="card">
          <p>Pass Rate (≥ 70%)</p>
          <p className="large-number">86.2<span>%</span></p>
          <p className="small-text">Total Attempts: 850</p>
        </div>

        <div className="card">
          <p>Avg. Time Taken</p>
          <p className="large-number">12<span>m 30s</span></p>
          <p className="small-text">Quiz Duration: 15m</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Score Distribution */}
        <div className="chart chart-large">
          <h3>
            <i className="fas fa-chart-bar icon-small"></i> Student Score Distribution
          </h3>
          <p className="chart-description">Count of students who achieved scores within these bands.</p>
          <svg viewBox="0 0 100 55" className="bar-chart" preserveAspectRatio="none">
            <line x1="10" y1="5" x2="10" y2="45" stroke="#4b5563" strokeWidth="0.3" />
            <line x1="10" y1="45" x2="95" y2="45" stroke="#4b5563" strokeWidth="0.3" />
            <rect x="15" y="42" width="10" height="3" fill="#ef4444" />
            <rect x="30" y="38" width="10" height="7" fill="#f97316" />
            <rect x="45" y="30" width="10" height="15" fill="#f59e0b" />
            <rect x="60" y="15" width="10" height="30" fill="#22d3ee" />
            <rect x="75" y="8" width="10" height="37" fill="#10b981" />
            <text x="18" y="52" fontSize="2" fill="#9ca3af" textAnchor="middle">0–20%</text>
            <text x="33" y="52" fontSize="2" fill="#9ca3af" textAnchor="middle">21–40%</text>
            <text x="48" y="52" fontSize="2" fill="#9ca3af" textAnchor="middle">41–60%</text>
            <text x="63" y="52" fontSize="2" fill="#9ca3af" textAnchor="middle">61–80%</text>
            <text x="78" y="52" fontSize="2" fill="#9ca3af" textAnchor="middle">81–100%</text>
          </svg>
        </div>

        {/* Difficulty Performance */}
        <div className="chart chart-small">
          <h3>
            <i className="fas fa-cogs icon-small"></i> Performance by Difficulty
          </h3>
          <p className="chart-description">Avg. percentage correct on questions of each difficulty level.</p>
          <div className="difficulty-bars">
            {[
              { label: "Easy Questions", color: "#10b981", percent: 95 },
              { label: "Medium Questions", color: "#f59e0b", percent: 75 },
              { label: "Hard Questions", color: "#ef4444", percent: 58 },
            ].map((item) => (
              <div key={item.label} className="difficulty-bar">
                <div className="label-row">
                  <span style={{ color: item.color }}>{item.label}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${item.percent}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
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
                <th>Time Taken (Best)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "Alice Johnson", uid: "uid-5d1f...", score: "100%", attempts: 1, time: "10m 05s", color: "#facc15" },
                { rank: 2, name: "Bob Smith", uid: "uid-a8c2...", score: "95%", attempts: 2, time: "11m 45s", color: "#34d399" },
                { rank: 3, name: "Charlie Day", uid: "uid-f3e7...", score: "79%", attempts: 1, time: "14m 12s", color: "#f59e0b" },
                { rank: 4, name: "Diana Prince", uid: "uid-b0c4...", score: "65%", attempts: 3, time: "13m 22s", color: "#ef4444" },
              ].map((s) => (
                <tr key={s.rank} style={s.rank === 1 ? { borderLeft: `4px solid ${s.color}` } : {}}>
                  <td style={{ color: s.color, fontWeight: "bold" }}>{s.rank}</td>
                  <td>{s.name} <span className="uid">({s.uid})</span></td>
                  <td style={{ color: s.color, fontWeight: "bold" }}>{s.score}</td>
                  <td>{s.attempts}</td>
                  <td>{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
