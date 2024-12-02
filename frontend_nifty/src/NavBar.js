import React, { useState } from "react";

function NavBar({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(""); // Add state for errors

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Validate the file type
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(""); // Clear any previous error
    } else {
      setError("Please upload a valid CSV file."); // Show error message
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        // Create FormData object to send the file to the backend
        const formData = new FormData();
        formData.append("csvFile", file);

        // Send the file to the backend
        const response = await fetch("http://localhost:5000/adddata", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "An error occurred during upload.");
        } else {
          // Notify the parent component (App) about the successful upload
          const result = await response.json();
          onFileUpload(result.data); // Pass the data to the parent component
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("An unexpected error occurred. Please check the console.");
      }
    } else {
      setError("Please select a file before submitting.");
    }
  };

  return (
    <header
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "orange",
      }}
    >
      <h2 style={{ margin: 0 }}>Nifty Chart</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ color: "white" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "orange",
            border: "none",
            padding: "5px 10px",
            color: "white",
          }}
        >
          Submit
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
    </header>
  );
}

export default NavBar;
