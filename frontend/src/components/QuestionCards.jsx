import React from "react";

export default function QuestionCards({ question, selected, onSelect }) {
  if (!question) return null;
  return (
    <div id="quiz-card" className="bg-[#0f1628] text-[#d3d7de] p-6 rounded-lg shadow-lg flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Q. {question.text}</h2>
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`text-left p-3 rounded-lg border border-[#2c3c55] transition duration-200
              ${selected === idx ? "bg-[#0b6efd]/40 border-[#00d4ff]" : "hover:bg-[#445873]/50"}`}
          >
            {String.fromCharCode(65 + idx)}. {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
