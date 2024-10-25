import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import EmployeeList from "../EmployeeList/EmployeeList";
import FilterDateSection from "../FilterDateSection/FilterDateSection";
import ActionButtons from "../ActionButtons/ActionButtons";
import "./ProductiveTime.css";

const ProductiveTime = () => {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <h1>Productive Time</h1>

        {/* Filter Section */}
        <FilterDateSection onFilterChange={handleFilterChange} />

        {/* Action Buttons on the right */}
        <ActionButtons />

        {/* Employee List */}
        <EmployeeList filter={filter} />
      </div>
    </div>
  );
};

export default ProductiveTime;
