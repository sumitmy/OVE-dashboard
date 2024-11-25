import React, { useState } from "react";
import axios from "axios";
import HeatmapDisplay from "./HeatmapDisplay";

const HeatmapContainer = () => {
  const [index, setIndex] = useState(0); // For batch display
  const [employeeData, setEmployeeData] = useState({
    jobSatisfaction: 3,
    benchmarkSalary: 0,
    performanceRating: 3,
  });
  const [prediction, setPrediction] = useState(null);

  const handleNext = () => setIndex((prev) => prev + 20);
  const handlePrevious = () =>
    setIndex((prev) => (prev - 20 >= 0 ? prev - 20 : 0));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({ ...prevData, [name]: Number(value) }));
  };

  const getPrediction = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        employeeData
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Error getting prediction:", error);
    }
  };

  return (
    <div>
      <h1>Employee Resignation Dashboard</h1>
      <div>
        <h2>Prediction</h2>
        <input
          name="jobSatisfaction"
          type="number"
          min="1"
          max="5"
          value={employeeData.jobSatisfaction}
          onChange={handleInputChange}
          placeholder="Job Satisfaction (1-5)"
        />
        <input
          name="benchmarkSalary"
          type="number"
          value={employeeData.benchmarkSalary}
          onChange={handleInputChange}
          placeholder="Benchmark Salary (%)"
        />
        <input
          name="performanceRating"
          type="number"
          min="1"
          max="5"
          value={employeeData.performanceRating}
          onChange={handleInputChange}
          placeholder="Performance Rating (1-5)"
        />
        <button onClick={getPrediction}>Get Prediction</button>
        {prediction && (
          <div>
            <p>
              Resignation Risk: {prediction.resignation_risk ? "High" : "Low"}
            </p>
            <p>Probability: {(prediction.probability * 100).toFixed(2)}%</p>
          </div>
        )}
      </div>
      <div>
        <HeatmapDisplay index={index} />
        <button onClick={handlePrevious} disabled={index === 0}>
          Previous
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default HeatmapContainer;
