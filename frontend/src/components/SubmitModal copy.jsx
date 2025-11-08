import React from "react";

export default function SubmitModal({ visible, resultSummary, detailsHTML, onClose, onRestart }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${visible ? "visible" : "invisible"}`}>
      <div className="bg-[#071028] p-6 rounded-2xl border border-[#2c3c55] shadow-lg max-w-lg w-full">
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Results</h3>
        <p className="text-white mb-4">{resultSummary}</p>
        <div className="text-sm max-h-56 overflow-auto text-[#d3d7de]" dangerouslySetInnerHTML={{ __html: detailsHTML }} />
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#2c3c55] text-white font-semibold">Close</button>
          <button onClick={onRestart} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0b6efd] to-[#00d4ff] text-white font-semibold">Restart Quiz</button>
        </div>
      </div>
    </div>
  );
}
