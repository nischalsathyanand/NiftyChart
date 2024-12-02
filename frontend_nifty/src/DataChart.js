import React, { useState, useEffect } from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";

const TradingViewChart = () => {
  const [financialData, setFinancialData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch financial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/alldata"); // Replace with your API endpoint
        const data = await response.json();

        console.log("Fetched Data:", data);

        // Handle different data structures
        if (Array.isArray(data)) {
          const parsedData = data.map((item) => ({
            date: new Date(item.datetime),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
          }));
          setFinancialData(parsedData);
        } else if (data.data && Array.isArray(data.data)) {
          const parsedData = data.data.map((item) => ({
            date: new Date(item.datetime),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
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

  // Loading state
  if (financialData.length === 0 && !errorMessage) {
    return <p>Loading...</p>;
  }

  // Set up chart data
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => d.date
  );
  const { data, xScale, xAccessor, displayXAccessor } =
    xScaleProvider(financialData);
  const start = xAccessor(data[data.length - 1]);
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];

  const handlePan = (state) => {
    console.log("Pan state:", state);
  };

  const handleZoom = (state) => {
    console.log("Zoom state:", state);
  };

  // Chart rendering
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
            height: "70%", // Set the chart height dynamically
            maxWidth: "100%", // Ensure it doesn't overflow
            position: "relative", // For absolute positioning of the chart
          }}
        >
          <ChartCanvas
            height={400}
            width={window.innerWidth}
            ratio={1}
            margin={{ left: 80, right: 80, top: 10, bottom: 30 }}
            type="svg"
            seriesName="Nifty"
            data={data}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents}
            onPan={handlePan}
            onZoom={handleZoom}
          >
            <Chart
              id={1}
              yExtents={[(d) => [d.high, d.low]]}
              padding={{ top: 40, bottom: 20 }}
            >
              <XAxis axisAt="bottom" orient="bottom" />
              <YAxis axisAt="right" orient="right" ticks={5} />
              <MouseCoordinateX
                rectWidth={60}
                at="bottom"
                orient="bottom"
                displayFormat={timeFormat("%H:%M:%S")}
              />
              <MouseCoordinateY
                at="right"
                orient="right"
                displayFormat={format(".2f")}
              />
              <CandlestickSeries />
              <OHLCTooltip
                origin={[-40, 0]} // Position of the tooltip
                tooltipContent={(e) => {
                  const { y } = e;
                  const { date, open, high, low, close } = y;

                  return (
                    <div
                      style={{
                        fontFamily: "Arial, sans-serif",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        padding: "10px",
                      }}
                    >
                      <p>
                        <strong>Date:</strong> {timeFormat("%Y-%m-%d")(date)}
                      </p>
                      <p>
                        <strong>Open:</strong> {open.toFixed(2)}
                      </p>
                      <p>
                        <strong>High:</strong> {high.toFixed(2)}
                      </p>
                      <p>
                        <strong>Low:</strong> {low.toFixed(2)}
                      </p>
                      <p>
                        <strong>Close:</strong> {close.toFixed(2)}
                      </p>
                    </div>
                  );
                }}
              />
            </Chart>

            <CrossHairCursor />
          </ChartCanvas>
        </div>
      )}
    </div>
  );
};

export default TradingViewChart;
