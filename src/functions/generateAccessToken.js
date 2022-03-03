const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(user) {
  return jwt.sign(JSON.parse(user), process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5h",
  });
}
module.exports = generateAccessToken;
