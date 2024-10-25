// src/components/EmployeeBoxes.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const EmployeeBoxes = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const openPage = (id) => {
    switch (id) {
      case "productive":
        navigate("/productive-time"); // Use path for routing
        break;
      case "total":
        navigate("/total-time");
        break;
      case "productivity":
        navigate("/productivity");
        break;
      case "non-productivity":
        navigate("/non-productivity");
        break;
      case "leave-records":
        navigate("/leave-records");
        break;
      case "logInlogOut":
        navigate("/logInlogOut");
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-boxes">
      <div className="box" id="productive-time">
        <h3>Productive Time</h3>
        <button onClick={() => openPage("productive")}>View Details</button>
      </div>
      <div className="box" id="total-time">
        <h3>Total Time at Work</h3>
        <button onClick={() => openPage("total")}>View Details</button>
      </div>
      <div className="box" id="productivity">
        <h3>Productivity</h3>
        <button onClick={() => openPage("productivity")}>View Details</button>
      </div>
      <div className="box" id="non-productivity">
        <h3>Non-Productivity</h3>
        <button onClick={() => openPage("non-productivity")}>
          View Details
        </button>
      </div>
      <div className="box" id="leave-records">
        <h3>Leave Records</h3>
        <button onClick={() => openPage("leave-records")}>View Details</button>
      </div>
      <div className="box" id="logInlogOut">
        <h3>Log In/Log Out</h3>
        <button onClick={() => openPage("logInlogOut")}>View Details</button>
      </div>
    </div>
  );
};

export default EmployeeBoxes;
