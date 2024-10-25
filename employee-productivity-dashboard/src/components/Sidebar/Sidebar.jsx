import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/">Dashboard</Link> {/* Redirects to the dashboard */}
        </li>
        <li>
          <Link to="/admin">Admin</Link> {/* Add your admin route */}
        </li>
        <li>
          <Link to="/Prodctivity">Productivity</Link>{" "}
          {/* Add your Productivity route */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
