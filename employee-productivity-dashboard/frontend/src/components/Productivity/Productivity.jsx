import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import calender from "./reshot-icon-calendar-KMX6W4BYZD.svg";
import { APIService } from "../APIService/APIService";
import ExcludedGroups from "../constants/ExcludedGroups";
import "./Productivity.css";

const Productivity = () => {
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

            
            if (!ExcludedGroups.includes(empInfo.group)) {
              transformedEmployees.push({
                id: empInfo.id,
                date,
                name: empInfo.name,
                efficiency: empInfo.efficiency
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

  const filteredEmployees = employees.filter((employee) => {
    if (filter === "productive_time_300") {
      return parseFloat(employee.productivity) > 300;
    }
    return true;
  });

  const headers = [["Employee ID", "Date", "Employee Name", "Productivity"]];

  const downloadExcel = () => {
    const worksheetData = filteredEmployees.length ? filteredEmployees : [];
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "A1" });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_Productivity_Data.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Productivity Data", 20, 10);
    doc.autoTable({
      head: headers,
      body: filteredEmployees.map((emp) => [
        emp.id,
        emp.date,
        emp.name,
        emp.efficiency,
      ]),
    });
    doc.save("Employee_Productivity_Data.pdf");
  };

  const sendEmail = () => {
    const mailtoLink = `mailto:?subject=Employee Productivity Data&body=Please find attached the Employee Productivity Data.`;
    window.location.href = mailtoLink;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ProductiveTime">
      <div className="filter-date-section">
        <div className="filter-section">
          <label htmlFor="filter-select">Filter:</label>
          <select id="filter-select" onChange={handleFilterChange}>
            <option value="">-- Select Filter --</option>
            <option value="productive_time_300">
              Productivity Time &gt; 300 min
            </option>
            <option value="total_time_400">Total Time &gt; 400 min</option>
            <option value="efficiency_80">Efficiency &gt; 80%</option>
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
          <h2 id="list-title">Employee Productivity Data</h2>
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
                <th scope="col">Productivity</th>
              </tr>
            </thead>
            <tbody id="employee-data">
              {filteredEmployees
                .sort((a, b) => a.efficiency - b.efficiency)
                .map((emp) => {
                  let efficiencyStyle = {};

                  if (emp.efficiency < 40) {
                    efficiencyStyle.backgroundColor = "#f59190";
                  } else if (emp.efficiency < 60) {
                    efficiencyStyle.backgroundColor = "#f9a851";
                  } else {
                    efficiencyStyle.backgroundColor = "#71e37a";
                  }

                  return (
                    <tr key={`${emp.id}-${emp.date}`}>
                      <td>{emp.id}</td>
                      <td>{emp.date}</td>
                      <td>{emp.name}</td>
                      <td style={efficiencyStyle}>{emp.efficiency}%</td>
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

export default Productivity;
