const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

 const transporter = nodemailer.createTransport({
    host: process.env.Email_Host,
    port: 465, //when security true else 568 used for false
    secure: true,
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Pass
    }
  });

  module.exports = transporter;
