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

  let link = `${
    data.domain
  }/api/v1/users/reset-password?token=${jwt.jwtSignature(
    data.toMail,
    Math.floor(Date.now() / 1000) + 7200
  )}`;

  // Step 2
  let mailOptions = {
    from: "shomancodes@gmail.com",
    to: data.toMail,
    subject: data.subject,
    text: data.text,
    generateTextFromHTML: true,
    html: `<div><h3>Hae ${data.Username} You are recieving this email beacuse you requested to reset your password</h3></div>
      <div><h4>Click on the button bellow and follow the instructions</h4></div>
      <di><h3>Note that after two hours  the link will expire</h3></div>
     <div> <a href=${link}><button>Reset</button></a></div>
     <div><h5>If you believe this email is a mistake kindly ignore it 😊😊</h5></div>`
  };

  // Step 3
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs", err);
    }
    return console.log("Email sent!!!");
  });
};
