import React from "react";
import HeaderSection from "./components/HeaderSection/HeaderSection";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HeatmapConatiner from "./components/Prediction/HeatmapContainer";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Admin from "./components/Admin/Admin";
import Productivity from "./components/Productivity/Productivity";
import LeaveRecords from "./components/LeaveRecords/LeaveRecords";
import ProductiveTime from "./components/ProductiveTime/ProductiveTime";
import Prediction from "./components/Prediction/Prediction";

import NonProductivity from "./components/NonProductiveTime/NonProductiveTime";
import TimeAtWork from "./components/TimeAtWork/TimeAtWork";
import LogInlogOut from "./components/LogInLogOut/LogInLogOut";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <HeaderSection />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/Prediction" element={<Prediction />} />
          <Route path="/dashboard/productivity" element={<Productivity />} />
          <Route
            path="/dashboard/non-productivity"
            element={<NonProductivity />}
          />
          <Route path="/dashboard/total-time" element={<TimeAtWork />} />
          <Route path="/dashboard/leave-records" element={<LeaveRecords />} />
          <Route
            path="/dashboard/productive-time"
            element={<ProductiveTime />}
          />
          <Route path="/dashboard/logInlogOut" element={<LogInlogOut />} />
          <Route
            path="/Prediction/performance"
            element={<HeatmapConatiner />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
