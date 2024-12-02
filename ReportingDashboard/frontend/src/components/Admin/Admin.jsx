// import React, { useState } from "react";
// import "./Admin.css";

// const Admin = () => {
//   const [selectedRole, setSelectedRole] = useState("");

//   const handleRoleChange = (e) => {
//     setSelectedRole(e.target.value);
//   };

//   return (
//     <div className="Admin">
//       <div className="role-dropdown">
//         <label
//           htmlFor="role"
//           style={{ fontWeight: "bold", marginRight: "10px" }}
//         >
//           Select Role:
//         </label>
//         <select
//           id="role"
//           value={selectedRole}
//           onChange={handleRoleChange}
//           style={{
//             padding: "5px",
//             fontSize: "16px",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         >
//           <option value="">--Select Role--</option>
//           <option value="superadmin">Superadmin</option>
//           <option value="admin">Admin</option>
//           <option value="hr">HR</option>
//         </select>
//       </div>

//       {selectedRole && (
//         <p style={{ marginTop: "20px", fontSize: "18px" }}>
//           Selected Role:{" "}
//           {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Admin;
import React, { useState } from "react";
import "./Admin.css";

const Admin = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleEditClick = () => {
    if (selectedRole === "superadmin") {
      setIsEditing(true);
      // Add logic for editing here
      alert("Edit button clicked.");
    }
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

      {/* Conditionally render the Edit button if Superadmin is selected */}
      {selectedRole === "superadmin" && (
        <button
          onClick={handleEditClick}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Edit
        </button>
      )}

      {isEditing && selectedRole === "superadmin" && (
        <div style={{ marginTop: "20px" }}>
          <p>Editing the details for Superadmin...</p>
          {/* Add your editing UI here */}
        </div>
      )}
    </div>
  );
};

export default Admin;
