const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authenticateToken = require("../../middleware/authenticateToken");
const checkAPIKey = require("../../middleware/checkAPIKey");

const Store = mongoose.model("Store");
const User = mongoose.model("User");

require("dotenv").config();

/**
 *
 * Get All Stores
 * Method: GET
 *
 */

router.get("/", checkAPIKey, (req, res) => {
  Store.find({}).then((stores) => {
    res.json({ error: false, message: { data: { stores } } });
  });
});

/**
 *
 * Create Store
 * Method: POST
 *
 */

router.post("/", checkAPIKey, authenticateToken, async (req, res) => {
  const { name, locations, workers } = req.body;

  if (!name || !locations) {
    return res.json({ error: true, message: "Please fill out all fields" });
  }

  let isDuplicate = false;

  await Store.find({ identifier: req.user.email }).then((stores) => {
    if (stores.length > 0) {
      let duplicate = stores.find((e) => {
        return e.name === name;
      });

      if (duplicate) {
        isDuplicate = true;
      }
    }
  });

  if (isDuplicate) {
    return res.json({
      error: true,
      message: "A store with that name has already been registered by you",
    });
  }

  const newStore = new Store({
    name: name,
    workers,
    locations,
    identifier: req.user.email,
    transactions: [],
  });

  newStore.save().then((storeDoc) => {
    const stores = req.user.stores;
    stores.push({ _id: storeDoc._id, name: storeDoc.name });
    User.findOneAndUpdate({ _id: req.user }, { $set: { stores } }).then(() => {
      res.json({
        error: false,
        message: "Created Store Successfully",
      });
    });
  });
});

/**
 *
 * Delete Store
 * Method: DELETE
 *
 */

router.delete("/:id", checkAPIKey, authenticateToken, (req, res) => {
  Store.findOneAndDelete({ _id: req.params.id }).then((deletedStoreDoc) => {
    if (!deletedStoreDoc) {
      return res.json({
        error: true,
        message: "No store found with that ID",
      });
    }
    let stores = req.user.stores;
    stores = stores.filter((store) => {
      if (store._id !== deletedStoreDoc._id) {
        return store;
      }
    });
    console.log(stores);
    User.findOneAndUpdate({ _id: req.user._id }, { $set: { stores } }).then(
      (userDoc) => {
        res.json({ error: false, message: "Deleted Store Successfully" });
      }
    );
  });
});

module.exports = router;
