// import React, { useEffect, useState } from "react";
// import { APIService } from "../APIService/APIService"; // Ensure correct import path
// import "./Prediction.css"; // Updated to match the prediction context

// const Prediction = ({ filter }) => {
//   const [predictions, setPredictions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEmployee, setSelectedEmployee] = useState(""); // New state for selected employee
//   const [searchQuery, setSearchQuery] = useState(""); // New state for search query

//   useEffect(() => {
//     const fetchPredictions = async () => {
//       try {
//         const data = await APIService();
//         const transformedPredictions = [];

//         for (const date in data) {
//           const predictionsData = data[date];
//           for (const predId in predictionsData) {
//             const predInfo = predictionsData[predId];
//             const productiveTimeSeconds = predInfo.productiveTime || 0;
//             const productiveTimeFormatted = new Date(
//               productiveTimeSeconds * 1000
//             )
//               .toISOString()
//               .substr(11, 8);

//             transformedPredictions.push({
//               id: predInfo.id,
//               name: predInfo.name,
//               benchmarkSalary: predInfo.benchmarkSalary, // Assuming this field is provided by the API
//               productiveTime: productiveTimeFormatted,
//               productiveTimeMinutes: Math.floor(productiveTimeSeconds / 60),
//             });
//           }
//         }

//         setPredictions(transformedPredictions);
//       } catch (err) {
//         setError("Error fetching prediction data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPredictions();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   // Unique employee names for the dropdown
//   const uniqueEmployees = [...new Set(predictions.map((pred) => pred.name))];

//   // Filter predictions based on the selected employee, search query, and provided filter prop
//   const filteredPredictions = predictions.filter((prediction) => {
//     const matchesEmployee = selectedEmployee
//       ? prediction.name === selectedEmployee
//       : true;
//     const matchesSearch =
//       searchQuery === "" ||
//       prediction.id.toString().includes(searchQuery) ||
//       prediction.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter =
//       filter === "productive_time_300"
//         ? prediction.productiveTimeMinutes > 300
//         : true;

//     return matchesEmployee && matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="prediction-list-container">
//       {/* Employee selection dropdown */}
//       <div className="employee-selection" style={{ marginBottom: "15px" }}>
//         <label htmlFor="employee-select" style={{ marginRight: "10px" }}>
//           Select Employee:
//         </label>
//         <select
//           id="employee-select"
//           value={selectedEmployee}
//           onChange={(e) => setSelectedEmployee(e.target.value)}
//           style={{ padding: "5px" }}
//         >
//           <option value="">All Employees</option>
//           {uniqueEmployees.map((employee) => (
//             <option key={employee} value={employee}>
//               {employee}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Search input for Employee ID and Name */}
//       <div className="search-input" style={{ marginBottom: "15px" }}>
//         <label htmlFor="search" style={{ marginRight: "10px" }}>
//           Search:
//         </label>
//         <input
//           type="text"
//           id="search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder="Employee ID or Name"
//           style={{ padding: "5px", width: "200px" }}
//         />
//       </div>

//       <div
//         className="prediction-list-table-container"
//         style={{ overflowY: "auto", maxHeight: "500px" }}
//       >
//         <table
//           className="prediction-list-table"
//           style={{ width: "100%", borderCollapse: "collapse" }}
//         >
//           <thead>
//             <tr>
//               <th scope="col">Employee ID</th>
//               <th scope="col">Employee Name</th>
//               <th scope="col">Benchmark Salary</th>
//               <th scope="col">Productive Time</th>
//             </tr>
//           </thead>
//           <tbody className="prediction-list-data">
//             {filteredPredictions.map((pred) => (
//               <tr key={pred.id}>
//                 <td>{pred.id}</td>
//                 <td>{pred.name}</td>
//                 <td>{pred.benchmarkSalary}</td>
//                 <td>{pred.productiveTime}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer with button */}
//       <footer
//         className="prediction-footer"
//         style={{ textAlign: "right", marginTop: "20px" }}
//       >
//         <button
//           className="action-button"
//           onClick={() => alert("Button Clicked!")}
//         >
//           Prediction
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default Prediction;

