// import React, { useEffect, useState } from "react";
// import { APIService } from "../APIService/APIService";
// import "./EmployeeList.css";

// const EmployeeList = ({ filter }) => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const data = await APIService();
//         const transformedEmployees = [];

//         for (const date in data) {
//           const employeesData = data[date];
//           for (const empId in employeesData) {
//             const empInfo = employeesData[empId];
//             const productiveTimeSeconds = empInfo.productiveTime || 0;
//             const productiveTimeFormatted = new Date(
//               productiveTimeSeconds * 1000
//             )
//               .toISOString()
//               .substr(11, 8);

//             transformedEmployees.push({
//               id: empInfo.id,
//               date,
//               name: empInfo.name,
//               productiveTime: productiveTimeFormatted,
//               productiveTimeMinutes: Math.floor(productiveTimeSeconds / 60),
//             });
//           }
//         }

//         setEmployees(transformedEmployees);
//       } catch (err) {
//         setError("Error fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   // Filter employees based on the provided filter prop
//   const filteredEmployees = employees.filter((employee) => {
//     switch (filter) {
//       case "productive_time_300":
//         return employee.productiveTimeMinutes > 300;
//       default:
//         return true;
//     }
//   });

//   return (
//     <div id="employee-list">
//       <h2 id="list-title" style={{ marginBottom: "10px" }}>
//         Employee Productivity Data
//       </h2>
//       <div style={{ overflowY: "auto", maxHeight: "500px" }}>
//         <table
//           id="employee-table"
//           style={{ width: "100%", borderCollapse: "collapse" }}
//         >
//           <thead>
//             <tr>
//               <th scope="col">Employee ID</th>
//               <th scope="col">Date</th>
//               <th scope="col">Employee Name</th>
//               <th scope="col">Productive Time</th>
//             </tr>
//           </thead>
//           <tbody id="employee-data">
//             {filteredEmployees.map((emp) => (
//               <tr key={emp.id}>
//                 <td>{emp.id}</td>
//                 <td>{emp.date}</td>
//                 <td>{emp.name}</td>
//                 <td>{emp.productiveTime}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeList;

import React, { useEffect, useState } from "react";
import { APIService } from "../APIService/APIService";
import "./EmployeeList.css";

const EmployeeList = ({ filter }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch employee data from APIService
    const fetchEmployees = async () => {
      try {
        const data = await APIService();
        const transformedEmployees = [];

        // Transform and format employee data
        Object.keys(data).forEach((date) => {
          const employeesData = data[date];
          Object.keys(employeesData).forEach((empId) => {
            const empInfo = employeesData[empId];
            const productiveTimeSeconds = empInfo.productiveTime || 0;
            const productiveTimeFormatted = new Date(
              productiveTimeSeconds * 1000
            )
              .toISOString()
              .substr(11, 8);

            transformedEmployees.push({
              id: empInfo.id,
              date,
              name: empInfo.name,
              productiveTime: productiveTimeFormatted,
              productiveTimeMinutes: Math.floor(productiveTimeSeconds / 60),
            });
          });
        });

        setEmployees(transformedEmployees); // Set employees data in state
      } catch (err) {
        setError("Error fetching data"); // Set error if fetch fails
      } finally {
        setLoading(false); // Stop loading once fetch completes
      }
    };

    fetchEmployees();
  }, []);

  // Loading and error state handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Filter employees based on filter prop
  const filteredEmployees = employees.filter((employee) => {
    if (filter === "productive_time_300") {
      return employee.productiveTimeMinutes > 300;
    }
    return true;
  });

  return (
    <div id="employee-list">
      <h2 id="list-title" style={{ marginBottom: "10px" }}>
        Employee Productivity Data
      </h2>
      <div style={{ overflowY: "auto", maxHeight: "500px" }}>
        <table
          id="employee-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th scope="col">Employee ID</th>
              <th scope="col">Date</th>
              <th scope="col">Employee Name</th>
              <th scope="col">Productive Time</th>
            </tr>
          </thead>
          <tbody id="employee-data">
            {filteredEmployees.map((emp) => (
              <tr key={`${emp.id}-${emp.date}`}>
                <td>{emp.id}</td>
                <td>{emp.date}</td>
                <td>{emp.name}</td>
                <td>{emp.productiveTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
