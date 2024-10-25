import React from "react";
import "./Notification.css"; // Import the CSS for styles
import closeIcon from "./image/notification-bell-svgrepo-com.svg"; // Path to your SVG file

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <div className="notification-content">
        {message}
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
