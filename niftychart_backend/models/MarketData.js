const mongoose = require("mongoose");

const MarketDataSchema = new mongoose.Schema({
  datetime: { type: Date, required: true }, // Use Date for datetime values
  exchange_code: { type: String, required: true },
  expiry_date: { type: String, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  open: { type: Number, required: true },
  close: { type: Number, required: true },
  open_interest: { type: Number, required: true },
  product_type: { type: String, required: true },
  stock_code: { type: String, required: true },
  volume: { type: Number, required: true },
});

module.exports = mongoose.model("MarketData", MarketDataSchema);
