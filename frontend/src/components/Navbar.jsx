import React from "react";

const Navbar = ({ userId }) => (
  <nav className="bg-gray-900 border-b border-gray-700/50">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
      <div className="flex items-center space-x-6">
        {["My Quizzes", "Attempted Quizzes", "Create New Quiz", "Analytics"].map((link, i) => (
          <a key={i} href="#" className={`nav-link ${link === "Create New Quiz" ? "active text-cyan-400" : "text-gray-400 hover:text-white"}`}>
            {link}
          </a>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500 truncate">
          User ID: <span className="text-cyan-400 font-mono">{userId || "Loading..."}</span>
        </span>
        <button className="bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-cyan-500 transition">
          <i className="fas fa-plus mr-2"></i> Join Quiz
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
