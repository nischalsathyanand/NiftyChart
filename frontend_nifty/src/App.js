import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import DataTable from "./DataTable";
import DataChart from "./DataChart";
import { debounce } from "lodash"; // Import lodash debounce

function App() {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'chart'
  const [page, setPage] = useState(1); // Pagination page
  const [loading, setLoading] = useState(false); // Loader state for infinite scroll
  const [hasMoreData, setHasMoreData] = useState(true); // Check if there's more data to load
  const [error, setError] = useState(null);

  // Function to fetch data with pagination
  const fetchData = async (pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/alldata?page=${pageNum}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setHasMoreData(false);
        return;
      }
      const result = await response.json();
      setData((prevData) => [...prevData, ...result.data]); // Append new data
      if (result.data.length < 3000) {
        setHasMoreData(false); // No more data to load
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        "An unexpected error occurred. Please check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    fetchData(page); // Load first page of data
  }, []); // Empty dependency array ensures it only runs once

  // Function to handle scroll and load more data
  const handleScroll = debounce((event) => {
    const bottom =
      event.target.scrollHeight ===
      event.target.scrollTop + event.target.clientHeight;
    if (bottom && !loading && hasMoreData) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchData(nextPage); // Load next page
        return nextPage; // Update page state
      });
    }
  }, 500); // Debounce for 500ms

  return (
    <div className="App">
      <NavBar />
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
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading && <div>Loading data...</div>} {/* Loader when fetching data */}
      {viewMode === "table" && (
        <div
          style={{
            overflowY: "scroll",
            maxHeight: "500px", // Limit the height of the table
            border: "1px solid #ccc",
          }}
          onScroll={handleScroll}
        >
          <DataTable data={data} />
        </div>
      )}
      {viewMode === "chart" && <DataChart data={data} />}
    </div>
  );
}

export default App;
