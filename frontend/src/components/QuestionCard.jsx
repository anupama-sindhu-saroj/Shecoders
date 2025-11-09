import React from "react";

const QuestionCard = ({ id, question, updateQuestion, removeQuestion }) => {
  
  const safeQuestion = {
    text: "",
    image: null,
    type: "single",
    options: ["", ""],
    correct: [],
    points: 1,
    negative: false,
    trueFalseValue: null,
    expectedAnswer: "",
    ...question, // merge actual question data
  };

  // Handle text, dropdown, number input, etc.
  const handleChange = (e) => {
    updateQuestion({ ...safeQuestion, [e.target.name]: e.target.value });
  };

  //  Handle changing an option’s text
  const handleOptionChange = (index, value) => {
    const updated = [...safeQuestion.options];
    updated[index] = value;
    updateQuestion({ ...safeQuestion, options: updated });
  };

  //  Add new option field
  const addOption = () => {
    updateQuestion({ ...safeQuestion, options: [...safeQuestion.options, ""] });
  };

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("http://localhost:5001/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);

    if (data.success) {
      // ✅ Use functional update to always get the latest question state
      updateQuestion((prevQ) => ({
        ...prevQ,
        image: data.imageUrl,
      }));

      console.log("✅ Image uploaded and state updated:", data.imageUrl);
      alert("✅ Image uploaded successfully!");
    } else {
      alert("❌ Upload failed: " + data.message);
    }
  } catch (err) {
    console.error("❌ Error uploading image:", err);
    alert("Network error while uploading image.");
  }
};



  // ⚠️ Toggle negative marking
  const toggleNegative = () => {
    updateQuestion({ ...safeQuestion, negative: !safeQuestion.negative });
  };

  // ✅ Select correct answers (single or multiple)
  const toggleCorrect = (index) => {
    if (safeQuestion.type === "single") {
      updateQuestion({ ...safeQuestion, correct: [index] });
    } else {
      const current = [...safeQuestion.correct];
      if (current.includes(index)) {
        updateQuestion({
          ...safeQuestion,
          correct: current.filter((i) => i !== index),
        });
      } else {
        updateQuestion({
          ...safeQuestion,
          correct: [...current, index],
        });
      }
    }
  };

  // 🟢 True/False toggle
  const toggleTrueFalse = (value) => {
    updateQuestion({ ...safeQuestion, trueFalseValue: value });
  };

  return (
    <div className="bg-[#131a2a] border border-cyan-700/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,255,0.05)] hover:shadow-[0_0_35px_rgba(0,255,255,0.15)] transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-cyan-700/30 pb-2">
        <h3 className="text-xl font-semibold text-[#24d1f5]">Question {id}</h3>
        <div className="flex items-center gap-3">
          <select
            name="type"
            value={safeQuestion.type}
            onChange={handleChange}
            className="bg-[#0e1624] border border-cyan-700/40 text-gray-200 p-1 rounded-md text-sm focus:border-[#24d1f5]"
          >
            <option value="single">MCQ (Single Correct)</option>
            <option value="multiple">MCQ (Multiple Correct)</option>
            <option value="truefalse">True / False</option>
            <option value="short">Short Answer</option>
          </select>
          <button
            onClick={() => removeQuestion(id)}
            className="text-red-500 hover:text-red-400 transition"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      {/* Question Text */}
      <label className="block text-gray-300 mb-2">Question Text</label>
      <textarea
        name="text"
        rows="2"
        placeholder="Enter your question here..."
        value={safeQuestion.text}
        onChange={handleChange}
        className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-3 rounded-md mb-4 resize-none"
      ></textarea>

      {/* Upload Image */}
      <div className="flex items-center justify-between bg-[#0e1624] border border-cyan-700/40 p-3 rounded-md mb-4">
        <label className="text-sm text-gray-400">Add Image / Media (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm text-gray-400 file:bg-[#00c8ff] file:text-gray-900 file:font-semibold file:px-3 file:py-1 file:rounded-md hover:file:bg-[#06e2ff] transition"
        />
      </div>

      {/* Short Answer Type */}
      {safeQuestion.type === "short" && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Expected Answer</label>
          <textarea
            name="expectedAnswer"
            value={safeQuestion.expectedAnswer}
            onChange={handleChange}
            placeholder="Enter expected short answer..."
            className="w-full bg-[#0e1624] border border-cyan-700/40 text-gray-200 p-3 rounded-md resize-none"
          ></textarea>
        </div>
      )}

      {/* True / False Type */}
      {safeQuestion.type === "truefalse" && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => toggleTrueFalse(true)}
            className={`px-4 py-2 rounded-md ${
              safeQuestion.trueFalseValue === true
                ? "bg-[#00eaff] text-gray-900"
                : "bg-[#0e1624] text-gray-200 border border-cyan-700/40"
            }`}
          >
            True
          </button>
          <button
            onClick={() => toggleTrueFalse(false)}
            className={`px-4 py-2 rounded-md ${
              safeQuestion.trueFalseValue === false
                ? "bg-[#00eaff] text-gray-900"
                : "bg-[#0e1624] text-gray-200 border border-cyan-700/40"
            }`}
          >
            False
          </button>
        </div>
      )}

      {/* MCQ (Single / Multiple) */}
      {(safeQuestion.type === "single" || safeQuestion.type === "multiple") && (
        <div className="mb-4">
          {safeQuestion.options.map((opt, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <input
                type={safeQuestion.type === "single" ? "radio" : "checkbox"}
                name={`q-${id}`}
                checked={
                  Array.isArray(safeQuestion.correct) &&
                  safeQuestion.correct.includes(index)
                }
                onChange={() => toggleCorrect(index)}
                className="accent-[#00eaff]"
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
              />
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-[#00c8ff] hover:text-[#06e2ff] font-medium text-sm mt-2"
          >
            + Add Option
          </button>

          {/* ✅ Correct Answer Preview */}
          <p className="text-sm text-cyan-400 mt-3">
            ✅ Correct Option(s):{" "}
            {safeQuestion.correct.length > 0
              ? safeQuestion.correct
                  .map((i) => safeQuestion.options[i] || `Option ${i + 1}`)
                  .join(", ")
              : "None selected"}
          </p>
        </div>
      )}

      {/* Points & Negative Marking */}
      <div className="flex flex-wrap items-center justify-between mt-6 border-t border-cyan-700/30 pt-4">
        <div className="flex items-center gap-3">
          <label className="text-gray-300">Points:</label>
          <input
            type="number"
            min="1"
            name="points"
            value={safeQuestion.points}
            onChange={handleChange}
            className="w-20 bg-[#0e1624] border border-cyan-700/40 focus:border-[#24d1f5] text-gray-200 p-2 rounded-md"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-gray-300">Negative Marking?</label>
          <div
            onClick={toggleNegative}
            className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition ${
              safeQuestion.negative ? "bg-[#00c8ff]" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                safeQuestion.negative ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
