import React from "react";
import { useNavigate } from "react-router-dom";
import "./PredictionBox.css";

const PredictionBox = () => {
  const navigate = useNavigate();

  const openPage = (id) => {
    switch (id) {
      case "add-employee":
        navigate("/prediction/add-employee");
        break;
      case "performance":
        navigate("/prediction/performance");
        break;
      default:
        break;
    }
  };

  return (
    <div className="prediction-boxes">
      <div className="box" id="add-employee">
        <h3>Add Employee</h3>
        <button onClick={() => openPage("add-employee")}>View Details</button>
      </div>
      <div className="box" id="performance">
        <h3>Prediction</h3>
        <button onClick={() => openPage("performance")}>View Details</button>
      </div>
    </div>
  );
};

export default PredictionBox;
