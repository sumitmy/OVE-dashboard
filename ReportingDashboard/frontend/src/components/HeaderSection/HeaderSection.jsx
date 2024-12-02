import React, { useEffect, useState } from "react";
import notificationIcon from "./image/notification-bell-svgrepo-com.svg";
import userPic from "./image/userprofile.png";
import "./HeaderSection.css";

const HeaderSection = () => {
  const [showNotificationContent, setShowNotificationContent] = useState(false);

  // Mock user profile data
  const currentUser = {
    name: "Sumit Kumar",
    profilePic: userPic,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotificationContent(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleShowNotification = () => {
    setShowNotificationContent(true);
  };

  const handleCloseNotification = () => {
    setShowNotificationContent(false);
  };

  return (
    <div className="container">
      <div className="Header-section">
        <h1>Employee Productivity Dashboard</h1>
        <div className="user-profile">
          <button
            onClick={handleShowNotification}
            className="notification-btn"
            aria-label="Show Notification"
          >
            <img src={notificationIcon} alt="Notification Icon" />
          </button>
          <span className="user-name">{currentUser.name}</span>
          {currentUser.profilePic && (
            <img
              src={currentUser.profilePic}
              alt={`${currentUser.name}'s Profile`}
              className="profile-pic"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;