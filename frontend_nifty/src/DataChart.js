import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";
import "chartjs-adapter-date-fns"; // Date adapter for TimeScale
import { Chart } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  CandlestickController,
  CandlestickElement,
  zoomPlugin
);

const TradingViewChart = () => {
  const chartRef = useRef(null);
  const [financialData, setFinancialData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Dynamically calculate chart height to fit the screen
  const chartHeight = window.innerHeight * 0.7; // Adjust 70% of screen height for the chart

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/alldata"); // Replace with your API endpoint
        const data = await response.json();

        console.log("Fetched Data:", data);

        // Handle different data structures
        if (Array.isArray(data)) {
          const parsedData = data.map((item) => ({
            x: new Date(item.datetime).getTime(), // Convert to timestamp
            o: item.open,
            h: item.high,
            l: item.low,
            c: item.close,
          }));
          setFinancialData(parsedData);
        } else if (data.data && Array.isArray(data.data)) {
          const parsedData = data.data.map((item) => ({
            x: new Date(item.datetime).getTime(),
            o: item.open,
            h: item.high,
            l: item.low,
            c: item.close,
          }));
          setFinancialData(parsedData);
        } else {
          setErrorMessage("Unexpected data format.");
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        setErrorMessage("Failed to fetch data. Please try again later.");
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Show a loading state if the data is still being fetched
  if (financialData.length === 0 && !errorMessage) {
    return <p>Loading...</p>;
  }

  // Chart data
  const chartData = {
    datasets: [
      {
        label: "Candlestick Data",
        data: financialData,
        upColor: "#00b894", // Green for upward candles
        downColor: "#d63031", // Red for downward candles
        borderColor: "#2d3436", // Black border for candles
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to take full height
    layout: {
      padding: 0, // Remove padding
    },
    scales: {
      x: {
        type: "time", // Use time scale for the x-axis
        time: {
          unit: "minute", // Set this to 'minute', 'hour', 'day', etc. based on your data
          tooltipFormat: "MMM dd, yyyy HH:mm", // Format for tooltip
        },
        ticks: {
          color: "#616161", // Customize tick colors
          maxRotation: 45, // Rotate ticks for better visibility
          autoSkip: true, // Automatically skip ticks if there are too many
        },
        grid: {
          color: "#e0e0e0", // Light grid lines
          drawBorder: false, // Don't draw the border on the axis
        },
      },
      y: {
        type: "linear", // Numeric scale for price
        ticks: {
          color: "#616161", // Customize tick colors
          callback: (value) => `$${value.toFixed(2)}`, // Format ticks with $ sign
        },
        grid: {
          color: "#e0e0e0", // Light grid lines
          drawBorder: false, // Don't draw the border on the axis
        },
      },
    },
    plugins: {
      tooltip: {
        mode: "nearest",
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            const date = new Date(tooltipItems[0].raw.x);
            return `Date: ${date.toLocaleString()}`; // Display date and time
          },
          label: (tooltipItem) => {
            const { o, h, l, c } = tooltipItem.raw;
            return `O: ${o}, H: ${h}, L: ${l}, C: ${c}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Pan only on the x-axis
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zoom with the mouse wheel
          },
          mode: "x", // Zoom only on the x-axis
          speed: 0.1,
        },
      },
    },
    elements: {
      candlestick: {
        upColor: "#00b894", // Consistent green for upward candles
        downColor: "#d63031", // Consistent red for downward candles
        borderColor: "#2d3436", // Black border for clarity
        borderWidth: 1,
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%", // Full width
        height: "100vh", // Full height to fit the screen
        padding: "0px", // Remove padding
        margin: "0", // Remove margin
        boxSizing: "border-box", // Ensure proper sizing
        backgroundColor: "#f5f5f5",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "10px",
          fontFamily: "Arial, sans-serif",
          color: "#424242",
        }}
      >
        Nifty Chart
      </h2>
      {errorMessage ? (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      ) : (
        <div
          style={{
            width: "100%", // Full width of the container
            height: `${chartHeight}px`, // Set the chart height dynamically
            maxWidth: "100%", // Ensure it doesn't overflow
            position: "relative", // For absolute positioning of the chart
          }}
        >
          <Chart
            ref={chartRef}
            type="candlestick"
            data={chartData}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;
