import React from "react";
import { Link } from "react-router-dom";
// import Productivity from "./Productivity/Productivity.jsx";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <li>
          <Link to="/prediction">Prediction</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
