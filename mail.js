const nodemailer = require('nodemailer');
require("dotenv").config();
// Create a transporter with the correct SMTP settings for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Define the email options
const mailOptions = {
  from: process.env.EMAIL,
  to: 'your@email.pl',
  subject: 'Elo elo 320 kod',
  text: `Yo bro tu masz swoj sigma rizzler kod ${(Math.floor(Math.random() * 1000000) + 1).toString().padStart(6, '0')}`
};

// Send the email
transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log('Error occurred:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});

