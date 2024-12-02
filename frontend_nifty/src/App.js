import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import DataTable from "./DataTable";
import DataChart from "./DataChart";

function App() {
  const [data, setData] = useState([]); // Holds the market data
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'
  const [loading, setLoading] = useState(false); // Loader state for data
  const [error, setError] = useState(null); // Error state for any API issues

  // Fetch all data initially
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/alldata");
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
      const result = await response.json();
      setData(result.data); // Set fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("An unexpected error occurred. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Load data on initial mount
  }, []); // Empty dependency array ensures it only runs once

  // Handle the file upload result
  const handleFileUpload = (uploadedData) => {
    // Update the state with newly uploaded data
    setData(uploadedData);
  };

  return (
    <div className="App">
      <NavBar onFileUpload={handleFileUpload} />{" "}
      {/* Pass onFileUpload as a prop */}
      <div style={{ margin: "10px" }}>
        <button
          onClick={() => setViewMode("table")}
          style={{ marginRight: "10px" }}
        >
          View Data in Table
        </button>
        <button
          onClick={() => setViewMode("chart")}
          style={{ marginRight: "10px" }}
        >
          View Chart
        </button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* Error message */}
      {loading && <div>Loading data...</div>} {/* Loader when fetching data */}
      {viewMode === "table" && !loading && <DataTable data={data} />}{" "}
      {/* Show table */}
      {viewMode === "chart" && !loading && <DataChart data={data} />}{" "}
      {/* Show chart */}
    </div>
  );
}

export default App;
