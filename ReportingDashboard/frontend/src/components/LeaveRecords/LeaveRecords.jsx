import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import calender from "./reshot-icon-calendar-KMX6W4BYZD.svg";
import { APIService } from "../APIService/APIService";
import ExcludedGroups from "../constants/ExcludedGroups"
import "./LeaveRecords.css";

const LeaveRecords = () => {
  const [filter, setFilter] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Function to generate a random integer between min and max (inclusive)
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const updateDatesForView = () => {
      const newStartDate = new Date();
      const newEndDate = new Date();

      switch (view) {
        case "day":
          setCurrentDate(newStartDate);
          setStartDate(newStartDate);
          setEndDate(newStartDate);
          break;
        case "week":
          newStartDate.setDate(newStartDate.getDate() - 6);
          setStartDate(newStartDate);
          setEndDate(new Date());
          setCurrentDate(newStartDate);
          break;
        case "month":
          newStartDate.setDate(1);
          newStartDate.setMonth(newStartDate.getMonth() - 1);
          newEndDate.setMonth(newStartDate.getMonth() + 1);
          newEndDate.setDate(0);
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setCurrentDate(newStartDate);
          break;
        default:
          break;
      }
    };

    updateDatesForView();
  }, [view]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await APIService();
        const transformedEmployees = [];
        // unwanted group data
        

        Object.keys(data).forEach((date) => {
          const employeesData = data[date];
          Object.keys(employeesData).forEach((empId) => {
            const empInfo = employeesData[empId];

            // Generate dummy data for leave records (random value between 1 and 5) and reason if not available
            const leaveRecords = empInfo.leaveRecords || getRandomInt(1, 5);
            const reason = empInfo.reason || "No reason provided";
            if (!ExcludedGroups.includes(empInfo.group)) {
              transformedEmployees.push({
                id: empInfo.id,
                date,
                name: empInfo.name,
                leaveRecords,
                reason,
              });
            }
          });
        });

        setEmployees(transformedEmployees);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const headers = [
    ["Employee ID", "Date", "Employee Name", "Leave Records", "Reason"],
  ];

  const downloadExcel = () => {
    const worksheetData = employees.length ? employees : [];
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Leave_Records.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Leave Records", 20, 10);
    doc.autoTable({
      head: headers,
      body: employees.map((emp) => [
        emp.id,
        emp.date,
        emp.name,
        emp.leaveRecords,
        emp.reason,
      ]),
    });
    doc.save("Employee_Leave_Records.pdf");
  };

  const sendEmail = () => {
    const mailtoLink = `mailto:?subject=Employee Leave Records&body=Please find attached the Employee Leave Records.`;
    window.location.href = mailtoLink;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="TimeAtWork">
      <div className="filter-date-section">
        <div className="filter-section">
          <label htmlFor="filter-select">Filter:</label>
          <select id="filter-select" onChange={handleFilterChange}>
            <option value="">-- Select Filter --</option>
            <option value="leave_records">Leave Records</option>
          </select>
        </div>
        <div className="date-control">
          <div className="date-display">
            <span id="current-date">
              {view === "week" || view === "month"
                ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                : formatDate(currentDate)}
            </span>
            <DatePicker
              selected={currentDate}
              onChange={(date) => {
                if (date <= today) {
                  setCurrentDate(date);
                }
              }}
              maxDate={today}
              customInput={
                <button className="calendar-button">
                  <img src={calender} alt="calendar" />
                </button>
              }
            />
            <button className="nav-btn" onClick={handlePreviousDay}>
              &lt;
            </button>
            <button
              className="nav-btn"
              onClick={handleNextDay}
              disabled={currentDate >= today}
            >
              &gt;
            </button>
            <div className="view-selector">
              <button
                className={`view-btn ${view === "day" ? "active" : ""}`}
                id="day-btn"
                onClick={() => setView("day")}
              >
                Day
              </button>
              <button
                className={`view-btn ${view === "week" ? "active" : ""}`}
                id="week-btn"
                onClick={() => setView("week")}
              >
                Week
              </button>
              <button
                className={`view-btn ${view === "month" ? "active" : ""}`}
                id="month-btn"
                onClick={() => setView("month")}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="employee-list">
        <div className="heading-download-btn">
          <h2 id="list-title">Employee Leave Records</h2>
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
                <th scope="col">Leave Records</th>
                <th scope="col">Reason</th>
              </tr>
            </thead>
            <tbody id="employee-data">
              {employees.map((emp) => (
                <tr key={`${emp.id}-${emp.date}`}>
                  <td>{emp.id}</td>
                  <td>{emp.date}</td>
                  <td>{emp.name}</td>
                  <td>{emp.leaveRecords}</td>
                  <td>{emp.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRecords;