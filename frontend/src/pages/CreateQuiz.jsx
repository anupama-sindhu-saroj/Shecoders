import React, { useState , useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { saveQuiz } from "../services/quizService";
import MessageBox from "../components/MessageBox";
import QuestionCard from "../components/QuestionCard";
 
export default function CreateQuiz() {
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    duration: 15,
    difficulty: "Medium",
    category: "",
    startDate: "",
    endDate: "",
    attemptLimit: 0,
    public: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    negativeMarking: 0,
    questions: [],
  });
   useEffect(() => {
  const query = new URLSearchParams(window.location.search);
  const isDraftEdit = query.has("draftId");

  // If editing an existing draft, keep fetched draft data (API will set state).
  if (isDraftEdit) return;

  // If user came back from preview, restore from localStorage.previewQuizData
  const fromPreview = sessionStorage.getItem("fromPreview");
  const previewRaw = localStorage.getItem("previewQuizData");

  if (fromPreview) {
    sessionStorage.removeItem("fromPreview"); // one-time flag

    if (previewRaw) {
      try {
        const previewQuiz = JSON.parse(previewRaw);
        // prefer preview data when coming back from Preview
        setQuiz(previewQuiz);
      } catch (e) {
        console.error("Invalid previewQuizData JSON:", e);
        // fallback: reset form below
        localStorage.removeItem("previewQuizData");
        setQuiz({
          title: "",
          description: "",
          duration: 15,
          difficulty: "Medium",
          category: "",
          startDate: "",
          endDate: "",
          attemptLimit: 0,
          public: true,
          randomizeQuestions: false,
          randomizeOptions: false,
          negativeMarking: 0,
          questions: [],
        });
      }
    } else {
      // no preview stored — nothing to restore
    }
    return; // do not reset the form
  }

  // Otherwise it's a fresh new quiz: clear preview storage + reset state
  localStorage.removeItem("previewQuizData");
  setQuiz({
    title: "",
    description: "",
    duration: 15,
    difficulty: "Medium",
    category: "",
    startDate: "",
    endDate: "",
    attemptLimit: 0,
    public: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    negativeMarking: 0,
    questions: [],
  });
}, []);


  const [searchParams] = useSearchParams();
const draftId = searchParams.get("draftId");

