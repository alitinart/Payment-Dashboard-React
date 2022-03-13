const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAPIKey = require("../../middleware/checkAPIKey");
const authenticateToken = require("../../middleware/authenticateToken");

const User = mongoose.model("User");

require("dotenv").config();

router.post("/", checkAPIKey, authenticateToken, (req, res) => {
  const { verificationCode } = req.body;
  const user = req.user;

  if (user.verified) {
    return res.json({ error: true, message: "User is already verified" });
  }

  if (user.code !== verificationCode) {
    return res.json({ error: true, message: "Invalid verification code" });
  }

  User.findOneAndUpdate(
    { _id: user._id },
    { $set: { verified: true, code: "" } }
  ).then(() => {
    res.json({ error: false, message: "Verified User Successfully" });
  });
});

module.exports = router;
