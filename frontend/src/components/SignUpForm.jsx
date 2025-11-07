import React, { useState } from "react";
import styles from "./AuthContainer/AuthContainer.module.css";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  const sendOTP = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsOTPSent(true);
        setMessage("✅ OTP sent to your email!");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("Server error. Try again.");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsVerified(true);
        setMessage("✅ Email verified! You can now set your password.");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("Server error. Try again.");
    }
  };

  const registerUser = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 Registration successful! You can sign in now.");
        setIsVerified(false);
        setIsOTPSent(false);
        setEmail("");
        setName("");
        setPassword("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className={`${styles.formBox} ${styles.signupBox}`}>
      <h2>Create Account</h2>

      {!isOTPSent ? (
        <>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.btn} onClick={sendOTP}>
            Send OTP
          </button>
        </>
      ) : !isVerified ? (
        <>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className={styles.btn} onClick={verifyOTP}>
            Verify OTP
          </button>
        </>
      ) : (
        <>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Set a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.btn} onClick={registerUser}>
            Complete Registration
          </button>
        </>
      )}

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default SignUpForm;
