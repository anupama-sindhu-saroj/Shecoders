import React from 'react';
import { useNavigate } from "react-router-dom";
// --- Icon Components ---
// We define the icons as separate components to keep the main JSX clean.

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const HeroIllustration = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g transform="translate(100 100)">
      {/* Background blob - Changed to a darker grey color */}
      <path d="M48.5,-59.8C62.8,-49,74.2,-33.1,77.5,-15.8C80.8,1.5,76,19.9,65.8,33.8C55.6,47.7,40.1,57,24.7,63.6C9.3,70.2,-6,74,-20.9,70.1C-35.8,66.2,-50.3,54.6,-61.4,40.1C-72.5,25.6,-80.2,8.2,-78.9,-8.3C-77.6,-24.8,-67.2,-40.4,-53.6,-50.9C-40,-61.3,-23.1,-66.6,-5.5,-65.4C12.2,-64.1,24.2,-56.3,34.4,-50.2C44.7,-44.1,52.8,-40.1,59.8,-32.8C66.8,-25.6,72.7,-15.1,72.4,-4.4C72.1,6.3,65.6,17,58.2,26.4C50.8,35.8,42.4,43.9,32.8,49.8C23.1,55.7,12.2,59.4,-0.4,60C-13,60.6,-26.1,58.1,-38.4,51.8C-50.7,45.5,-62.3,35.4,-68.8,22.8C-75.3,10.2,-76.8,-4.8,-73.4,-18.8C-70,-32.8,-61.7,-45.8,-49.9,-54.6C-38.1,-63.4,-22.8,-68,-8.2,-67.2C6.4,-66.4,12.8,-60.2,21.6,-54.8C30.4,-49.4,41.6,-44.8,48.5,-59.8Z" fill="#374151" transform="scale(1.5)"></path> {/* bg-gray-700 equivalent */}
      
      {/* Main Icon: Shield + Laptop */}
      <g transform="translate(0, 0) scale(0.9)">
        {/* Shield - kept the indigo stroke */}
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-20, -50) scale(3.5)" /> {/* text-indigo-500 */}
        {/* Checkmark inside shield */}
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-20, -50) scale(3.5)" />
        <path d="M22 4L12 14.01l-3-3" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-20, -50) scale(3.5)" />
        
        {/* Laptop - Changed to dark grey and borders */}
        <rect x="-60" y="20" width="120" height="70" rx="8" ry="8" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/> {/* bg-gray-800, stroke-gray-600 */}
        <line x1="-60" y1="75" x2="60" y2="75" stroke="#4b5563" strokeWidth="2"/> {/* stroke-gray-600 */}
        <rect x="-70" y="90" width="140" height="10" rx="5" ry="5" fill="#374151" stroke="#4b5563" strokeWidth="2"/> {/* bg-gray-700, stroke-gray-600 */}
        
        {/* Screen content (simple lines) */}
        <line x1="-45" y1="35" x2="45" y2="35" stroke="#4b5563" strokeWidth="2" strokeLinecap="round"/> {/* stroke-gray-600 */}
        <line x1="-45" y1="45" x2="30" y2="45" stroke="#4b5563" strokeWidth="2" strokeLinecap="round"/>
        <line x1="-45" y1="55" x2="40" y2="55" stroke="#4b5563" strokeWidth="2" strokeLinecap="round"/>
        <line x1="-45" y1="65" x2="35" y2="65" stroke="#4b5563" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </g>
  </svg>
);


/**
 * Main App Component for QuizVault Landing Page (Dark Theme)
 * Assumes Tailwind CSS is set up in the project.
 */
