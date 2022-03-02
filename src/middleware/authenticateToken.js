require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (accessToken === null) {
    return res.json({ error: true, message: "No Access Token Provided" });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.json({ error: true, message: "Forbbiden" });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
