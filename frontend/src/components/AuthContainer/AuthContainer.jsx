import React, { useState } from "react";
import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";
import CurvePanel from "../CurvePanel";
import styles from "./AuthContainer.module.css";

const AuthContainer = () => {
  const [active, setActive] = useState(false);

  const toggleActive = () => setActive(!active);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // FULL viewport height
        width: "100%",
        position: "relative", // ensures inner container positions properly
      }}
    >
    <div className={`${styles.container} ${active ? styles.active : ""}`}>
      <SignInForm />
      <SignUpForm />
      <CurvePanel active={active} toggleActive={toggleActive} />
    </div>
    </div>
  );
};

export default AuthContainer;
