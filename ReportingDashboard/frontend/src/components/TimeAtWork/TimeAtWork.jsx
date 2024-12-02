import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import calender from "./reshot-icon-calendar-KMX6W4BYZD.svg";
import { APIService } from "../APIService/APIService";
import ExcludedGroups from "../constants/ExcludedGroups";
import "./TimeAtWork.css";


const TimeAtWork = () => {
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
  
        Object.keys(data).forEach((date) => {
          const employeesData = data[date];
          Object.keys(employeesData).forEach((empId) => {
            const empInfo = employeesData[empId];
  
            const atWorkTime = empInfo.atWorkTime || 0; // Productive time in seconds
            const workStarts = empInfo.work_starts; // e.g., "10:00:00"
            const workEnds = empInfo.work_ends; // e.g., "19:00:00"
            
            const formatTime = (seconds) =>
              new Date(seconds * 1000).toISOString().substr(11, 8);
  
            // Parse work_starts into today's date
            const [startHours, startMinutes, startSeconds] = workStarts
              .split(":")
              .map(Number);
  
            const workStartTime = new Date();
            workStartTime.setHours(startHours, startMinutes, startSeconds, 0); // Set to today's date with work start time
  
            // Current time for comparison
            const currentTime = new Date();
  
            // Calculate how much time has passed since the shift started
            const timePassedMillis = currentTime - workStartTime; // Time in milliseconds
            const timePassedSeconds = Math.floor(timePassedMillis / 1000); // Convert to seconds
            const timePassedMinutes = Math.floor(timePassedSeconds / 60); // Convert to minutes
            const timePassedHours = Math.floor(timePassedMinutes / 60); // Convert to hours
  
            // Only include employees whose work_starts time has passed
            if (currentTime >= workStartTime) {
              if (!ExcludedGroups.includes(empInfo.group)) {
                transformedEmployees.push({
                  id: empInfo.id,
                  date,
                  name: empInfo.name,
                  workStarts,
                  workEnds,
                  atWorkTime: formatTime(atWorkTime),
                  atWorkTimeMinutes: Math.floor(atWorkTime / 60),
                  timePassedHours,
                  timePassedMinutes,
                  timePassedSeconds,
                  workStartTime // Add work start time to help with sorting
                });
              }
            }
          });
        });  
        // Sort employees: First by atWorkTimeMinutes (ascending), then by workStartTime (ascending)
        transformedEmployees.sort((a, b) => {
          if (a.atWorkTimeMinutes === b.atWorkTimeMinutes) {
            // If time worked is equal, sort by shift start time
            return a.workStartTime - b.workStartTime;
          }
          // Otherwise, sort by atWorkTimeMinutes (ascending)
          return a.atWorkTimeMinutes - b.atWorkTimeMinutes;
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
  
  
  
  const filteredEmployees = employees
    .filter((employee) => {
      if (filter === "work_time_300") {
        return employee.atWorkTimeMinutes > 300;
      }
      return true;
    })
    .sort((a, b) => a.atWorkTimeMinutes - b.atWorkTimeMinutes);

  const headers = [["Employee ID", "Date", "Employee Name", "At Work Time"]];

  const downloadExcel = () => {
    const worksheetData = filteredEmployees.length ? filteredEmployees : [];
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Time_At_Work_Data.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Time at Work Data", 20, 10);
    doc.autoTable({
      head: headers,
      body: filteredEmployees.map((emp) => [
        emp.id,
        emp.date,
        emp.name,
        emp.atWorkTime,
      ]),
    });
    doc.save("Employee_Time_At_Work_Data.pdf");
  };

  const sendEmail = () => {
    const mailtoLink = `mailto:?subject=Employee Time at Work Data&body=Please find attached the Employee Time at Work Data.`;
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
            <option value="work_time_300">Time at Work &gt; 300 min</option>
            <option value="total_time_400">Total Time &gt; 400 min</option>
            <option value="productivity_80">Productivity &gt; 80%</option>
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
          <h2 id="list-title">Employee Availability Data</h2>
          <div className="action-buttons">
            <button onClick={downloadExcel}>Download Excel</button>
            <button onClick={downloadPDF}>Download PDF</button>
            <button onClick={sendEmail}>Send Email</button>
          </div>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "500px" }}>
          <table id="employee-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th scope="col">Employee ID</th>
                <th scope="col">Date</th>
                <th scope="col">Employee Name</th>
                <th scope="col">Total Time At Work</th>
              </tr>
            </thead>
            <tbody id="employee-data">
              {filteredEmployees.map((emp) => {
                let timeAtWorkStyle = {};
                
                if (emp.atWorkTimeMinutes < 180) {
                  timeAtWorkStyle.backgroundColor = "#f59190";
                } else if (emp.atWorkTimeMinutes < 360) {
                  timeAtWorkStyle.backgroundColor = "#f9a851";
                } else {
                  timeAtWorkStyle.backgroundColor = "#71e37a";
                }
                return (
                  <tr key={`${emp.id}-${emp.date}`}>
                    <td>{emp.id}</td>
                    <td>{emp.date}</td>
                    <td>{emp.name}</td>
                    <td style={timeAtWorkStyle}>{emp.atWorkTime}</td>
                   
                  </tr>
                );
                
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeAtWork;
