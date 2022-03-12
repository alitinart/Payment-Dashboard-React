const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const generateAccessToken = require("../../functions/generateAccessToken");
const authenticateToken = require("../../middleware/authenticateToken");
const checkAPIKey = require("../../middleware/checkAPIKey");

const User = mongoose.model("User");
const Store = mongoose.model("Store");
const RefreshToken = mongoose.model("RefreshToken");

require("dotenv").config();

router.use("/auth", require("./auth"));

/**
 *
 * Get all users
 *
 */

router.get("/", checkAPIKey, (req, res) => {
  User.find({}).then((users) => res.send(users));
});

/**
 *
 * Delete User
 * Method: DELETE
 *
 */

router.delete("/", checkAPIKey, authenticateToken, async (req, res) => {
  const { refreshId } = req.body;

  if (!refreshId) {
    return res.json({ error: true, message: "No Refresh Token ID provided" });
  }

  await RefreshToken.findOneAndDelete({ _id: refreshId });

  if (req.user.role === "Worker") {
    await Store.findOne({ _id: req.user.store._id }).then(async (store) => {
      if (!store) {
        return;
      }

      let storeWorkers = store.workers;
      storeWorkers = storeWorkers.filter((e) => {
        return e._id.toString() !== req.user._id;
      });

      await Store.findOneAndUpdate(
        { _id: req.user.store._id },
        { $set: { workers: storeWorkers } }
      );

      User.findOneAndDelete({ _id: req.user._id }).then((user) => {
        if (!user) {
          return res.json({
            error: true,
            message: "No user found with that ID",
          });
        }
        res.json({ error: false, message: "User deleted successfully" });
      });
    });
  } else if (req.user.role === "Owner") {
    let stores = req.user.stores;

    stores.forEach(async (e) => {
      await Store.findOneAndDelete({ _id: e._id });
    });

    User.findOneAndDelete({ _id: req.user._id }).then((user) => {
      if (!user) {
        return res.json({
          error: true,
          message: "No user found with that ID",
        });
      }
      res.json({ error: false, message: "User deleted successfully" });
    });
  }
});

/**
 *
 * Update User
 * Method: PATCH
 *
 */

router.patch("/update", checkAPIKey, authenticateToken, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { $set: { ...req.body } }).then(
    (user) => {
      const accessToken = generateAccessToken(JSON.stringify(user));
      res.json({
        error: false,
        message: { text: "Successfully Updated Info", data: { accessToken } },
      });
    }
  );
});

/**
 *
 * Sync User
 * Method: GET
 *
 */

router.get("/sync", checkAPIKey, authenticateToken, (req, res) => {
  User.findOne({ _id: req.user._id }).then((user) => {
    if (!user) {
      return res.json({ error: true, message: "No User Found with that ID" });
    }

    res.json({
      error: false,
      message: {
        text: "Synced User",
        data: { accessToken: generateAccessToken(JSON.stringify(user)) },
      },
    });
  });
});

/**
 *
 * Get User Object
 * Method: GET
 *
 */

router.get("/object", checkAPIKey, authenticateToken, (req, res) => {
  res.json({ error: false, message: { data: req.user } });
});

/**
 *
 * Accept User On Team
 * Method: POST
 *
 */

router.post("/accept", (req, res) => {
  // if (req.user.role !== "Owner") {
  //   return res.json({ error: true, message: "Forbbiden. Not Owner" });
  // }
  const { workerId, judge } = req.body;
  if (judge === "allowed") {
    User.findOne({ _id: workerId }).then((user) => {
      if (!user)
        return res.json({ error: true, message: "No User found with that id" });
      let store = user.store;
      store = { ...store, status: "Accepted" };
      User.findOneAndUpdate({ _id: workerId }, { $set: { store } }).then(() => {
        res.send({ error: false, message: "Accepted Worker" });
      });
    });
  } else if (judge === "not allowed") {
    User.findOne({ _id: workerId }).then((user) => {
      if (!user)
        return res.json({ error: true, message: "No User found with that id" });
      let store = user.store;
      store = { ...store, status: "Denied" };
      User.findOneAndUpdate({ _id: workerId }, { $set: { store } }).then(() => {
        res.send({ error: false, message: "Denied Worker" });
      });
    });
  } else {
    return res.json({ error: true, message: "No Verdict Provided" });
  }
});

// router.delete("/admin/:id", checkAPIKey, async (req, res) => {
//   User.findOneAndDelete({ _id: req.params.id }).then((user) => {
//     if (!user) {
//       return res.json({ error: true, message: "No user found with that ID" });
//     }
//     res.json({ error: false, message: "User deleted successfully" });
//   });
// });

module.exports = router;
