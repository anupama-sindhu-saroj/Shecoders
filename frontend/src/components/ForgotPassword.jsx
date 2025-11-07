import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/auth/forgot-password", { email });
      setMsg("Reset link sent to your email");
    } catch (err) {
      console.error(err);
      setMsg("Error sending reset link");
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <p>{msg}</p>
    </div>
  );
};

export default ForgotPassword;