export default function App() {
    const navigate = useNavigate(); 
  return (
    <>
      {/* Global Style Overrides for Dark Theme */}
      <style>
        {`
          @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: .7; } /* Slightly more opaque pulse in dark mode */
          }
          .animate-pulse-slow {
              animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          /* Ensure root takes full height and uses dark theme colors */
          html, body, #root {
            font-family: 'Inter', sans-serif;
            background-color: #111827; /* bg-gray-900 */
            color: #f9fafb; /* text-gray-50 */
            width: 100%;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
        `}
      </style>

      {/* Main Container - bg-gray-900 and text-gray-50 */}
      <div className="min-h-screen w-full flex flex-col font-sans bg-gray-900 text-gray-50">
        {/* Header - bg-gray-800 and shadow-lg */}
        <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo - text-gray-50 */}
              <div className="flex-shrink-0 flex items-center">
                <span className="ml-2 text-2xl font-bold text-gray-50">QuizVault</span>
              </div>
              {/* Navigation / CTA */}
              <div className="flex items-center">
                {/* Links - text-gray-300 hover:text-gray-50 */}
                <a href="#features" className="hidden sm:inline-block text-gray-300 hover:text-gray-50 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#how-it-works" className="hidden sm:inline-block text-gray-300 hover:text-gray-50 px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
                <button
                onClick={() => navigate("/auth")} // or "/signup" or "/login"
                // CTA Button - bg-indigo-600 remains the same for contrast
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all" // Added focus:ring-offset-gray-900
                >
                  Student Login
                  </button>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section - bg-gray-800 */}
          <section className="bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Hero Text - text-gray-50 */}
                <div className="text-center md:text-left">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-50">
                    Take Your Quizzes with
                    <span className="block text-indigo-400">Confidence & Security.</span> {/* Changed to indigo-400 for better contrast on dark background */}
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-gray-300"> {/* text-gray-300 */}
                    QuizVault offers a fair and secure testing environment with interactive proctoring. Focus on your test, we'll handle the integrity.
                  </p>
                  <div className="mt-10 flex justify-center md:justify-start">
                    {/* CTA Button - bg-indigo-600 remains the same */}
                    <a href="#how-it-works" className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-all"> {/* Added focus:ring-offset-gray-800 */}
                      How It Works
                    </a>
                  </div>
                </div>
                {/* Hero Illustration */}
                <div className="hidden md:block" style={{ transform: 'translateY(-70px) scale(0.9)' }}>
                  <HeroIllustration />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - bg-gray-900 */}
          <section id="features" className="py-20 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-50">A Student-Focused Experience</h2>
                <p className="mt-4 text-lg text-gray-300">Built from the ground up for a seamless testing process.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature Cards - bg-gray-800, text-gray-50, border-gray-700, bg-indigo-200/20 for icon backgrounds */}
                {/* Feature 1: Secure Proctoring */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-200/20 text-indigo-400 mb-4"> {/* Adjusted icon background/text for dark mode */}
                    <LockIcon />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-50">Secure Online Proctoring</h3>
                  <p className="text-gray-300">
                    Ensures the right person is taking the test. Our system uses face detection and verification to maintain test integrity from start to finish.
                  </p>
                </div>

                {/* Feature 2: Smart Monitoring */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-200/20 text-indigo-400 mb-4">
                    <EyeIcon />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-50">Real-time Behavior Tracking</h3>
                  <p className="text-gray-300">
                    Monitors for suspicious behaviors like multiple faces, looking away, or absence from the frame. Violations are tracked live.
                  </p>
                </div>

                {/* Feature 3: Interactive Quiz UI */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-200/20 text-indigo-400 mb-4">
                    <FileTextIcon />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-50">Intuitive Quiz Interface</h3>
                  <p className="text-gray-300">
                    Questions are presented one by one with clear multiple-choice options and time limits, allowing you to focus on one problem at a time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section - bg-gray-800 */}
          <section id="how-it-works" className="py-20 bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-50">How It Works</h2>
                <p className="mt-4 text-lg text-gray-300">A simple, secure 4-step process.</p>
              </div>

              {/* Steps */}
              <div className="relative">
                {/* Connecting line - bg-gray-700 */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 transform -translate-y-1/2" style={{ zIndex: 0 }}></div>
                
                <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 z-10">
                  {/* Step Cards - bg-gray-900, text-gray-50 */}
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-xl">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl mb-4 shadow-lg">1</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-50">Select Your Quiz</h3>
                    <p className="text-gray-300">Choose from the list of available quizzes assigned to you.</p>
                  </div>
                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-xl">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl mb-4 shadow-lg">2</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-50">Verify Your Identity</h3>
                    <p className="text-gray-300">A quick face verification ensures it's you. Just "Smile to start the test!"</p>
                  </div>
                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-xl">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl mb-4 shadow-lg">3</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-50">Take the Quiz</h3>
                    <p className="text-gray-300">Answer questions one-by-one while the proctoring system monitors in the background.</p>
                  </div>
                  {/* Step 4 */}
                  <div className="flex flex-col items-center text-center p-4 bg-gray-900 rounded-lg shadow-xl">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-2xl mb-4 shadow-lg">4</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-50">Get Instant Results</h3>
                    <p className="text-gray-300">Receive your score and feedback immediately after completion.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer - bg-gray-900 and border-gray-700 */}
        <footer className="bg-gray-900 border-t border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center flex-col sm:flex-row">
              <div className="flex items-center text-gray-300"> {/* text-gray-300 */}
                <span className="ml-2 text-xl font-semibold">QuizVault</span>
              </div>
              <p className="text-gray-500 text-sm mt-4 sm:mt-0"> {/* text-gray-500 */}
                &copy; 2025 QuizVault. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}