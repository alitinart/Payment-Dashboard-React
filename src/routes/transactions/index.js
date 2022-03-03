const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const Store = mongoose.model("Store");

const checkAPIKey = require("../../middleware/checkAPIKey");
const authenticateToken = require("../../middleware/authenticateToken");
const generateObjectID = require("../../functions/generateObjectID");

require("dotenv").config();

/**
 *
 * Create Transaction
 * Method: POST
 *
 */

router.post("/", checkAPIKey, authenticateToken, async (req, res) => {
  const { amount, method, item } = req.body;
  if (!amount || !method || !item) {
    return res.json({ error: true, message: "Please fill out all the fields" });
  }
  const transaction = {
    amount,
    method,
    item,
    _id: generateObjectID(),
  };

  if (!req.user.store) {
    return res.json({ error: true, message: "Owner can't add transactions" });
  }

  const store = await Store.findOne({ _id: req.user.store._id });

  if (!store) {
    return res.json({ error: true, message: "You can't access that store !" });
  }

  let transactions = store.transactions;

  transactions.push(transaction);

  Store.findOneAndUpdate(
    { _id: req.user.store._id },
    { $set: { transactions } }
  ).then(() => {
    res.json({ error: false, message: "Created Transaction Successfully" });
  });
});

module.exports = router;
