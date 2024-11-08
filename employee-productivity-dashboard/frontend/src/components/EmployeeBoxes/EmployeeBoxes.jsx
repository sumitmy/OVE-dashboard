// src/components/EmployeeBoxes.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeBoxes.css";

const EmployeeBoxes = () => {
  const navigate = useNavigate(); 

  const openPage = (id) => {
    switch (id) {
      case "productive-time":
        navigate("/dashboard/productive-time"); 
        break;
      case "total":
        navigate("/dashboard/total-time");
        break;
      case "productivity":
        navigate("/dashboard/productivity");
        break;
      case "non-productivity":
        navigate("/dashboard/non-productivity");
        break;
      case "leave-records":
        navigate("/dashboard/leave-records");
        break;
      case "logInlogOut":
        navigate("/dashboard/logInlogOut");
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-boxes">
      <div className="box" id="productive-time">
        <h3>Productive Time</h3>
        <button onClick={() => openPage("productive-time")}>
          View Details
        </button>
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
      <div className="box" id="total-time">
        <h3>Total Time at Work</h3>
        <button onClick={() => openPage("total")}>View Details</button>
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
