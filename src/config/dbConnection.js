const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGO_DB, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Successfully connected to MongoDB");
});

require("../database/schemas/User.schema");
require("../database/schemas/Store.schema");
require("../database/schemas/RefreshToken.schema");
