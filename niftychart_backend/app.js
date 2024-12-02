const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const MarketData = require("./models/MarketData");
const cors = require("cors");
const path = require("path");
const moment = require("moment");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// MongoDB connection
const uri =
  "mongodb+srv://nischalsathyanand:nischal123@cluster0.06igqyd.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Middleware to parse JSON bodies
app.use(express.json());

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// POST endpoint to add market data from CSV file
app.post("/adddata", upload.single("csvFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const marketData = [];

    // Parse the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        try {
          // Parse the datetime and ensure correct data types
          const parsedDate = moment(
            row.datetime,
            "DD-MM-YYYY HH:mm",
            true
          ).toDate();
          if (!parsedDate || isNaN(parsedDate)) {
            throw new Error(`Invalid datetime format: ${row.datetime}`);
          }

          marketData.push({
            datetime: parsedDate,
            exchange_code: row.exchange_code || "N/A", // Default value if missing
            expiry_date: row.expiry_date || "N/A",
            high: parseFloat(row.high) || 0,
            low: parseFloat(row.low) || 0,
            open: parseFloat(row.open) || 0,
            close: parseFloat(row.close) || 0,
            open_interest: parseInt(row.open_interest) || 0,
            product_type: row.product_type || "N/A",
            stock_code: row.stock_code || "N/A",
            volume: parseInt(row.volume) || 0,
          });
        } catch (error) {
          console.error("Error parsing row:", row, error.message);
        }
      })
      .on("end", async () => {
        try {
          await MarketData.insertMany(marketData);
          res.status(201).json({
            message: "Data added successfully",
            data: marketData,
          });
        } catch (error) {
          console.error("Error saving data to DB:", error);
          res.status(500).json({ error: "Error saving data to database" });
        } finally {
          fs.unlinkSync(filePath); // Delete the file after processing
        }
      })
      .on("error", (error) => {
        console.error("Error parsing CSV file:", error);
        res.status(400).json({ error: "Error parsing CSV file" });
        fs.unlinkSync(filePath); // Clean up the uploaded file
      });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint to retrieve all market data
app.get("/alldata", async (req, res) => {
  try {
    // Fetch all data from the database without pagination
    const data = await MarketData.find({}).exec();

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({
      message: "Data retrieved successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Error retrieving data" });
  }
});

// DELETE endpoint to delete all market data
app.delete("/deletealldata", async (req, res) => {
  try {
    // Delete all documents in the MarketData collection
    const result = await MarketData.deleteMany({});

    // Check if any documents were deleted
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "All data deleted successfully" });
    } else {
      res.status(404).json({ message: "No data found to delete" });
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Error deleting data" });
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
