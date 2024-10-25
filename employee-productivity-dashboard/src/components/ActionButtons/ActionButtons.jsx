// src/components/ActionButtons/ActionButtons.js
import React from "react";
import "./ActionButtons.css";

const ActionButtons = () => {
  const downloadFile = (type) => {
    // Implement download logic here based on the type (excel or pdf)
    console.log(`Download ${type}`);
  };

  const sendEmail = () => {
    // Implement email sending logic here
    console.log("Send Email");
  };

  return (
    <div className="action-buttons">
      <button onClick={() => downloadFile("excel")}>Download Excel</button>
      <button onClick={() => downloadFile("pdf")}>Download PDF</button>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default ActionButtons;
