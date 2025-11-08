import React from "react";

export default function TimerBar({ seconds }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-[#0b6efd] to-[#00d4ff] shadow-[0_0_15px_#0b6efd]">
      ⏱ Timer: {mm}:{ss}
    </div>
  );
}
