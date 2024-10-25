import React, { useState } from "react";
import "./EmployeeList.css";

const EmployeeList = ({ filter }) => {
  const [employees, setEmployees] = useState([
    {
      name: "Rajesh Sharma",
      productiveTime: "320 min",
      totalTime: "420 min",
      productivity: "85%",
    },
    {
      name: "Priya Mehta",
      productiveTime: "280 min",
      totalTime: "400 min",
      productivity: "75%",
    },
    {
      name: "Amit Joshi",
      productiveTime: "350 min",
      totalTime: "450 min",
      productivity: "90%",
    },
    {
      name: "Neha Singh",
      productiveTime: "220 min",
      totalTime: "380 min",
      productivity: "58%",
    },
    {
      name: "Ravi Kumar",
      productiveTime: "400 min",
      totalTime: "500 min",
      productivity: "80%",
    },
    {
      name: "Sneha Patil",
      productiveTime: "310 min",
      totalTime: "420 min",
      productivity: "74%",
    },
    {
      name: "Vikram Desai",
      productiveTime: "290 min",
      totalTime: "390 min",
      productivity: "74%",
    },
    {
      name: "Pooja Reddy",
      productiveTime: "360 min",
      totalTime: "460 min",
      productivity: "78%",
    },
    {
      name: "Arjun Gupta",
      productiveTime: "370 min",
      totalTime: "470 min",
      productivity: "79%",
    },
    {
      name: "Meera Nair",
      productiveTime: "250 min",
      totalTime: "350 min",
      productivity: "71%",
    },
    {
      name: "Sanjay Menon",
      productiveTime: "330 min",
      totalTime: "450 min",
      productivity: "73%",
    },
    {
      name: "Aishwarya Kaur",
      productiveTime: "240 min",
      totalTime: "340 min",
      productivity: "70%",
    },
    {
      name: "Karan Verma",
      productiveTime: "380 min",
      totalTime: "490 min",
      productivity: "77%",
    },
    {
      name: "Leela Choudhary",
      productiveTime: "420 min",
      totalTime: "530 min",
      productivity: "85%",
    },
    {
      name: "Manish Pandey",
      productiveTime: "310 min",
      totalTime: "410 min",
      productivity: "76%",
    },
    {
      name: "Nisha Rao",
      productiveTime: "300 min",
      totalTime: "400 min",
      productivity: "75%",
    },
    {
      name: "Omkar Shetty",
      productiveTime: "350 min",
      totalTime: "470 min",
      productivity: "74%",
    },
    {
      name: "Parul Chopra",
      productiveTime: "300 min",
      totalTime: "410 min",
      productivity: "73%",
    },
  ]);

  const filteredEmployees = employees.filter((employee) => {
    switch (filter) {
      case "productive_time_300":
        return parseInt(employee.productiveTime) > 300;
      case "total_time_400":
        return parseInt(employee.totalTime) > 400;
      case "productivity_80":
        return parseInt(employee.productivity) > 80;
      default:
        return true;
    }
  });

  return (
    <div id="employee-list" style={{ marginTop: "10px" }}>
      <h2 id="list-title" style={{ marginBottom: "10px" }}>
        Employee Productivity Data
      </h2>
      <div style={{ overflowY: "auto", maxHeight: "500px" }}>
        {" "}
        {/* Container for scrolling */}
        <table
          id="employee-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Productive Time</th>
              <th scope="col">Total Time</th>
              <th scope="col">Productivity</th>
            </tr>
          </thead>
          <tbody id="employee-data">
            {filteredEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.name}</td>
                <td>{employee.productiveTime}</td>
                <td>{employee.totalTime}</td>
                <td>{employee.productivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
