const mongoose = require("mongoose");

const Store = new mongoose.Schema({
  name: { type: String, required: "This field is required" },
  workers: { type: Array },
  locations: { type: Array, required: "This field is required" },
  identifier: { type: String, required: "This field is required" },
  transacions: { type: Array, required: "This field is required" },
});

module.exports = mongoose.model("Store", Store);
