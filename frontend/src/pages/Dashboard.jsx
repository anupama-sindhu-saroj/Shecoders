import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useSearchParams } from "react-router-dom";
import { getQuizById } from "../services/quizService";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("myQuizzes");
  const [showModal, setShowModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch quizzes when page loads
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setQuizzes(data.quizzes);
      } catch (error) {
        console.error("❌ Failed to fetch quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);
  

  // ✅ Separate quizzes into Drafts and Published
  const drafts = quizzes.filter((q) => q.status === "draft");
  const published = quizzes.filter((q) => q.status === "published");

  return (
    <div className="dashboard-container">
      {/* 🧭 Header Navigation */}
      <header className="dashboard-header">
        <nav className="quiz-nav">
          <button
            className={`nav-tab ${activeTab === "myQuizzes" ? "active" : ""}`}
            onClick={() => setActiveTab("myQuizzes")}
          >
            My Quizzes
          </button>
          <button
            className={`nav-tab ${
              activeTab === "attemptedQuizzes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("attemptedQuizzes")}
          >
            Attempted Quizzes
          </button>
        </nav>

        <div className="action-buttons">
          <button
            className="action-btn create-quiz-btn"
            onClick={() => navigate("/create-quiz")}
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

      {/* 📋 Main Dashboard */}
      <main className="dashboard-main">
        {/* ============================
            TAB 1: MY QUIZZES SECTION
        ============================ */}
        {activeTab === "myQuizzes" && (
          <section className="quiz-content-section active-section">
            <h1 className="section-title">My Quizzes</h1>

            <div className="summary-and-cards">
              <div className="quiz-card summary-card">
                <span className="icon-placeholder"></span>
                <h3>Activity Summary</h3>
                <p>
                  Total Quizzes: <strong>{quizzes.length}</strong>
                </p>
                <p>
                  Total Attempts: <strong>345</strong>
                </p>
              </div>

              {/* ==============================
                  DRAFT QUIZZES SECTION
              ============================== */}
              {drafts.length > 0 && (
                <>
                  <h2 style={{ color: "#00eaff", marginTop: "30px" }}>Drafts</h2>
                  {drafts.map((quiz) => (
                    <div className="quiz-card" key={quiz._id}>
                      <h3>{quiz.title}</h3>
                      <div className="stats">
                        <p>Duration: {quiz.duration} mins</p>
                        <p>Category: {quiz.category || "General"}</p>
                      </div>
                      <span className="status draft">Draft</span>
                      <div className="card-actions">
                        <button
                          className="card-btn edit-btn"
                          onClick={() => navigate(`/create-quiz?draftId=${quiz._id}`)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ==============================
                  PUBLISHED QUIZZES SECTION
              ============================== */}
              {published.length > 0 && (
                <>
                  <h2 style={{ color: "#00ff88", marginTop: "30px" }}>Published</h2>
                  {published.map((quiz) => (
                    <div className="quiz-card" key={quiz._id}>
                      <h3>{quiz.title}</h3>
                      <div className="stats">
                        <p>Duration: {quiz.duration} mins</p>
                        <p>Category: {quiz.category || "General"}</p>
                      </div>
                      <span className="status published">Published</span>
                      <div className="card-actions">
                        <button
                          className="card-btn analytics-btn"
                          onClick={() => {
                            const quizLink = `${window.location.origin}/quiz/${quiz._id}`;
                            navigator.clipboard.writeText(quizLink);
                            alert(`✅ Quiz link copied!\n${quizLink}`);
                          }}
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* ✅ Empty State */}
              {drafts.length === 0 && published.length === 0 && (
                <p style={{ color: "#aaa", marginTop: "20px" }}>
                  You haven’t created any quizzes yet. Click “+ Create New Quiz”
                  to start.
                </p>
              )}
            </div>
          </section>
        )}

        {/* ============================
            TAB 2: ATTEMPTED QUIZZES SECTION
        ============================ */}
        {activeTab === "attemptedQuizzes" && (
          <section className="quiz-content-section">
            <h1 className="section-title">Attempted Quizzes</h1>
            <div className="summary-and-cards">
              <div className="quiz-card attempted-summary">
                <h3>Attempt Stats</h3>
                <p>
                  Quizzes Completed: <strong>5</strong>
                </p>
                <p>
                  Highest Score: <strong>95%</strong>
                </p>
              </div>

              <div className="quiz-card attempted-card">
                <h3>Digital Marketing Fundamentals</h3>
                <div className="stats">
                  <p>
                    Your Score: <strong>9/10 (90%)</strong>
                  </p>
                  <p>Attempt Date: 2025-11-05</p>
                </div>
                <span className="status attempted-success">Completed</span>
                <div className="card-actions">
                  <button className="card-btn analytics-btn">View Report</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 🔗 Join Quiz Modal */}
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
            <p>Enter the Quiz URL or Code:</p>
            <input
              type="text"
              placeholder="Paste Quiz URL/Code here..."
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
