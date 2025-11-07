import React from "react";
import styles from "./AuthContainer/AuthContainer.module.css";

const CurvePanel = ({ active, toggleActive }) => {
  return (
    <div className={styles.curvePanel}>
      <h2>{active ? "Welcome Back!" : "Hello, Friend!"}</h2>
      <p>
        {active
          ? "Enter your personal details to use all site features."
          : "Register with your personal details to use all site features."}
      </p>
      <button className={styles.curveBtn} onClick={toggleActive}>
        {active ? "SIGN IN" : "SIGN UP"}
      </button>
    </div>
  );
};

export default CurvePanel;
