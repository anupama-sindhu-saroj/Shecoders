import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("myQuizzes");
  const [showModal, setShowModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [quizCode, setQuizCode] = useState("");
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  const totalAttempts = attemptedQuizzes.length;

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ✅ Fetch quizzes
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

  // ✅ Fetch user attempts
  useEffect(() => {
    const fetchAttempts = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;
      if (!userId) return;

      try {
        const res = await fetch(
          `http://localhost:5001/api/submissions/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setAttemptedQuizzes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Failed to fetch user attempts:", error);
      }
    };

    fetchAttempts();
  }, []);
  
  useEffect(() => {
    console.log("attemptedQuizzes:", attemptedQuizzes);
  }, [attemptedQuizzes]);
  
  const handleJoinQuiz = async () => {
    if (!quizCode) return alert("Enter quiz ID or code!");
  
    // Extract only the MongoDB ObjectId from the input
    const objectIdMatch = quizCode.match(/[a-fA-F0-9]{24}/);
    if (!objectIdMatch) {
      return alert("Invalid Quiz ID. Make sure you copy the correct ID or link!");
    }
  
    const id = objectIdMatch[0];
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`http://localhost:5001/api/quizzes/public/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        return alert(errorData.message || "Quiz not found");
      }
  
      navigate(`/quiz/${id}`);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      alert("Failed to fetch quiz. Make sure the ID is correct.");
    }
  };
  
  
  
  // ✅ Separate quizzes into Drafts and Published
  const drafts = quizzes.filter((q) => q.status === "draft");
  const published = quizzes.filter((q) => q.status === "published");

  return (
    <div className="dashboard-container">
      {/* Header Navigation */}
      <header className="dashboard-header">
        <nav className="quiz-nav">
          <button
            className={`nav-tab ${activeTab === "myQuizzes" ? "active" : ""}`}
            onClick={() => setActiveTab("myQuizzes")}
          >
            My Quizzes
          </button>

          <button
            className={`nav-tab ${activeTab === "attemptedQuizzes" ? "active" : ""}`}
            onClick={() => setActiveTab("attemptedQuizzes")}
          >
            Attempted Quizzes
          </button>
        </nav>

        {/* ✅ Actions + Profile */}
        <div className="action-buttons">

          {/* ✅ Create Quiz */}
          <button
            className="action-btn create-quiz-btn"
            onClick={() => navigate("/create-quiz")}
          >
            + Create New Quiz
          </button>

          {/* ✅ Join Quiz */}
          <button
            className="action-btn join-quiz-btn"
            onClick={() => setShowModal(true)}
          >
            Join Quiz
          </button>

          {/* ✅ Profile Container */}
          <div className="profile-container">
            
            {/* ✅ Profile Button */}
            <button
              className="profile-btn"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              {(() => {
                const user = JSON.parse(localStorage.getItem("user") || "{}");

                // ✅ If profile picture exists → show image
                if (user?.picture) {
                  return (
                    <img
                      src={user.picture}
                      alt="profile"
                      className="profile-img"
                    />
                  );
                }

                // ✅ Try different possible email/name keys
                const email =
                  user?.email ||
                  user?.userEmail ||
                  user?.mail ||
                  user?.username ||
                  user?.name ||
                  "";

                // ✅ Extract initial safely
                const initial = email?.charAt(0)?.toUpperCase() || "U";

                return initial;
              })()}
            </button>

            {/* ✅ Profile Dropdown */}
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}

          </div>

        </div>
      </header>

      {/* ✅ MAIN */}
      <main className="dashboard-main">
        {/* ✅ TAB 1: My Quizzes */}
        {activeTab === "myQuizzes" && (
          <section className="quiz-content-section active-section">
            <h1 className="section-title">My Quizzes</h1>

            <div className="summary-and-cards">
              <div className="quiz-card summary-card">
                <h3>Activity Summary</h3>
                <p>Total Quizzes: <strong>{quizzes.length}</strong></p>
                <p>Total Attempts: <strong>{totalAttempts}</strong></p>
              </div>

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
                          onClick={() =>
                            navigate(`/create-quiz?draftId=${quiz._id}`)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {published.length > 0 && (
                <>
                  <h2 style={{ color: "#00ff88", marginTop: "30px" }}>
                    Published
                  </h2>

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

              {drafts.length === 0 && published.length === 0 && (
                <p style={{ color: "#aaa", marginTop: "20px" }}>
                  You haven't created any quizzes yet. Click “+ Create New Quiz” to start.
                </p>
              )}
            </div>
          </section>
        )}

        {/* ✅ TAB 2: Attempted Quizzes */}
        {activeTab === "attemptedQuizzes" && (
          <section className="quiz-content-section">
            <h1 className="section-title">Attempted Quizzes</h1>

            <div className="summary-and-cards">
              <div className="quiz-card attempted-summary">
                <h3>Attempt Stats</h3>
                <p>Quizzes Completed: <strong>{attemptedQuizzes.length}</strong></p>
                <p>
                  Highest Score:
                  <strong>
                    {" "}
                    {attemptedQuizzes.length > 0
                      ? Math.max(
                          ...attemptedQuizzes.map((a) =>
                            Math.round((a.totalScore / a.maxScore) * 100)
                          )
                        )
                      : 0}
                    %
                  </strong>
                </p>
              </div>

              {attemptedQuizzes.length > 0 ? (
                attemptedQuizzes.map((sub) => {
                  const quiz = sub.quizId;

                  return (
                    <div className="quiz-card attempted-card" key={sub._id}>
                      <h3>{quiz?.title || "Deleted Quiz"}</h3>

                      <div className="stats">
                        <p>
                          Your Score:
                          <strong>
                            {sub.totalScore}/{sub.maxScore} (
                            {sub.maxScore
                              ? Math.round(
                                  (sub.totalScore / sub.maxScore) * 100
                                )
                              : 0}
                            %)
                          </strong>
                        </p>

                        <p>
                          Attempt Date:{" "}
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="status attempted-success">
                        Completed
                      </span>

                      <div className="card-actions">
                        <button
                          className="card-btn analytics-btn"
                          onClick={() => navigate(`/results/${sub._id}`)}
                        >
                          View Report
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No quizzes attempted yet.</p>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ✅ Join Quiz Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>

            <h3>🔗 Join Quiz</h3>
            <p>Enter the Quiz URL or Code:</p>

            <input
              type="text"
              placeholder="Paste Quiz URL/Code here..."
              className="url-input"
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
            />

            <button className="submit-url-btn" onClick={handleJoinQuiz}>
              Join Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
