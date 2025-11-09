import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Auth components
import AuthContainer from "./components/AuthContainer/AuthContainer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import PreviewQuiz from "./pages/PreviewQuiz";
import QuizAnalytics from "./pages/QuizAnalytics";
import ResultPage from "./pages/ResultPage";

// Quiz components
import Myapp from "./Myapp.jsx"; // Quiz overview
import QuizApp from "./components/QuizApp.jsx"; // Quiz attempt page

import "./index.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
          {/* Landing / Home */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Dashboard and Quiz Management */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/preview" element={<PreviewQuiz />} />

          {/* Quiz Routes */}
          <Route path="/quiz/:quizId" element={<Myapp />} /> {/* Quiz overview */}
          <Route path="/quiz/:quizId/attempt" element={<QuizApp />} /> {/* Take quiz */}

          {/* Analytics */}
          <Route path="/analytics/:quizId" element={<QuizAnalytics />} />

          {/* Result page - dynamic */}
          <Route path="/result/:quizId/:attemptId" element={<ResultPage />} />
         
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
