// import { useState, useEffect } from "react";
// import "./Notification.css"; 

// // Notification Component
// const Notification = ({ message, onClose }) => {
//   return (
//     <div className="notification">
//       <div className="notification-content">
//         {message}

//       </div>
//     </div>
//   );
// };

// // Dashboard Component
// const Dashboard = () => {
//   const [notificationVisible, setNotificationVisible] = useState(false);
//   const [showNotificationContent, setShowNotificationContent] = useState(false);

//   useEffect(() => {
//     setNotificationVisible(true);
//     setShowNotificationContent(true);

//     const timer = setTimeout(() => {
//       setNotificationVisible(false);
//       setShowNotificationContent(false);
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleShowNotification = () => {
//     setShowNotificationContent(true);
//   };

//   const handleCloseNotification = () => {
//     setShowNotificationContent(false);
//   };

//   const handleOutsideClick = (e) => {
//     if (showNotificationContent && !e.target.closest(".notification")) {
//       setShowNotificationContent(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleOutsideClick);
//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, [showNotificationContent]);

//   return (
//     <div className="container">
      
//       {showNotificationContent && (
//         <Notification
//           message="Welcome to the Dashboard!"
//           onClose={handleCloseNotification}
//         />
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from "react";
import "./Notification.css"; 

// Notification Component
const Notification = ({ message }) => {
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
  const [notificationData, setNotificationData] = useState(null);
  const [showNotificationContent, setShowNotificationContent] = useState(false);

  useEffect(() => {
    // Fetch notification data from backend when the page loads
    const fetchNotifications = async () => {
      try {
        // ###########################################################url of backend ####################################################################
        const response = await fetch("/dashboard"); // Adjust API and params
        const data = await response.json();
        setNotificationData(data);
        setShowNotificationContent(true);

        // Automatically hide notification after 5 seconds
        setTimeout(() => setShowNotificationContent(false), 5000);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="container">
      {showNotificationContent && notificationData && (
        <Notification
          message={`Employees logged in during the last interval: ${notificationData.map(
            (emp) => emp.name
          ).join(", ")}`}
        />
      )}
    </div>
  );
};

export default Dashboard;
