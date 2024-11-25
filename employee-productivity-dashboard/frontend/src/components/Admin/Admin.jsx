import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="Admin">
      <div className="role-dropdown">
        <label
          htmlFor="role"
          style={{ fontWeight: "bold", marginRight: "10px" }}
        >
          Select Role:
        </label>
        <select
          id="role"
          value={selectedRole}
          onChange={handleRoleChange}
          style={{
            padding: "5px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">--Select Role--</option>
          <option value="superadmin">Superadmin</option>
          <option value="admin">Admin</option>
          <option value="hr">HR</option>
        </select>
      </div>

      {selectedRole && (
        <p style={{ marginTop: "20px", fontSize: "18px" }}>
          Selected Role:{" "}
          {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </p>
      )}
    </div>
  );
};

export default Admin;
