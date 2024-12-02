import React from 'react';
import { useLocation } from 'react-router-dom';
import "./Predict.css"

const Predict = () => {
  const location = useLocation();
  const { predictions } = location.state || {}; 

  const sortedPredictions = predictions
    ? [...predictions].sort((a, b) => b['Resignation Probability'] - a['Resignation Probability'])
    : [];

  return (
    <div className="predict-result" style={{ overflowY: "auto", maxHeight: "80vh" }}>
      <h2>Employee Attrition Prediction</h2>
      <table id="employee-table" style={{ width: "100%", borderCollapse: "collapse",marginTop:"10px" }}>
        <thead>
          <tr>
            <th scope="col">Employee ID</th>
            <th scope="col">Employee Name</th>
            <th scope="col">Resignation Probability (%)</th>
          </tr>
        </thead>
        <tbody id="employee-data">
          {sortedPredictions.map((prediction, index) => (
            <tr key={index}>
              <td>{prediction['Employee ID']}</td>
              <td>{prediction['Employee Name']}</td>
              <td>{prediction['Resignation Probability']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Predict;
