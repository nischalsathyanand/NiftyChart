import React, { useState } from "react";

function NavBar({ onFileUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onFileUpload(file);
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
    </header>
  );
}

export default NavBar;
