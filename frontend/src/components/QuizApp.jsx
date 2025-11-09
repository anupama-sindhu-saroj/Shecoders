// src/components/QuizApp.jsx
import React, { useEffect, useRef, useState } from "react";
import QuestionCards from "./QuestionCards";
import ProctorPanel from "./ProctorPanel";
import SubmitModal from "./SubmitModal";
import TimerBar from "./TimerBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function QuizApp({ testStarted }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [quiz, setQuiz] = useState(null);
  const totalQuestions = Array.isArray(quiz?.questions) ? quiz.questions.length : 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const timerIntervalRef = useRef(null);
  const [violations, setViolations] = useState(0);
  const [secureStatus, setSecureStatus] = useState("Status: Idle");
  const [modalVisible, setModalVisible] = useState(false);
  const [resultSummary, setResultSummary] = useState("Calculating...");
  const [resultDetailsHTML, setResultDetailsHTML] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [quizStarted, setQuizStarted] = useState(testStarted || false);
  const [endOverlayVisible, setEndOverlayVisible] = useState(false);
  const [showStartFullscreenModal, setShowStartFullscreenModal] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const fullscreenViolationRef = useRef(false);

  const { quizId } = useParams();
  const navigate = useNavigate();
  // -------------------- FETCH QUIZ --------------------
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/quizzes/public/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    setQuizStarted(testStarted);
  }, [testStarted]);

  useEffect(() => {
    if (!quizStarted) return;
    startTimer();
  }, [quizStarted]);

  useEffect(() => {
    if (quiz && quiz.duration) {
      setTimerSeconds(quiz.duration * 60); // duration is in minutes
    }
  }, [quiz]);
  // Initialize selected answers when quiz loads
  useEffect(() => {
    if (quiz && Array.isArray(quiz.questions)) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  // -------------------- EFFECTS --------------------
  // Visibility / blur tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (quizStarted && document.hidden) handleViolation("Switched tab or window not active!");
    };
    const handleWindowBlur = () => {
      if (quizStarted) handleViolation("Switched to another app!");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [quizStarted]);

  // Fullscreen tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!quizStarted) return;

      if (document.fullscreenElement) {
        setSecureStatus("Status: Secure (Fullscreen ON)");
        fullscreenViolationRef.current = false; // reset
      } else {
        setSecureStatus("Status: Not Fullscreen");

        if (!fullscreenViolationRef.current) {
          fullscreenViolationRef.current = true;
          setTimeout(() => {
            if (!document.fullscreenElement) {
              handleViolation("Fullscreen mode exited!");
              setShowViolationModal(true);
            }
          }, 2000); // 2s grace
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [quizStarted]);

  // Timer & keyboard navigation
  useEffect(() => {
    startTimer();

    const handleKeyDown = (ev) => {
      if (ev.key === "ArrowRight") handleNext();
      if (ev.key === "ArrowLeft") handlePrev();
      if (ev.key.toLowerCase() === "s" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        handleSubmit(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPaused]);

  // Double-click fullscreen toggle
  useEffect(() => {
    const el = document.getElementById("quiz-card");
    if (!el) return;
    const dblclickHandler = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    };
    el.addEventListener("dblclick", dblclickHandler);
    return () => el.removeEventListener("dblclick", dblclickHandler);
  }, []);

  // -------------------- TIMER --------------------
  const startTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (isPaused) return prev;
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setTimeout(() => {
            alert("⏰ Time's up! Submitting your test...");
            handleSubmit(true);
          }, 500);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };
  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
  
      const payload = {
        userId: user._id,
        quizId: quiz._id,
        answers: answers, // your collected answers
      };
  
      const res = await axios.post(
        `http://localhost:5001/api/submissions`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Quiz submitted:", res.data);
      alert("Quiz submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Quiz submission error:", err.response?.data || err.message);
      alert("Failed to submit quiz. Try again.");
    }
  };
  
  // -------------------- VIOLATIONS --------------------
  const handleViolation = (message) => {
    console.log("Violation:", message);

    setViolations((prev) => {
      const newCount = prev + 1;

      if (newCount >= 3) {
        setIsPaused(true);
        setSecureStatus("Status: Test ended due to 3 violations ⚠️");
        setEndOverlayVisible(true);

        setTimeout(() => {
          setEndOverlayVisible(false);
          handleEndTest(true);
        }, 3000);
      } else {
        setIsPaused(true);
        setShowViolationModal(true);
        setSecureStatus(`Status: Paused due to violation ⚠️ (Violation ${newCount}/3)`);
      }

      return newCount;
    });
  };

  const handleProceedAfterViolation = () => {
    setShowViolationModal(false);
    setIsPaused(false);
    setSecureStatus("Status: Secure (Resumed)");

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // -------------------- QUIZ LOGIC --------------------
  const handleSelect = (optionIndex) => {
    if (isPaused) return;
  
    setSelectedAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = optionIndex;
      return updated;
    });
  
    // Update `answers` array for backend submission
    setAnswers((prev) => {
      const updated = [...prev];
      const question = quiz.questions[currentIndex];
      updated[currentIndex] = {
        questionId: question._id,
        selectedOptions: [question.options[optionIndex]], // for single choice
        // For multiple choice, send array of selected options
      };
      return updated;
    });
  };
  
  const handleSelectMultiple = (option) => {
    if (isPaused) return;
  
    const question = quiz.questions[currentIndex];
    setAnswers((prev) => {
      const updated = [...prev];
      const existing = updated[currentIndex]?.selectedOptions || [];
      let newSelected;
  
      if (existing.includes(option)) {
        newSelected = existing.filter((o) => o !== option); // unselect
      } else {
        newSelected = [...existing, option]; // select
      }
  
      updated[currentIndex] = {
        questionId: question._id,
        selectedOptions: newSelected,
      };
      return updated;
    });
  };
  

  const handlePrev = () => {
    if (isPaused) return;
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    if (isPaused) return;
    setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
  };

  const handleSubmit = async (silent = false) => {
    if (!quiz || !answers.length) return;
  
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!user || !user._id) {
        alert("You are not logged in. Cannot submit quiz!");
        return;
      }
  
      const payload = {
        userId: user._id,
        userName: user.name || "User",
        quizId: quiz._id,
        answers: answers,
      };
  
      const res = await axios.post(
        "http://localhost:5001/api/submissions",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("✅ Quiz submitted:", res.data);
      if (!silent) alert("Quiz submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Quiz submission error:", err.response?.data || err.message);
      if (!silent) alert("Failed to submit quiz. Try again.");
    }
  };
  
  

  const handleCloseModal = () => setModalVisible(false);
  const handleRestart = () => {
    setModalVisible(false);
    setSelectedAnswers(new Array(totalQuestions).fill(null));
    setCurrentIndex(0);
    setTimerSeconds(25 * 60);
    startTimer();
  };

  const handleEndTest = (silent = false) => {
    // Pause everything
  setIsPaused(true);
  setEndOverlayVisible(true);
  
  // Stop timer
  if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

  // Submit quiz silently
  handleSubmit(true);

  // Optionally alert
  if (!silent) alert("⚠️ Test ended due to violations. Redirecting to dashboard...");

  // Redirect after 3 seconds
  setTimeout(() => {
    setEndOverlayVisible(false);
    navigate("/dashboard");
  }, 3000);
  };

  const ViolationModal = ({ visible, onProceed }) => {
    if (!visible) return null;
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#0f1628] text-white p-6 rounded-xl shadow-lg w-[90%] md:w-[400px] text-center border border-[#2c3c55]">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Violation Detected</h2>
          <p className="text-sm mb-6 text-[#d3d7de]">
            The test was paused due to unusual activity. Please stay within the test window.
          </p>
          <button
            onClick={onProceed}
            className="bg-gradient-to-r from-[#0b6efd] to-[#00d4ff] hover:opacity-90 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Proceed
          </button>
        </div>
      </div>
    );
  };
  console.log("Quiz data:", quiz);
  console.log("Questions:", quiz?.questions);
  console.log("Current index:", currentIndex);
  console.log("Selected answers:", selectedAnswers)
  // -------------------- RENDER --------------------
  return (
    <div className="relative bg-[#0a0f1e] text-[#d3d7de] font-sans flex flex-col h-screen overflow-hidden">
      <div className="flex flex-col h-screen w-full z-10 relative">
        <header className="flex justify-between items-center p-4 border-b border-[#2c3c55] backdrop-blur-md bg-[#0f1628]/70 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-[#00d4ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>
              <span className="text-[#00d4ff]">QUIZ</span>VAULT
            </span>
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TimerBar seconds={timerSeconds} />
            {isPaused && (
              <div className="text-yellow-400 text-sm text-center animate-pulse mt-2">
                ⚠️ Quiz paused due to violation — resuming soon...
              </div>
            )}
          </div>
        </header>
        <div className="mb-2 text-white text-sm flex justify-between">
  <span>Question {currentIndex + 1} / {totalQuestions}</span>
  <span>{Math.round(((currentIndex + 1) / totalQuestions) * 100)}%</span>
</div>
<div className="w-full h-2 bg-gray-700 rounded-full mb-4">
  <div
    className="h-2 bg-[#00d4ff] rounded-full transition-all duration-300"
    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
  ></div>
</div>
        <main className="flex flex-col md:flex-row p-4 md:p-6 flex-grow overflow-auto">
          <aside className="w-full md:w-1/3 lg:w-1/4 mb-4 md:mb-0 md:mr-6">
            <ProctorPanel
              onStartTest={() => setQuizStarted(true)}
              onEndTest={handleEndTest}
              onViolation={handleViolation}
              onReadyToStartFullscreen={() => setShowStartFullscreenModal(true)}
              testStarted={quizStarted}
            />
          </aside>

          <section className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
          {!quiz ? (
  <p className="text-center text-white mt-6">Loading quiz...</p>
) : !quizStarted ? (
  <p className="text-center text-white mt-6">Waiting for proctor to start the test...</p>
) : (
  <>
    <QuestionCards
      question={quiz.questions[currentIndex]}
      selected={selectedAnswers[currentIndex] ?? null} // safety check
      onSelect={handleSelect}
    />
    <div className="flex justify-between mt-4">
      <button onClick={handlePrev} disabled={currentIndex === 0 || isPaused} className="py-2 px-4 bg-[#1f2937] hover:bg-[#374151] text-white rounded-lg disabled:opacity-50 transition">
        Previous
      </button>
      <button onClick={handleNext} disabled={currentIndex === totalQuestions - 1 || isPaused} className="py-2 px-4 bg-[#1f2937] hover:bg-[#374151] text-white rounded-lg disabled:opacity-50 transition">
        Next
      </button>
    </div>
    {currentIndex === totalQuestions - 1 && (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => handleSubmit(false)}
      className="py-3 px-6 bg-[#0b6efd] text-white rounded-lg hover:opacity-90 transition"
    >
      Submit Quiz
    </button>
  </div>
)}

  </>
)}

</section>
          {isPaused && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-semibold">
              Test Paused due to Violation ⚠️
            </div>
          )}

{showStartFullscreenModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
    <div>
      <h2>😊 Ready to Start the Test</h2>
      <button
        onClick={() => {
          document.documentElement.requestFullscreen();
          setShowStartFullscreenModal(false);
          setQuizStarted(true); // ✅ Start quiz here
        }}
      >
        Start Test in Fullscreen
      </button>
    </div>
  </div>
)}

        </main>

        <footer className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-[#2c3c55] bg-[#0f1628]/60 backdrop-blur-md">
          <div className="text-sm muted">{secureStatus}</div>
        </footer>
      </div>

      <ViolationModal visible={showViolationModal} onProceed={handleProceedAfterViolation} />

      <SubmitModal
        visible={modalVisible}
        resultSummary={resultSummary}
        detailsHTML={resultDetailsHTML}
        onClose={handleCloseModal}
        onRestart={handleRestart}
      />

      {endOverlayVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-white text-2xl font-bold">
          ⚠️ Test ended due to 3 violations
        </div>
      )}
    </div>
  );
}