import React, { useEffect, useState } from "react";
import { APIService } from "../APIService/APIService"; // Ensure correct import path
import "./Prediction.css"; // Updated to match the prediction context

const Prediction = ({ filter }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(""); // New state for selected employee
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await APIService();
        const transformedPredictions = [];

        for (const date in data) {
          const predictionsData = data[date];
          for (const predId in predictionsData) {
            const predInfo = predictionsData[predId];
            const productiveTimeSeconds = predInfo.productiveTime || 0;
            const productiveTimeFormatted = new Date(
              productiveTimeSeconds * 1000
            )
              .toISOString()
              .substr(11, 8);

            // Generate random values for benchmarkSalary and new column "Performance Rating"
            const randomBenchmarkSalary = Math.floor(Math.random() * 41) - 20; // Range -20 to 20
            const randomPerformanceRating = Math.floor(Math.random() * 5) + 1; // Range 1 to 5

            transformedPredictions.push({
              id: predInfo.id,
              name: predInfo.name,
              benchmarkSalary: randomBenchmarkSalary,
              productiveTime: productiveTimeFormatted,
              productiveTimeMinutes: Math.floor(productiveTimeSeconds / 60),
              performanceRating: randomPerformanceRating, // New column value
            });
          }
        }

        setPredictions(transformedPredictions);
      } catch (err) {
        setError("Error fetching prediction data");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Unique employee names for the dropdown
  const uniqueEmployees = [...new Set(predictions.map((pred) => pred.name))];

  // Filter predictions based on the selected employee, search query, and provided filter prop
  const filteredPredictions = predictions.filter((prediction) => {
    const matchesEmployee = selectedEmployee
      ? prediction.name === selectedEmployee
      : true;
    const matchesSearch =
      searchQuery === "" ||
      prediction.id.toString().includes(searchQuery) ||
      prediction.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "productive_time_300"
        ? prediction.productiveTimeMinutes > 300
        : true;

    return matchesEmployee && matchesSearch && matchesFilter;
  });

  return (
    <div className="prediction-list-container">
      {/* Employee selection dropdown */}
      <div className="employee-selection" style={{ marginBottom: "15px" }}>
        <label htmlFor="employee-select" style={{ marginRight: "10px" }}>
          Select Employee:
        </label>
        <select
          id="employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          style={{ padding: "5px" }}
        >
          <option value="">All Employees</option>
          {uniqueEmployees.map((employee) => (
            <option key={employee} value={employee}>
              {employee}
            </option>
          ))}
        </select>
      </div>

      {/* Search input for Employee ID and Name */}
      <div className="search-input" style={{ marginBottom: "15px" }}>
        <label htmlFor="search" style={{ marginRight: "10px" }}>
          Search:
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Employee ID or Name"
          style={{ padding: "5px", width: "200px" }}
        />
      </div>

      <div
        className="prediction-list-table-container"
        style={{ overflowY: "auto", maxHeight: "500px" }}
      >
        <table
          className="prediction-list-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th scope="col">Employee ID</th>
              <th scope="col">Employee Name</th>
              <th scope="col">Benchmark Salary</th>
              <th scope="col">Productive Time</th>
              <th scope="col">Performance Rating</th> {/* New column header */}
            </tr>
          </thead>
          <tbody className="prediction-list-data">
            {filteredPredictions.map((pred) => (
              <tr key={pred.id}>
                <td>{pred.id}</td>
                <td>{pred.name}</td>
                <td>{pred.benchmarkSalary}</td>
                <td>{pred.productiveTime}</td>
                <td>{pred.performanceRating}</td> {/* New column data */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with button */}
      <footer
        className="prediction-footer"
        style={{ textAlign: "right", marginTop: "20px" }}
      >
        <button
          className="action-button"
          onClick={() => alert("Button Clicked!")}
        >
          Prediction
        </button>
      </footer>
    </div>
  );
};

export default Prediction;
