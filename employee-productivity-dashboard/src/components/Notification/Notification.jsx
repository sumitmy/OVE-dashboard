import React, { useState, useEffect } from "react";
import "./Notification.css"; // Import the CSS for styles
// import closeIcon from "./image/notification-bell-svgrepo-com.svg";

// Notification Component
const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <div className="notification-content">
        {message}

      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showNotificationContent, setShowNotificationContent] = useState(false);

  useEffect(() => {
    setNotificationVisible(true);
    setShowNotificationContent(true);

    const timer = setTimeout(() => {
      setNotificationVisible(false);
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

  const handleOutsideClick = (e) => {
    if (showNotificationContent && !e.target.closest(".notification")) {
      setShowNotificationContent(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showNotificationContent]);

  return (
    <div className="container">
      {/* Uncomment this part when you add the EmployeeBoxes component */}
      {/* <EmployeeBoxes /> */}
      {showNotificationContent && (
        <Notification
          message="Welcome to the Dashboard!"
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default Dashboard;
