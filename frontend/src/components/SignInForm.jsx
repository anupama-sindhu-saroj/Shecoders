import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./AuthContainer/AuthContainer.module.css";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      // ✅ Ensure token received
      if (!res.data.token) {
        setError("Login failed: No token received from server");
        return;
      }

      // ✅ Save token in localStorage
      localStorage.setItem("token", res.data.token);
      console.log("✅ Login success:", res.data);

      alert("✅ Login successful! Redirecting to dashboard...");
      return navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  // ✅ Handle Google login
  const handleGoogleLogin = () => {
    window.open("http://localhost:5001/api/auth/google", "_self");
  };

  return (
    <div className={styles.formBox}>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <input
          className={styles.inputField}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className={styles.inputField}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className={styles.errorMsg}>{error}</p>}

        <button type="submit" className={styles.btn}>
          Sign In
        </button>
      </form>

      {/* Forgot Password */}
      <div className={styles.formFooter}>
        <Link to="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot your password?
        </Link>
      </div>

      <div className={styles.divider}>OR</div>

      {/* Google Sign-In Button */}
      <button onClick={handleGoogleLogin} className={styles.googleBtn}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          className={styles.googleIcon}
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default SignInForm;
