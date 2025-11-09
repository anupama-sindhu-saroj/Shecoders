import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";

const Profile = () => {
  const [profilePicture, setProfilePicture] = useState("");
  const [user, setUser] = useState({ name: "", username: "" });

  const token = localStorage.getItem("token");

  // ✅ Fetch user details using token
  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5001/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser({
          name: res.data.name,
          username: "@" + res.data.username,
        });
      })
      .catch(() => {
        console.log("User not authenticated");
      });

    // ✅ Load profile picture
    const savedPic = localStorage.getItem("profilePicture");
    if (savedPic) setProfilePicture(savedPic);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profilePicture");
    window.location.href = "/login";
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (img) => {
      setProfilePicture(img.target.result);
      localStorage.setItem("profilePicture", img.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">
      <div className="top-bar">
        <button className="action-button back-button" onClick={() => window.history.back()}>
          <span className="back-icon">&larr;</span> Back
        </button>

        <button className="action-button logout-button" onClick={handleLogout}>
          Logout <span className="back-icon">&#x274C;</span>
        </button>
      </div>

      <div className="profile-container">
        <div className="left-section">
          <div className="profile-photo-area">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-image" />
            ) : (
              <span className="camera-icon">&#128247;</span>
            )}
          </div>

          <p className="upload-text">UPDATE PROFILE PHOTO</p>

          <input
            type="file"
            id="photo-file-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoUpload}
          />

          <button
            className="button choose-file-btn"
            onClick={() => document.getElementById("photo-file-input").click()}
          >
            Choose Photo File
          </button>

          <p className="proctoring-note">For proctoring: Clear, front-facing headshot</p>
        </div>

        <div className="right-section">
          <h1 className="greeting">
            Hello,
            <strong>{user.name || "Loading..."}</strong>
          </h1>

          <div className="username-display">{user.username}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
