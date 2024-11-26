import React, { useState } from "react";

function UploadForm({ onFileUpload, onFileChange }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button type="submit" style={{ marginLeft: "10px" }}>
        Submit
      </button>
    </form>
  );
}

export default UploadForm;
