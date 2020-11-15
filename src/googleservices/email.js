const nodemailer = require("nodemailer");
import * as jwt from "../validations/jwtService";

// Step 1
export const sendMail = async data => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shomancodes@gmail.com",
      pass: process.env.PASSWORD
    }
  });

  let link = `${data.domain}/verify-email?token=${jwt.jwtSignature(
    data.toMail
  )}`;

  // Step 2
  let mailOptions = {
    from: "shomancodes@gmail.com",
    to: data.toMail,
    subject: data.subject,
    text: data.text,
    generateTextFromHTML: true,
    html: `<div><h4>Thank you${data.Username} and welcome to the Shoman Mentorship Progmram where we help you levelup  your Skills</h4></div>
    <div><h5>To get started click on the button below to have your eamil verified 😊😊😊.</h5></div>
   <div> <a href=${link}><button>Verify</button></a></div>`
  };

  // Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs", err);
    }
    return console.log("Email sent!!!");
  });
};
