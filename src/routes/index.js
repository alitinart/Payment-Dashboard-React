const express = require("express");
const checkAPIKey = require("../middleware/checkAPIKey");
const router = express.Router();

require("dotenv").config();

router.use("/users", require("./users/index"));
router.use("/tokens", require("./tokens/index"));
router.use("/stores", require("./stores/index"));
router.use("/transactions", require("./transactions/index"));
router.use("/emails", require("./emails/index"));

router.get("/", checkAPIKey, (req, res) => {
  res.send("Connected to Dashboard API V.I.A API Key");
});

module.exports = router;
