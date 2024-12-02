import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "./Prediction.css";
import axios from "axios";

const Prediction = () => {
  const [myData, setMyData] = useState([]); 
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groupOptions, setGroupOptions] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectedEmployee, setSelectedEmployee] = useState(""); 
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false); 
  const [selectedYear, setSelectedYear] = useState("All"); 
  const [yearOptions, setYearOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false); 
  const [editableData, setEditableData] = useState([]); 
  const [selectedRows, setSelectedRows] = useState([]); 
  const [selectAll, setSelectAll] = useState(false); 

  const navigate = useNavigate();

  const openPage = (id) => {
    switch (id) {
      case "predict":
        navigate("/prediction/predict");
        break;
      default:
        break;
    }
  };
  const getData = async () => {
    try {
      const response = await api.get("/api/prediction");
      if (typeof response.data === "string") {
        try {
          const parsedData = JSON.parse(response.data);
          setMyData(parsedData); 
        } catch (e) {
          console.error("Error parsing response data:", e);
        }
      } else {
        setMyData(response.data);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };
  const getUniqueGroups = () => {
    const groups = myData.map((data) => data["Group"]);
    const uniqueGroups = [...new Set(groups)];
    setGroupOptions(uniqueGroups);
  };
  const getUniqueYears = () => {
    const years = myData.map((data) => new Date(data["Date"]).getFullYear());
    const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
    setYearOptions(uniqueYears);
  };
  const filteredData = selectedGroup
    ? myData.filter((data) => data["Group"] === selectedGroup)
    : myData;
  const yearFilteredData =
    selectedYear === "All"
      ? filteredData
      : filteredData.filter(
          (data) =>
            new Date(data["Date"]).getFullYear() === parseInt(selectedYear)
        );
  const searchFilteredData = yearFilteredData.filter((data) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      data["Employee ID"].toString().includes(searchLower) ||
      data["Employee Name"].toLowerCase().includes(searchLower)
    );
  });
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (myData.length > 0) {
      getUniqueGroups();
      getUniqueYears(); 
    }
  }, [myData]);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleEmployeeSelect = (event) => {
    setSelectedEmployee(event.target.value);
    setShowEmployeeDropdown(false); 
  };
  const toggleEmployeeDropdown = () => {
    setShowEmployeeDropdown(!showEmployeeDropdown);
  };
  const employeeFilteredData = selectedEmployee
    ? myData.filter((data) => data["Employee ID"] === selectedEmployee)
    : searchFilteredData;
  const handleEditButtonClick = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditableData(
        employeeFilteredData.map((data) => ({
          ...data,
          editedSalary: data["Benchmark Salary"] || "",
          editedSatisfaction: data["Job Satisfaction"] || "",
          editedEfficiency: data["Monthly Average Efficiency"] || "",
        }))
      );
    }
  };

  const handleSaveButtonClick = async () => {
    try {
      const updatedData = editableData.map((data) => ({
        "Employee ID": data["Employee ID"],
        editedSalary: data.editedSalary,
        editedSatisfaction: data.editedSatisfaction,
        editedEfficiency: data.editedEfficiency,
      }));
      const response = await axios.put("/api/prediction/update", {
        updatedData,
      });

      if (response.status === 200) {
        alert("Changes saved successfully!");
        setMyData((prevData) =>
          prevData.map((data) => {
            const updated = updatedData.find(
              (edit) => edit["Employee ID"] === data["Employee ID"]
            );
            return updated
              ? {
                  ...data,
                  "Benchmark Salary": updated.editedSalary,
                  "Job Satisfaction": updated.editedSatisfaction,
                  "Monthly Average Efficiency": updated.editedEfficiency,
                }
              : data;
          })
        );
        setIsEditing(false);
        setEditableData([]);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };
  const handleRowSelect = (employeeId) => {
    setSelectedRows((prevSelected) => {
      if (prevSelected.includes(employeeId)) {
        return prevSelected.filter((id) => id !== employeeId);
      } else {
        return [...prevSelected, employeeId];
      }
    });
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]); 
    } else {
      setSelectedRows(employeeFilteredData.map((data) => data["Employee ID"]));
    }
    setSelectAll(!selectAll); 
  };

  const handlePredictionButtonClick = async () => {
    const selectedEmployees =
      selectedRows.length > 0
        ? employeeFilteredData.filter((employee) =>
            selectedRows.includes(employee["Employee ID"])
          )
        : employeeFilteredData;
    console.log("Data type", typeof selectedEmployees);
    console.log("Data to be sent for predect:", selectedEmployees);

    try {
      const response = await axios.post("/api/prediction/predict", {
        employees: selectedEmployees,
      });

      if (response.status === 200) {
        const predictions = response.data;
        console.log("Predictions:", predictions);
        navigate("/prediction/predict", { state: { predictions } });
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };
  const handleCombinedClick = () => {
    openPage("/prediction/predict");
    handlePredictionButtonClick(); 
  };

  return (
    <div className="prediction-list-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ marginRight: "20px" }}>
          <label htmlFor="group" style={{ marginRight: "5px" }}>
            Group:
          </label>
          <select
            id="group"
            onChange={(e) => setSelectedGroup(e.target.value)}
            value={selectedGroup}
          >
            <option value="">All</option>
            {groupOptions.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <label htmlFor="Search" style={{ marginRight: "5px" }}>
            Search:{" "}
          </label>
          <input
            type="text"
            placeholder="Employee ID or Name"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              paddingRight: "30px",
              paddingLeft: "10px",
              height: "30px",
              width: "200px",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "2px",
              cursor: "pointer",
              fontSize: "18px",
            }}
            onClick={toggleEmployeeDropdown}
          >
            &#9660;
          </span>
          {showEmployeeDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: "0",
                width: "100%",
                zIndex: 10,
                marginTop: "5px",
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                backgroundColor: "white",
              }}
            >
              <div
                onClick={() => handleEmployeeSelect({ target: { value: "" } })} style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                  fontWeight: "bold",
                  backgroundColor: "#f0f0f0", 
                }}
              >
                All
              </div>
              {searchFilteredData.map((data, index) => (
                <div
                  key={index}
                  onClick={() =>
                    handleEmployeeSelect({
                      target: { value: data["Employee ID"] },
                    })
                  }
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {data["Employee Name"]}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto" }}>
          <label htmlFor="year">Year: </label>
          <select
            id="year"
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
          >
            <option value="All">All</option>
            <option value="All">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>
        <button
          onClick={handleEditButtonClick}
          style={{
            marginLeft: "20px",
            padding: "5px 10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
      <h2 >Employee's Benchmark Data</h2>
      <div
        className="prediction-list-table-container"
        style={{ overflowY: "auto", maxHeight: "65vh", marginTop: "10px" }}
      >
        <table
          id="employee-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>

            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col">Employee ID</th>
              <th scope="col">Employee Name</th>
              <th scope="col">Group</th>
              <th scope="col">Benchmark Salary (+/- %)</th>
              <th scope="col">Job Satisfaction (Min 1-Max 5)</th>
              <th scope="col">Monthly Average Efficiency (%)</th>
            </tr>
          </thead>

          <tbody id="employee-data">
            {employeeFilteredData.map((data, index) => (
              <tr
                key={index}
                onClick={(e) => {
                  if (e.target.tagName !== "INPUT") {
                    handleRowSelect(data["Employee ID"]);
                  }
                }}
                style={{
                  backgroundColor: selectedRows.includes(data["Employee ID"])
                    ? "#e0f7fa"
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(data["Employee ID"])}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleRowSelect(data["Employee ID"]);
                    }}
                  />
                </td>
                <td>{data["Employee ID"]}</td>
                <td>{data["Employee Name"]}</td>
                <td>{data["Group"]}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={
                        editableData[index]?.editedSalary ||
                        data["Benchmark Salary"]
                      }
                      onChange={(e) => {
                        const updatedData = [...editableData];
                        updatedData[index].editedSalary = e.target.value;
                        setEditableData(updatedData);
                      }}
                    />
                  ) : (
                    Math.round(data["Benchmark Salary"])
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={
                        editableData[index]?.editedSatisfaction ||
                        data["Job Satisfaction"]
                      }
                      onChange={(e) => {
                        const updatedData = [...editableData];
                        updatedData[index].editedSatisfaction = e.target.value;
                        setEditableData(updatedData);
                      }}
                    />
                  ) : (
                    data["Job Satisfaction"]
                  )}
                </td>
                
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={
                        editableData[index]?.editedEfficiency ||
                        data["Monthly Average Efficiency"]
                      }
                      onChange={(e) => {
                        const updatedData = [...editableData];
                        updatedData[index].editedEfficiency = e.target.value;
                        setEditableData(updatedData);
                      }}
                    />
                  ) : (
                    Math.round(data["Monthly Average Efficiency"])
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <footer
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
          }}
        >
          <button
            id="predict"
            onClick={handleCombinedClick}
            style={{
              padding: "10px 10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Prediction
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Prediction;
