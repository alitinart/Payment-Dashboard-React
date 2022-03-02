const mongoose = require("mongoose");

const RefreshToken = new mongoose.Schema({
  refreshToken: { type: String, required: "Refresh Token is Required" },
});

mongoose.model("RefreshToken", RefreshToken);
