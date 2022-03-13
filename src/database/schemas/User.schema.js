const mongoose = require("mongoose");

const User = new mongoose.Schema({
  fullName: { type: String, required: "This field is required" },
  password: { type: String, required: "This field is required" },
  email: { type: String, required: "This field is required" },
  stores: { type: Array },
  store: { type: Object },
  role: { type: String, required: "This field is required" },
  verified: { type: Boolean, required: "This field is required" },
  code: { type: String },
});

module.exports = mongoose.model("User", User);