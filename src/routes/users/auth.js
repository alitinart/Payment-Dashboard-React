const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAPIKey = require("../../middleware/checkAPIKey");
const generateAccessToken = require("../../functions/generateAccessToken");
const authenticateToken = require("../../middleware/authenticateToken");

const User = mongoose.model("User");
const Store = mongoose.model("Store");
const RefreshToken = mongoose.model("RefreshToken");

require("dotenv").config();

/**
 *
 * Register
 * Method: POST
 *
 */

router.post("/register", checkAPIKey, (req, res) => {
  const { fullName, password, email, role, storeIdentifier, storeName } =
    req.body;

  User.findOne({ email: email }).then(async (user) => {
    if (user) {
      return res.json({
        error: true,
        message: "User with that email already exists.",
      });
    }
    if (!fullName || !password || !email || !role) {
      return res.json({
        error: true,
        message: "Please fill out all of the fields",
      });
    }
    if (role !== "Worker") {
      try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
          fullName,
          password: hashedPassword,
          email,
          stores: [],
          role,
        });

        newUser.save();

        res.json({ error: false, message: "Successfully Registered" });
      } catch (err) {
        return res.json({ error: true, message: err.message });
      }
    } else if (role === "Worker") {
      if (!storeIdentifier || !storeName) {
        return res.json({
          error: true,
          message: "Please fill out all the fields",
        });
      }

      try {
        let store = {};

        await Store.findOne({
          identifier: storeIdentifier,
          name: storeName,
        }).then((storeDoc) => {
          store = storeDoc;
        });

        if (!store) {
          return res.json({
            error: true,
            message: "No store found with that identifier",
          });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
          fullName,
          password: hashedPassword,
          email,
          store: { name: store.name, _id: store._id, status: "Pending" },
          role,
        });

        newUser.save();

        let storeWorkers = store.workers;

        let newWorker = {
          fullName,
          _id: newUser._id,
          status: "Pending",
        };

        storeWorkers.push(newWorker);

        await Store.findOneAndUpdate(
          {
            identifier: storeIdentifier,
            name: storeName,
          },
          { $set: { workers: storeWorkers } }
        );

        res.json({ error: false, message: "Successfully Registered" });
      } catch (err) {
        return res.json({ error: true, message: err.message });
      }
    }
  });
});

/**
 *
 * Login
 * Method: POST
 *
 */

router.post("/login", checkAPIKey, async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.json({
        error: true,
        message: "There is no user with that email",
      });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken(JSON.stringify(user));
        const refreshToken = jwt.sign(
          JSON.stringify(user),
          process.env.REFRESH_TOKEN_SECRET
        );

        const newRefreshToken = new RefreshToken({
          refreshToken,
        });

        newRefreshToken.save();

        res.json({
          error: false,
          message: {
            data: {
              accessToken,
              refreshId: newRefreshToken._id,
            },
          },
        });
      } else {
        res.json({ error: true, message: "Password is incorrect" });
      }
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });
});

/**
 *
 * Logout
 * Method: POST
 *
 */

router.post("/logout", checkAPIKey, authenticateToken, (req, res) => {
  const { refreshId } = req.body;
  if (!refreshId) {
    return res.send({ error: true, message: "No Refresh Token ID provided" });
  }
  RefreshToken.findOneAndDelete({ _id: refreshId }).then((refreshToken) => {
    res.json({ error: false, message: "Logged Out Successfully" });
  });
});

module.exports = router;
