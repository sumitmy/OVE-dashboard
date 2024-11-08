import React, { useEffect, useState, useRef } from "react";
import { APIService } from "../APIService/APIService";
import "./Prediction.css";

const Prediction = ({ filter }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const dropdownRef = useRef(null);
  const [validationErrors, setValidationErrors] = useState({});

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

            const randomBenchmarkSalary = Math.floor(Math.random() * 41) - 20;
            const randomJobSatisfaction = Math.floor(Math.random() * 5) + 1;

            transformedPredictions.push({
              id: predInfo.id,
              name: predInfo.name,
              group: predInfo.group, // Assuming group data is available from API
              benchmarkSalary: randomBenchmarkSalary,
              jobSatisfaction: randomJobSatisfaction,
              productiveTimeMinutes: Math.floor(productiveTimeSeconds / 60),
              performanceRating: Math.floor(Math.random() * 5) + 1,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleRowClick = (employeeId) => {
    if (!isEditMode) {
      setSelectedEmployees((prevSelected) =>
        prevSelected.includes(employeeId)
          ? prevSelected.filter((id) => id !== employeeId)
          : [...prevSelected, employeeId]
      );
    }
  };

  const filteredPredictions = predictions.filter((prediction) => {
    const matchesSearch =
      searchQuery === "" ||
      prediction.id.toString().startsWith(searchQuery) ||
      prediction.name.toLowerCase().startsWith(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "productive_time_300"
        ? prediction.productiveTimeMinutes > 300
        : true;
    const matchesGroup =
      selectedGroup === "All" || prediction.group === selectedGroup;

    return matchesSearch && matchesFilter && matchesGroup;
  });

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleDropdownSelect = (employee) => {
    setSearchQuery(employee.name);
    setShowDropdown(false);
  };

  const filteredDropdownEmployees = predictions.filter((employee) =>
    employee.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const toggleEditMode = () => {
    setIsEditMode((prevMode) => !prevMode);
    if (isEditMode) {
      setSelectedEmployees([]);
    }
  };

  const handleInputChange = (id, field, value) => {
    const numValue = value === "" ? "" : Number(value);
    const errors = { ...validationErrors };

    if (field === "benchmarkSalary") {
      if (numValue === "" || numValue < -20 || numValue > 20) {
        errors[id] = {
          ...errors[id],
          benchmarkSalary: "Must be between -20 and 20.",
        };
      } else {
        delete errors[id]?.benchmarkSalary;
      }
    } else if (field === "jobSatisfaction") {
      if (numValue === "" || numValue < 1 || numValue > 5) {
        errors[id] = {
          ...errors[id],
          jobSatisfaction: "Must be between 1 and 5.",
        };
      } else {
        delete errors[id]?.jobSatisfaction;
      }
    } else if (field === "performanceRating") {
      if (numValue === "" || numValue < 1 || numValue > 5) {
        errors[id] = {
          ...errors[id],
          performanceRating: "Must be between 1 and 5.",
        };
      } else {
        delete errors[id]?.performanceRating;
      }
    }

    setValidationErrors(errors);

    setPredictions((prevPredictions) =>
      prevPredictions.map((pred) =>
        pred.id === id ? { ...pred, [field]: numValue } : pred
      )
    );
  };

  const handlePredictionButtonClick = () => {
    // Prepare data based on selected employees or all predictions
    const dataToStore =
      selectedEmployees.length > 0
        ? predictions.filter((pred) => selectedEmployees.includes(pred.id))
        : predictions;

    console.log("Data to store:", dataToStore);
    // Implement your storing logic here (e.g., API call or state update)
  };

  return (
    <div className="prediction-list-container">
      <div
        className="search-container"
        style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}
      >
        {/* Group Selection Dropdown */}
        <div className="group" style={{ marginRight: "15px" }}>
          <label htmlFor="group" style={{ fontWeight: "bold" }}>
            Group:
          </label>
          <select
            id="group"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            style={{
              marginLeft: "5px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px",
              padding: "5px",
              width: "200px",
            }}
          >
            <option value="All">All</option>
            <option value="Without team">Without team</option>
            <option value="Anil`s Team">Anil`s Team</option>
            <option value="BD">BD</option>
            <option value="Big-city">Big-city</option>
            <option value="Bingo">Bingo</option>
            <option value="HR">HR</option>
            <option value="Jimmy">Jimmy</option>
            <option value="MW-Support">MW-Support</option>
            <option value="Operations Management">Operations Management</option>
            <option value="Paperless">Paperless</option>
            <option value="Paras Team">Paras Team</option>
            <option value="Recruitment Team">Recruitment team</option>
            <option value="Shipeezi">Shipeezi</option>
            <option value="Stratton">Stratton</option>
            <option value="UI">UI</option>
          </select>
        </div>

        <div className="search-input" style={{ flex: "1" }}>
          <label
            htmlFor="search"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            Search:
          </label>
          <div style={{ position: "relative" }} ref={dropdownRef}>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Employee ID or Name"
              style={{ padding: "5px", width: "200px" }}
            />
            <span
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                cursor: "pointer",
                marginLeft: "5px",
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              ▼
            </span>
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  zIndex: 1000,
                  maxHeight: "400px",
                  overflowY: "auto",
                  width: "200px",
                }}
              >
                {filteredDropdownEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    onClick={() => handleDropdownSelect(employee)}
                    style={{
                      padding: "5px",
                      cursor: "pointer",
                      backgroundColor: "white",
                      borderBottom: "1px solid #ccc",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f0f0f0")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {employee.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button onClick={toggleEditMode} style={{ marginLeft: "10px" }}>
          {isEditMode ? "Save" : "Edit"}
        </button>
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
              <th style={{ border: "1px solid #ccc" }}>ID</th>
              <th style={{ border: "1px solid #ccc" }}>Name</th>
              <th style={{ border: "1px solid #ccc" }}>Group</th>
              <th style={{ border: "1px solid #ccc" }}>
                Benchmark Salary/Year
              </th>
              <th style={{ border: "1px solid #ccc" }}>
                Job Satisfaction/Year
              </th>
              <th style={{ border: "1px solid #ccc" }}>
                Performance Rating/Year
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPredictions.map((prediction) => (
              <tr
                key={prediction.id}
                onClick={() => handleRowClick(prediction.id)}
                style={{
                  backgroundColor: selectedEmployees.includes(prediction.id)
                    ? "#74c7d2"
                    : "white",
                  cursor: isEditMode ? "default" : "pointer",
                }}
              >
                <td style={{ border: "1px solid #ccc" }}>{prediction.id}</td>
                <td style={{ border: "1px solid #ccc" }}>{prediction.name}</td>
                <td style={{ border: "1px solid #ccc" }}>{prediction.group}</td>
                <td style={{ border: "1px solid #ccc" }}>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={prediction.benchmarkSalary}
                      onChange={(e) =>
                        handleInputChange(
                          prediction.id,
                          "benchmarkSalary",
                          e.target.value
                        )
                      }
                      style={{
                        width: "25%",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    prediction.benchmarkSalary
                  )}
                  {validationErrors[prediction.id]?.benchmarkSalary && (
                    <div style={{ color: "red" }}>
                      {validationErrors[prediction.id].benchmarkSalary}
                    </div>
                  )}
                </td>
                <td style={{ border: "1px solid #ccc" }}>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={prediction.jobSatisfaction}
                      onChange={(e) =>
                        handleInputChange(
                          prediction.id,
                          "jobSatisfaction",
                          e.target.value
                        )
                      }
                      style={{
                        width: "25%",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    prediction.jobSatisfaction
                  )}
                  {validationErrors[prediction.id]?.jobSatisfaction && (
                    <div style={{ color: "red" }}>
                      {validationErrors[prediction.id].jobSatisfaction}
                    </div>
                  )}
                </td>
                <td style={{ border: "1px solid #ccc" }}>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={prediction.performanceRating}
                      onChange={(e) =>
                        handleInputChange(
                          prediction.id,
                          "performanceRating",
                          e.target.value
                        )
                      }
                      style={{
                        width: "25%",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    prediction.performanceRating
                  )}
                  {validationErrors[prediction.id]?.performanceRating && (
                    <div style={{ color: "red" }}>
                      {validationErrors[prediction.id].performanceRating}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Prediction Button */}
      <footer
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handlePredictionButtonClick}
          style={{ padding: "10px 20px" }}
        >
          Prediction
        </button>
      </footer>
    </div>
  );
};

export default Prediction;
