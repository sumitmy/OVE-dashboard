import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calender from "./reshot-icon-calendar-KMX6W4BYZD.svg";
import EmployeeList from "../EmployeeList/EmployeeList";

import "./ProductiveTime.css";

const ProductiveTime = () => {
  const [filter, setFilter] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("day");
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [employees, setEmployees] = useState([]); // Add this state

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

  return (
    <div className="ProductiveTime">
      <div className="filter-date-section">
        <div className="filter-section">
          <label htmlFor="filter-select">Filter:</label>
          <select id="filter-select" onChange={handleFilterChange}>
            <option value="">-- Select Filter --</option>
            <option value="productive_time_300">
              Productive Time &gt; 300 min
            </option>
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

      <EmployeeList filter={filter} setEmployees={setEmployees} />
    </div>
  );
};

export default ProductiveTime;
