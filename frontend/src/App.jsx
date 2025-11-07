import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContainer from "./components/AuthContainer/AuthContainer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./pages/Dashboard"; // ✅ Added import
import "./index.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
          {/* Main login/signup page */}
          <Route path="/" element={<AuthContainer />} />

          {/* Forgot password page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Reset password page */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ✅ New Dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
