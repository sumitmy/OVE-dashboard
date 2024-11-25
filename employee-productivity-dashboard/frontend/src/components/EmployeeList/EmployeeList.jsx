import React, { useEffect, useState } from "react";
import { APIService } from "../APIService/APIService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ExcludedGroups from "../constants/ExcludedGroups";
import "./EmployeeList.css";

const EmployeeListWithActions = ({ filter }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch employee data from APIService
    const fetchEmployees = async () => {
      try {
        const data = await APIService();
        const transformedEmployees = [];
        
        // Transform and format employee data
        Object.keys(data).forEach((date) => {
          const employeesData = data[date];
          Object.keys(employeesData).forEach((empId) => {
            const empInfo = employeesData[empId];
            const productiveTimeSeconds = empInfo.productiveTime || 0;
            const productiveTimeFormatted = new Date(
              productiveTimeSeconds * 1000
            )
              .toISOString()
              .substr(11, 8);
            if (!ExcludedGroups.includes(empInfo.group)) {
              transformedEmployees.push({
                id: empInfo.id,
                date,
                name: empInfo.name,
                productiveTime: productiveTimeFormatted,
                productiveTimeMinutes: Math.floor(productiveTimeSeconds / 60),
              });
            }
          });
        });

        setEmployees(transformedEmployees); // Set employees data in state
      } catch (err) {
        setError("Error fetching data"); // Set error if fetch fails
      } finally {
        setLoading(false); // Stop loading once fetch completes
      }
    };

    fetchEmployees();
  }, []);

  // Loading and error state handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter employees based on filter prop
  const filteredEmployees = employees.filter((employee) => {
    if (filter === "productive_time_300") {
      return employee.productiveTimeMinutes > 300;
    }
    return true;
  });

  // Define table headers for structure
  const headers = [["Employee ID", "Date", "Employee Name", "Productive Time"]];

  // Handle Excel download
  const downloadExcel = () => {
    // Check if employees has data or is empty
    const worksheetData = filteredEmployees.length ? filteredEmployees : [];
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" }); // Add headers
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Productivity_Data.xlsx");
  };

  // Handle PDF download
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Productivity Data", 20, 10);
    doc.autoTable({
      head: headers,
      body: filteredEmployees.map((emp) => [
        emp.id,
        emp.date,
        emp.name,
        emp.productiveTime,
      ]),
    });
    doc.save("Employee_Productivity_Data.pdf");
  };

  // Handle email sending (will only open default mail client)
  const sendEmail = () => {
    const mailtoLink = `mailto:?subject=Employee Productivity Data&body=Please find attached the Employee Productivity Data.`;
    window.location.href = mailtoLink;
  };

  return (
    <div id="employee-list">
      <div className="heading-download-btn">
        <h2 id="list-title">Employee Productive Time Data</h2>
        {/* Action Buttons Section */}
        <div className="action-buttons">
          <button onClick={downloadExcel}>Download Excel</button>
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={sendEmail}>Send Email</button>
        </div>
      </div>

      <div style={{ overflowY: "auto", maxHeight: "500px" }}>
        <table
          id="employee-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th scope="col">Employee ID</th>
              <th scope="col">Date</th>
              <th scope="col">Employee Name</th>
              <th scope="col">Productive Time</th>
            </tr>
          </thead>
          <tbody id="employee-data">
              {filteredEmployees.sort((a, b) => a.productiveTimeMinutes - b.productiveTimeMinutes).map((emp) => {
                let productiveTimeStyle = {};

                if (emp.productiveTimeMinutes < 180) {
                  productiveTimeStyle.backgroundColor = "#f59190";
                } else if (emp.productiveTimeMinutes < 360) {
                  productiveTimeStyle.backgroundColor = "#f9a851";
                } else {
                  productiveTimeStyle.backgroundColor = "#71e37a";
                }
                return (
                  <tr key={`${emp.id}-${emp.date}`}>
                    <td>{emp.id}</td>
                    <td>{emp.date}</td>
                    <td>{emp.name}</td>
                    <td style={productiveTimeStyle}>
                      {emp.productiveTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>

        </table>
      </div>
    </div>
  );
};

export default EmployeeListWithActions;




// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "./EmployeeList.css";

// const EmployeeListWithActions = ({ filter }) => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Function to fetch employee data from the Flask backend API
//     const fetchEmployees = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/dashboard/productive-time");
//         const data = await response.json();
//         if (response.ok) {
//           // Transform employee data
//           const transformedEmployees = data.map((emp) => {
//             const productiveTimeFormatted = new Date(emp.productiveTimeMinutes * 1000)
//               .toISOString()
//               .substr(11, 8);
//             return {
//               id: emp.id,
//               date: emp.date,
//               name: emp.name,
//               productiveTime: productiveTimeFormatted,
//               productiveTimeMinutes: emp.productiveTimeMinutes,
//             };
//           });

//           setEmployees(transformedEmployees); // Set the fetched employee data in state
//         } else {
//           throw new Error("Error fetching data from server");
//         }
//       } catch (err) {
//         setError("Error fetching data from server"); // Handle any error that occurs
//       } finally {
//         setLoading(false); // Stop the loading indicator once the fetch is complete
//       }
//     };

//     fetchEmployees();
//   }, []);

//   // Loading and error state handling
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   // Filter employees based on filter prop
//   const filteredEmployees = employees.filter((employee) => {
//     if (filter === "productive_time_300") {
//       return employee.productiveTimeMinutes > 300;
//     }
//     return true;
//   });

//   // Define table headers for structure
//   const headers = [["Employee ID", "Date", "Employee Name", "Productive Time"]];

//   // Handle Excel download
//   const downloadExcel = () => {
//     // Check if employees has data or is empty
//     const worksheetData = filteredEmployees.length ? filteredEmployees : [];
//     const worksheet = XLSX.utils.json_to_sheet(worksheetData);
//     XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" }); // Add headers
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
//     XLSX.writeFile(workbook, "Employee_Productivity_Data.xlsx");
//   };

//   // Handle PDF download
//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Employee Productivity Data", 20, 10);
//     doc.autoTable({
//       head: headers,
//       body: filteredEmployees.map((emp) => [
//         emp.id,
//         emp.date,
//         emp.name,
//         emp.productiveTime,
//       ]),
//     });
//     doc.save("Employee_Productivity_Data.pdf");
//   };

//   // Handle email sending (will only open default mail client)
//   const sendEmail = () => {
//     const mailtoLink = `mailto:?subject=Employee Productivity Data&body=Please find attached the Employee Productivity Data.`;
//     window.location.href = mailtoLink;
//   };

//   return (
//     <div id="employee-list">
//       <div className="heading-download-btn">
//         <h2 id="list-title">Employee Productive Time Data</h2>
//         {/* Action Buttons Section */}
//         <div className="action-buttons">
//           <button onClick={downloadExcel}>Download Excel</button>
//           <button onClick={downloadPDF}>Download PDF</button>
//           <button onClick={sendEmail}>Send Email</button>
//         </div>
//       </div>

//       <div style={{ overflowY: "auto", maxHeight: "500px" }}>
//         <table
//           id="employee-table"
//           style={{ width: "100%", borderCollapse: "collapse" }}
//         >
//           <thead>
//             <tr>
//               <th scope="col">Employee ID</th>
//               <th scope="col">Date</th>
//               <th scope="col">Employee Name</th>
//               <th scope="col">Productive Time</th>
//             </tr>
//           </thead>
//           <tbody id="employee-data">
//             {filteredEmployees
//               .sort((a, b) => a.productiveTimeMinutes - b.productiveTimeMinutes)
//               .map((emp) => {
//                 let productiveTimeStyle = {};

//                 if (emp.productiveTimeMinutes < 180) {
//                   productiveTimeStyle.backgroundColor = "#f59190";
//                 } else if (emp.productiveTimeMinutes < 360) {
//                   productiveTimeStyle.backgroundColor = "#f9a851";
//                 } else {
//                   productiveTimeStyle.backgroundColor = "#71e37a";
//                 }

//                 return (
//                   <tr key={`${emp.id}-${emp.date}`}>
//                     <td>{emp.id}</td>
//                     <td>{emp.date}</td>
//                     <td>{emp.name}</td>
//                     <td style={productiveTimeStyle}>{emp.productiveTime}</td>
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeListWithActions;

