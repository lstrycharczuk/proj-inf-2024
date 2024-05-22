const nodemailer = require('nodemailer');
require("dotenv").config();
const express = require("express");
const mailRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});
const getCodeAsync = async (email) => {
    try {
      const resp = await fetch(`http://localhost:3000/api/users?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await resp.json();
      return response.auth;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  };
  

const sendMailAsync = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.log('Error occurred:', error);
    throw error;
  }
}

mailRouter.post("/", async (req, res) => {
  const { email, auth } = req.body;

  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Elo elo 320 kod',
      text: `Yo bro tu masz swoj sigma rizzler kod ${auth}`
    };

    await sendMailAsync(mailOptions);
    res.json({ message: "Email sent" });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = mailRouter;
