const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();

// if (!("toJSON" in Error.prototype))
//   Object.defineProperty(Error.prototype, "toJSON", {
//     value: function () {
//       const alt = {};

//       Object.getOwnPropertyNames(this).forEach(function (key) {
//         alt[key] = this[key];
//       }, this);

//       return alt;
//     },
//     configurable: true,
//     writable: true,
//   });

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "User added successfully!",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
        });
      });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          // error: new Error("User not found"),
          error: "Invalid username or password",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              // error: new Error("Invalid username or password"),
              error: "Invalid username or password",
            });
          }
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24H" });
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
      });
    });
};
