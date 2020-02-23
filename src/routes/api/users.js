const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const validateRegisterInput = require("../../validations/register");
const validateLoginInput = require("../../validations/login");
const User = require("../../models/users");
const passport = require("passport");
import { sendMail as resetPassword } from "../../googleservices/reset";
import { sendMail as verifyEmail } from "../../googleservices/email";
import { sendMail as successMail } from "../../googleservices/success";
import { jwtVerify } from "../../validations/jwtService";

router.post("/register", (req, res) => {
  const domain = req.protocol + "://" + req.get("host");
  req.body.domain = domain;
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        Username: req.body.Username,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user =>
              res.json({
                message:
                  "Account created successfuly check your email to verify your email address",
                user
              })
            )
            .catch(err => console.log(err));
        });
      });
      verifyEmail({
        toMail: req.body.email,
        subject: "Verify Your Email",
        text: "Kindly Verify your Email address",
        domain: domain,
        Username: req.body.Username
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          Username: user.Username
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    User.find(function(err, user) {
      if (err) {
        var err = new Error("error occured");
        return next(err);
      }
      res
        .status(200)
        .json({ message: "All users retrived successfully", user });
    });
  }
);

router.post("/forgot-password", (req, res) => {
  const domain = req.protocol + "://" + req.get("host");
  req.body.domain = domain;
  const Email = req.body.email;
  User.findOne({ email: Email }).then(user => {
    if (!user) {
      res
        .status(404)
        .json({ message: "No user with that email Address exists" });
    } else {
      res.status(200).json({
        message:
          "An email was sent to your email address Follow the instructions to reset your email"
      });
      resetPassword({
        toMail: req.body.email,
        subject: "Resquest for password change",
        text:
          "You are receiving this email because you requested to change your password. If this eamil was sent by mistake kindly ignore",
        domain: domain,
        Username: user.Username
      });
    }
  });
});

router.put("/reset-password", (req, res) => {
  const domain = req.protocol + "://" + req.get("host");
  req.body.domain = domain;
  const token = req.query.token;
  const Email = jwtVerify(token);
  if (Email.message === "jwt expired Not valid") {
    res.status(400).json({
      message:
        "Request couldnot be completed at the moment request for password reset again"
    });
  }
  User.findOne({ email: Email }).then(user => {
    if (!user) {
      res.status(404).json({ message: "User doesnot exist" });
    } else {
      user.password = req.body.password;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user =>
              res.status(200).json({ message: "password was changed", user })
            )
            .catch(err => console.log(err));
        });
        successMail({
          toMail: user.email,
          subject: "Your Password was successfully changed ",
          text: "Kindly Verify your Email address",
          domain: domain,
          Username: user.Username
        });
      });
    }
  });
});

module.exports = router;
