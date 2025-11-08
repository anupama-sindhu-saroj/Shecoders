import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContainer from "./components/AuthContainer/AuthContainer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./pages/Dashboard"; // ✅ Added import
import LandingPage from './pages/LandingPage';
import CreateQuiz from "./pages/CreateQuiz";
import PreviewQuiz from "./pages/PreviewQuiz";
import QuizAnalytics from "./pages/QuizAnalytics";
import ResultPage from "./pages/ResultPage";
import QuizApp from "./components/QuizApp.jsx";
import Myapp from "./Myapp.jsx";
import ResultPage from "./components/ResultPage.jsx";
import "./index.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
         <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthContainer />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />
           <Route path="/create-quiz" element={<CreateQuiz />} />
           
           <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/:quizId" element={<Myapp />} />
          <Route path="/quiz/:quizId/attempt" element={<QuizApp />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/preview" element={<PreviewQuiz />} />
          <Route path="/analytics/:quizId" element={<QuizAnalytics />} />
          <Route path="/result/:quizId/:attemptId" element={<ResultPage />} />
          

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
