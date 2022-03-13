const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

require("dotenv").config();

let user = process.env.EMAIL_USER;
let pass = process.env.EMAIL_PASS;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user,
    pass,
  },
});

router.get("/", (req, res) => {
  let mailOptions = {
    from: user,
    to: user,
    subject: "TEST EMAIL",
    text: "**HI\nWsg**",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({ error: true, message: error });
    }
    res.json({ error: false, message: { text: "Email Sent", data: info } });
  });
});

module.exports = router;
