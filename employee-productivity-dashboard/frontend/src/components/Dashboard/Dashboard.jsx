import React, { useEffect, useState } from "react";
import EmployeeBoxes from "../EmployeeBoxes/EmployeeBoxes";
import Notification from "../Notification/Notification";

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <Notification />
      <EmployeeBoxes />
    </div>
  );
};

export default Dashboard;
