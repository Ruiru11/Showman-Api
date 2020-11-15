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
    html: `<div><h3>Hae ${data.Username} Your password has successfully been changed</h3></div>
      <div><h4>You can now login using your new password</h4></div>
     <div><h5>Thank you for your continued support 😊😊</h5></div>`
  };

  // Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs", err);
    }
    return console.log("Email sent!!!");
  });
};
