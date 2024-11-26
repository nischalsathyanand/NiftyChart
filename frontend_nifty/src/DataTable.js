import React from "react";

function DataTable({ data }) {
  return (
    <table
      border="1"
      style={{
        marginTop: "20px",
        width: "100%",
        color: "#fff",
        backgroundColor: "#222",
      }}
    >
      <thead>
        <tr>
          <th>Datetime</th>
          <th>Exchange Code</th>
          <th>Expiry Date</th>
          <th>High</th>
          <th>Low</th>
          <th>Open</th>
          <th>Close</th>
          <th>Open Interest</th>
          <th>Product Type</th>
          <th>Stock Code</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="11" style={{ textAlign: "center" }}>
              No data available
            </td>
          </tr>
        ) : (
          data.map((row, index) => (
            <tr key={index}>
              <td>{new Date(row.datetime).toLocaleString()}</td>
              <td>{row.exchange_code}</td>
              <td>{row.expiry_date}</td>
              <td>{row.high}</td>
              <td>{row.low}</td>
              <td>{row.open}</td>
              <td>{row.close}</td>
              <td>{row.open_interest}</td>
              <td>{row.product_type}</td>
              <td>{row.stock_code}</td>
              <td>{row.volume}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default DataTable;
