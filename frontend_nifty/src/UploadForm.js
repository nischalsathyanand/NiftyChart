import React, { useState } from "react";

function UploadForm({ onFileUpload, onFileChange }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(""); // Add state for errors

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Check if the file is a valid CSV
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      onFileChange(selectedFile);
      setError(""); // Clear any previous error
    } else {
      setError("Please upload a valid CSV file."); // Show error message
      setFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onFileUpload(file);
    } else {
      setError("Please select a file before submitting.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ color: "white" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>
        Submit
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message */}
    </form>
  );
}

export default UploadForm;
