require("dotenv").config();

function checkAPIKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.send({ error: true, message: "No API Key provided" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.send({ error: true, message: "Invalid API Key" });
  }

  next();
}

module.exports = checkAPIKey;
