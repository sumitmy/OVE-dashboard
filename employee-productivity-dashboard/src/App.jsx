import React from "react";
import HeaderSection from "./components/HeaderSection/HeaderSection";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminPage from "./components/AdminPage/AdminPage";
// import Productivity from "./components/Productivity/Productivity";
import LeaveRecords from "./components/LeaveRecords/LeaveRecords";
import ProductiveTime from "./components/ProductiveTime/ProductiveTime";
import "./App.css";
import Prediction from "./components/Prediction/Prediction";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <HeaderSection />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/Prediction" element={<Prediction />} />
          <Route path="/dashboard/leave-records" element={<LeaveRecords />} />
          <Route
            path="/dashboard/productive-time"
            element={<ProductiveTime />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
