// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import ProductiveTime from "./components/ProductiveTime/ProductiveTime";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {
            <Route path="/productive-time" element={<ProductiveTime />} />
            /* <Route path="/productive-time" element={<ProductiveTime />} />
          <Route path="/total-time" element={<TotalTime />} />
          <Route path="/productivity" element={<Productivity />} />
          <Route path="/non-productivity" element={<NonProductiveTime />} />
          <Route path="/leave-records" element={<LeaveRecords />} />
          <Route path="/logInlogOut" element={<LogInLogOut />} /> */
          }
        </Routes>
      </div>
    </Router>
  );
};

export default App;
