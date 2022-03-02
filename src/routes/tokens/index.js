const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkAPIKey = require("../../middleware/checkAPIKey");

const RefreshToken = mongoose.model("RefreshToken");

require("dotenv").config();

/**
 *
 * Get All Tokens
 * Method: GET
 *
 */

router.get("/", checkAPIKey, (req, res) => {
  RefreshToken.find({}).then((tokens) =>
    res.send({ error: false, message: { data: { tokens } } })
  );
});

module.exports = router;
