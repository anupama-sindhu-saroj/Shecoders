import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("myQuizzes");
  const [showModal, setShowModal] = useState(false);

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="quiz-nav">
          <button
            className={`nav-tab ${activeTab === "myQuizzes" ? "active" : ""}`}
            onClick={() => handleTabChange("myQuizzes")}
          >
            My Quizzes
          </button>
          <button
            className={`nav-tab ${
              activeTab === "attemptedQuizzes" ? "active" : ""
            }`}
            onClick={() => handleTabChange("attemptedQuizzes")}
          >
            Attempted Quizzes
          </button>
        </nav>

        <div className="action-buttons">
          <button
            className="action-btn create-quiz-btn"
            onClick={() => (window.location.href = "/create-quiz")}
          >
            + Create New Quiz
          </button>
          <button
            className="action-btn join-quiz-btn"
            onClick={() => setShowModal(true)}
          >
            Join Quiz
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {activeTab === "myQuizzes" && (
          <section className="quiz-content-section">
            <h1 className="section-title">My Quizzes</h1>
            <div className="summary-and-cards">
              <div className="quiz-card summary-card">
                <span className="icon-placeholder">📊</span>
                <h3>Activity Summary</h3>
                <p>Total Quizzes: 12</p>
                <p>Total Attempts: 345</p>
              </div>

              <div className="quiz-card">
                <h3>Introduction to Python</h3>
                <p>45 Attempts | 72% Avg. Score</p>
                <span className="status published">Published</span>
                <div className="card-actions">
                  <button className="card-btn">Edit</button>
                  <button className="card-btn">Analytics</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "attemptedQuizzes" && (
          <section className="quiz-content-section">
            <h1 className="section-title">Attempted Quizzes</h1>
            <div className="quiz-card">
              <h3>Digital Marketing Fundamentals</h3>
              <p>Your Score: 90%</p>
              <span className="status attempted-success">Completed</span>
            </div>
          </section>
        )}
      </main>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h3>🔗 Join Quiz</h3>
            <input
              type="text"
              placeholder="Enter Quiz Code"
              className="url-input"
            />
            <button className="submit-url-btn">Join Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