useEffect(() => {
  if (draftId) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5001/api/quizzes/${draftId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.quiz) setQuiz(data.quiz);
      });
  }
}, [draftId]);


  const [shareLink, setShareLink] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const validateDates = () => {
  if (quiz.startDate && quiz.endDate) {
    const start = new Date(quiz.startDate);
    const end = new Date(quiz.endDate);

    if (end < start) {
      setMessage({
        text: "⚠️ End Date cannot be before Start Date.",
        type: "error",
      });
      // Auto-correct by resetting endDate
      setQuiz((prev) => ({ ...prev, endDate: "" }));
    }
  }
};


  const addQuestion = () => {
  const newQuestion = {
    id: quiz.questions.length + 1,
    text: "",
    image: null,
    type: "single", // ✅ matches your allowed enum
    options: ["", ""], // ✅ at least two blank options
    correct: [], // ✅ avoids undefined.includes crash
    points: 1,
    negative: false,
    trueFalseValue: null,
    expectedAnswer: "",
  };

  setQuiz((prev) => ({
    ...prev,
    questions: [...prev.questions, newQuestion],
  }));
};


  const removeQuestion = (id) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const token = localStorage.getItem("token"); // token from login

  const saveDraft = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setMessage({ text: "Please log in again.", type: "error" });
    return;
  }

  const url = draftId
    ? `http://localhost:5001/api/quizzes/${draftId}`
    : "http://localhost:5001/api/quizzes";
  const method = draftId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...quiz, status: "draft" }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({
        text: draftId
          ? "✅ Draft updated successfully!"
          : "✅ Draft saved successfully!",
        type: "success",
      });

      // 🕒 Small delay to let user see success message, then redirect
      setTimeout(() => {
        // ✅ clear preview data so next time CreateQuiz is fresh
        localStorage.removeItem("previewQuizData");
        sessionStorage.removeItem("fromPreview");

        // ✅ navigate after cleanup
        navigate("/dashboard");
      }, 800);

    } else {
      setMessage({ text: data.error || "❌ Failed to save draft", type: "error" });
    }
  } catch (err) {
    console.error("Error saving draft:", err);
    setMessage({ text: "❌ Network error while saving draft", type: "error" });
  }
};

  const validateQuizBeforePublish = () => {
  // ✅ 1. Basic quiz info checks
  if (!quiz.title.trim()) {
    setMessage({ text: "⚠️ Quiz title is required.", type: "error" });
    return false;
  }

  if (!quiz.description.trim()) {
    setMessage({ text: "⚠️ Quiz description is required.", type: "error" });
    return false;
  }

  // ✅ 2. Duration should be positive
  if (!quiz.duration || quiz.duration <= 0) {
    setMessage({
      text: "⚠️ Duration must be greater than 0 minutes.",
      type: "error",
    });
    return false;
  }

  // ✅ 3. Dates must both be provided
  if (!quiz.startDate || !quiz.endDate) {
    setMessage({
      text: "⚠️ Please provide both Start Date and End Date before publishing.",
      type: "error",
    });
    return false;
  }

  // ✅ 4. Validate start/end date logic
  const start = new Date(quiz.startDate);
  const end = new Date(quiz.endDate);
  if (end < start) {
    setMessage({
      text: "⚠️ End Date cannot be before Start Date.",
      type: "error",
    });
    return false;
  }

  // ✅ 5. At least one question required
  if (quiz.questions.length === 0) {
    setMessage({
      text: "⚠️ Please add at least one question before publishing.",
      type: "error",
    });
    return false;
  }

  // ✅ 6. Validate every question thoroughly
  for (let q of quiz.questions) {
    if (!q.text.trim()) {
      setMessage({
        text: `⚠️ Question ${q.id || 1} must have text.`,
        type: "error",
      });
      return false;
    }

    const validOptions = q.options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      setMessage({
        text: `⚠️ Question ${q.id || 1} must have at least two options.`,
        type: "error",
      });
      return false;
    }

    if (!q.correct || q.correct.length === 0) {
      setMessage({
        text: `⚠️ Question ${q.id || 1} must have at least one correct answer.`,
        type: "error",
      });
      return false;
    }
  }

  // ✅ 7. Attempt limit must be non-negative
  if (quiz.attemptLimit < 0) {
    setMessage({
      text: "⚠️ Attempt limit cannot be negative.",
      type: "error",
    });
    return false;
  }

  // ✅ Passed all checks
  return true;
};

  const publishQuiz = async () => {
  // Run validation first
  if (!validateQuizBeforePublish()) return;

  const data = await saveQuiz(quiz, "published", token);

  if (data.success) {
    // ✅ cleanup preview storage so next time CreateQuiz opens fresh
    localStorage.removeItem("previewQuizData");
    sessionStorage.removeItem("fromPreview");

    if (data.link) {
      setShareLink(data.link);
      setShowLinkModal(true);
    } else {
      // if there's no link but success, go to dashboard after brief message
      setMessage({ text: "Published successfully!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 800);
    }
  } else {
    setMessage({
      text: data.error || "Publish failed",
      type: "error",
    });
  }
};

  


  return (
    <div className="w-screen min-h-screen bg-[#0b0f19] text-gray-100 overflow-y-scroll h-full">
      <div className="py-10 px-8 md:px-16 lg:px-24">
        <h1
          className="text-4xl font-extrabold text-white mb-8 tracking-wide"
          style={{
            textShadow:
              "0 0 10px rgba(0,255,255,0.6), 0 0 20px rgba(0,255,255,0.4)",
          }}
        >
          Create New Quiz
        </h1>

        {/* Quiz Details & Setup */}
        <div className="bg-[#131a2a] border border-white-700/40 rounded-2xl p-8 shadow-[0_0_25px_rgba(0,255,255,0.05)] mb-10 transition-transform duration-300 hover:shadow-[0_0_35px_rgba(0,255,255,0.15)]">
          <h2 className="text-2xl font-semibold mb-6 text-[#24d1f5] flex items-center gap-3">
            <i className="fas fa-clipboard-list text-[#00bcd4]"></i>
            Quiz Details & Setup
          </h2>

          {/* Quiz Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
            <div>
              <label className="block text-sm text-white-400 mb-2">
                1. Quiz Title (e.g., Basics of Networking)
              </label>
              <input
                type="text"
                name="title"
                value={quiz.title}
                onChange={handleChange}
                placeholder="Quiz Title"
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                2. Description (Small intro for users)
              </label>
              <input
                type="text"
                name="description"
                value={quiz.description}
                onChange={handleChange}
                placeholder="Describe the focus, number of questions, and time limit."
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                3. Timer / Duration (Minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={quiz.duration}
                onChange={handleChange}
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                4. Difficulty
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={handleChange}
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                5. Category / Tags
              </label>
              <input
                type="text"
                name="category"
                value={quiz.category}
                onChange={handleChange}
                placeholder="Web Dev, Math, History (comma separated)"
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                6. Attempt Limit
              </label>
              <input
                type="number"
                name="attemptLimit"
                value={quiz.attemptLimit}
                onChange={handleChange}
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                7. Schedule Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={quiz.startDate}
                onChange={handleChange}
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm text-white-400 mb-2">
                8. Schedule End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={quiz.endDate}
                onChange={handleChange}
                onBlur={validateDates} 
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>
          </div>

          {/* 🔧 Advanced Settings */}
          <div className="mt-10 border-t border-cyan-700/40 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Advanced Settings
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Toggle 1 */}
              <div className="bg-[#0e1624] border border-cyan-700/40 p-4 rounded-xl flex justify-between items-center">
                <span className="text-sm text-white-300">
                  10. Randomize Questions Order
                </span>
                <div
                  onClick={() =>
                    setQuiz((prev) => ({
                      ...prev,
                      randomizeQuestions: !prev.randomizeQuestions,
                    }))
                  }
                  className={`relative w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
                    quiz.randomizeQuestions ? "bg-[#00eaff]" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                      quiz.randomizeQuestions ? "translate-x-6" : ""
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Questions */}
        <h2
          className="text-2xl font-semibold mb-4 text-white-900"
          style={{
            textShadow:
              "0 0 10px rgba(0,255,255,0.6), 0 0 20px rgba(0,255,255,0.4)",
          }}
        >
          Add Questions
        </h2>

        <div className="flex flex-col gap-6">
          {quiz.questions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              question={q}
              updateQuestion={(updatedQ) => {
                setQuiz((prev) => ({
                  ...prev,
                  questions: prev.questions.map((qq) =>
                    qq.id === q.id ? updatedQ : qq
                  ),
                }));
              }}
              removeQuestion={removeQuestion}
            />
          ))}

          <button
            onClick={addQuestion}
            className="bg-[#007ea7] hover:bg-[#06e2ff] text-white-900 font-semibold px-5 py-2 rounded-lg w-fit self-center transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
          >
            + Add New Question
          </button>
        </div>

        {/* Save / Preview */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <button
            onClick={saveDraft}
            className="bg-[#1f2937] hover:bg-[#374151] text-white px-6 py-2 rounded-lg transition"
          >
            💾 Save Draft
          </button>

         <button
          onClick={() => {
            if (!quiz.title.trim()) {
              setMessage({
                text: "⚠️ Add a title before previewing.",
                type: "error",
              });
              return;
            }

            // ✅ Save current quiz to localStorage for preview
              localStorage.setItem("previewQuizData", JSON.stringify(quiz));

              // ✅ Mark we came from Preview
              sessionStorage.setItem("fromPreview", "true");

              // ✅ Go to preview
              navigate("/preview");

          }}
          className="bg-[#007ea7] hover:bg-[#06e2ff] text-white-900 font-semibold px-6 py-2 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-300"
        >
          👁️ Preview Quiz
        </button>



           <button
              onClick={publishQuiz}
              className="bg-[#007ea7] hover:bg-[#06e2ff] text-white-00 font-semibold px-6 py-2 rounded-lg shadow-[0_0_25px_rgba(0,255,255,0.4)] hover:shadow-[0_0_35px_rgba(0,255,255,0.7)] transition-all duration-300 flex items-center gap-2"
            >
              <i className="fas fa-cloud-upload-alt text-white-800"></i>
              Publish Quiz
            </button>

        </div>
      </div>
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#131a2a] border border-cyan-700/40 rounded-xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.3)] w-96 text-center">
            <h2 className="text-2xl text-[#24d1f5] mb-4 font-semibold">
              🎉 Quiz Published Successfully!
            </h2>
            <p className="text-gray-300 mb-4">Here’s your shareable link:</p>

            <div className="flex items-center gap-2 bg-[#0e1624] border border-cyan-700/40 rounded-lg px-3 py-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 bg-transparent text-[#00eaff] text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-sm bg-[#00bcd4] hover:bg-[#06e2ff] text-gray-900 font-semibold px-2 py-1 rounded-md"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => window.open(shareLink, "_blank")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Open Link
              </button>
              <button
                  onClick={() => {
                    setShowLinkModal(false);
                    navigate("/dashboard"); // ✅ Redirects after closing modal
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}

      {message && <MessageBox message={message.text} type={message.type} />}
    </div>
  );
  
}
