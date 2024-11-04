import React from "react";
import FilterDateSection from "../FilterDateSection/FilterDateSection";

import ActionButtons from "../ActionButtons/ActionButtons";
import EmployeeList from "../EmployeeList/EmployeeList";
import "./ProductiveTime.css";

const ProductiveTime = () => {
  return (
    <div className="ProductiveTime">
      {/* <h1>this is Productivetime page </h1> */}
      <FilterDateSection />
      <ActionButtons />
      <EmployeeList />
    </div>
  );
};

export default ProductiveTime;
