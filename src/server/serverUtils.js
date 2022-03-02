const express = require("express");
const app = express();

const cors = require("cors");

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Connected to Payment Dashboard API");
});

app.use("/general", require("../routes/index"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`App listening on port ${PORT}`));
