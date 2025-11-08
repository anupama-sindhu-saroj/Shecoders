import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthContainer from "./components/AuthContainer/AuthContainer";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
<<<<<<< HEAD
import Dashboard from "./pages/Dashboard"; 
=======
import LandingPage from './pages/LandingPage'
>>>>>>> c854624 (landing page)
import "./index.css";

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <Routes>
<<<<<<< HEAD

          <Route path="/" element={<AuthContainer />} />

 
=======
          <Route path="/" element={<LandingPage />} />

          <Route path="/auth" element={<AuthContainer />} />

>>>>>>> c854624 (landing page)
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
