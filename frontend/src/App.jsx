import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContainer from "./components/AuthContainer/AuthContainer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./pages/Dashboard"; 
import LandingPage from "./pages/LandingPage";
import CreateQuiz from "./pages/CreateQuiz";
import PreviewQuiz from "./pages/PreviewQuiz";
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
          <Route path="/preview" element={<PreviewQuiz />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
