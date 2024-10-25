import React, { useEffect, useState } from "react";
import calender from "./reshot-icon-calendar-KMX6W4BYZD.svg";
import "./FilterDateSection.css";

const FilterDateSection = ({ onFilterChange }) => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = formatDate(new Date());
    setCurrentDate(date);
  }, []);

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
    onFilterChange(event.target.value);
  };

  return (
    <div className="filter-date-section">
      <div className="filter-section">
        <label htmlFor="filter-select">Filter By:</label>
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
          <span id="current-date">{currentDate}</span>
          <button className="calendar-button">
            <img src={calender} alt="calendar" />
          </button>
          <button className="nav-btn">&lt;</button>
          <button className="nav-btn">&gt;</button>
          <div class="view-selector">
            <button class="view-btn active" id="day-btn">
              Day
            </button>
            <button class="view-btn active" id="week-btn">
              Week
            </button>
            <button class="view-btn active" id="month-btn">
              Month
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDateSection;
