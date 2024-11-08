// // src/components/ActionButtons/ActionButtons.js
// import React from "react";
// import "./ActionButtons.css";

// const ActionButtons = () => {
//   const downloadFile = (type) => {
//     // Implement download logic here based on the type (excel or pdf)
//     console.log(`Download ${type}`);
//   };

//   const sendEmail = () => {
//     // Implement email sending logic here
//     console.log("Send Email");
//   };

//   return (
//     <div className="action-button-container">
//       <div className="action-buttons">
//         <button onClick={() => downloadFile("excel")}>Download Excel</button>
//         <button onClick={() => downloadFile("pdf")}>Download PDF</button>
//         <button onClick={sendEmail}>Send Email</button>
//       </div>
//     </div>
//   );
// };

// export default ActionButtons;
// ActionButtons.js
//////////////////////////////////////////////////////////////////////////////////////

// import React from "react";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "./ActionButtons.css";

// const ActionButtons = ({ employees }) => {
//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(employees);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
//     XLSX.writeFile(workbook, "Employee_Productivity_Data.xlsx");
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Employee Productivity Data", 20, 10);
//     doc.autoTable({
//       head: [["Employee ID", "Date", "Employee Name", "Productive Time"]],
//       body: employees.map((emp) => [
//         emp.id,
//         emp.date,
//         emp.name,
//         emp.productiveTime,
//       ]),
//     });
//     doc.save("Employee_Productivity_Data.pdf");
//   };

//   const sendEmail = () => {
//     const mailtoLink = `mailto:?subject=Employee Productivity Data&body=Please find attached the Employee Productivity Data.`;
//     window.location.href = mailtoLink;
//   };

//   return (
//     <div className="action-buttons">
//       <button onClick={downloadExcel}>Download Excel</button>
//       <button onClick={downloadPDF}>Download PDF</button>
//       <button onClick={sendEmail}>Send Email</button>
//     </div>
//   );
// };

// export default ActionButtons;

import React from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./ActionButtons.css";

const ActionButtons = ({ employees }) => {
  // Define table headers for structure
  const headers = [["Employee ID", "Date", "Employee Name", "Productive Time"]];

  const downloadExcel = () => {
    // Check if employees has data or is empty
    const worksheetData = employees.length ? employees : [];
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" }); // Add headers
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Productivity_Data.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Productivity Data", 20, 10);
    doc.autoTable({
      head: headers,
      body: employees.map((emp) => [
        emp.id,
        emp.date,
        emp.name,
        emp.productiveTime,
      ]),
    });
    doc.save("Employee_Productivity_Data.pdf");
  };

  const sendEmail = () => {
    const mailtoLink = `mailto:?subject=Employee Productivity Data&body=Please find attached the Employee Productivity Data.`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="action-buttons">
      <button onClick={downloadExcel}>Download Excel</button>
      <button onClick={downloadPDF}>Download PDF</button>
      <button onClick={sendEmail}>Send Email</button>
    </div>
  );
};

export default ActionButtons;
