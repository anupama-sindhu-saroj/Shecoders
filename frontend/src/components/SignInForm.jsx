import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./AuthContainer/AuthContainer.module.css";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

     const { token, user } = res.data;

    if (!token || !user) {
      setError("Login failed: No token or user data received from server");
      return;
    }

    // Clear any old data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Store new token and user info
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("✅ Login success:", user);

    alert("✅ Login successful! Redirecting to dashboard...");
    navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };


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

      <div className={styles.formFooter}>
        <Link to="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot your password?
        </Link>
      </div>

      <div className={styles.divider}>OR</div>

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
