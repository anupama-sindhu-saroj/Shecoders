import React, { useState } from "react";
import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";
import CurvePanel from "../CurvePanel";
import styles from "./AuthContainer.module.css";

const AuthContainer = () => {
  const [active, setActive] = useState(false);

  const toggleActive = () => setActive(!active);

  return (
    <div className={`${styles.container} ${active ? styles.active : ""}`}>
      <SignInForm />
      <SignUpForm />
      <CurvePanel active={active} toggleActive={toggleActive} />
    </div>
  );
};

export default AuthContainer;
