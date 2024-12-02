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
        <h2 id="list-title">Employee Productivity Data</h2>
        <div className="action-buttons">
          <button onClick={downloadExcel}>Download Excel</button>
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={sendEmail}>Send Email</button>
        </div>
      </div>

      <div style={{ overflowY: "auto", maxHeight: "65vh" }}>
        <table
          id="employee-table"
        >
          <thead>
            <tr>
              <th scope="col">Employee ID</th>
              <th scope="col">Date</th>
              <th scope="col">Employee Name</th>
              <th scope="col">Productivity</th>
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

