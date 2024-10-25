import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import EmployeeBoxes from "../EmployeeBoxes";
import Notification from "../Notification/Notification";
import notificationIcon from "./image/notification-bell-svgrepo-com.svg";
import "./Dashboard.css";

const Dashboard = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [showNotificationContent, setShowNotificationContent] = useState(false);

  useEffect(() => {
    // Show notification when the component mounts
    setNotificationVisible(true);
    setShowNotificationContent(true); // Show notification content immediately

    const timer = setTimeout(() => {
      setNotificationVisible(false); // Automatically hide after 5 seconds
      setShowNotificationContent(false); // Hide the notification content
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const handleShowNotification = () => {
    setShowNotificationContent(true); // Show notification content
  };

  const handleCloseNotification = () => {
    setShowNotificationContent(false); // Close notification content
  };

  const handleOutsideClick = (e) => {
    // Check if clicked outside the notification content
    if (showNotificationContent && !e.target.closest(".notification")) {
      setShowNotificationContent(false); // Close notification if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick); // Add event listener for outside clicks

    return () => {
      document.removeEventListener("click", handleOutsideClick); // Cleanup on unmount
    };
  }, [showNotificationContent]);

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <h1>Employee Productivity Dashboard</h1>
        {/* Removed <FilterDateSection /> */}
        <EmployeeBoxes />

        {showNotificationContent && (
          <Notification
            message="Welcome to the Dashboard!"
            onClose={handleCloseNotification} // Pass the close handler
          />
        )}

        <button
          onClick={handleShowNotification}
          className="notification-btn"
          aria-label="Show Notification"
        >
          <img src={notificationIcon} alt="Notification Icon" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
