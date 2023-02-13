const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const MaskData = require("maskdata");

require("dotenv").config();

if (!("toJSON" in Error.prototype))
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      const alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    // const emailMask2Options = {
    //   maskWith: "*",
    //   unmaskedStartCharactersBeforeAt: 3,
    //   unmaskedEndCharactersAfterAt: 4,
    //   maskAtTheRate: false,
    // };
    // const email = req.body.email;
    // const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

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
      // console.log(error);
      .catch((error) => {
        res.status(500).json({
          // error: error,
          error: error.message,
        });
      });
  });
};

exports.login = (req, res, next) => {
  // const emailMask2Options = {
  //   maskWith: "*",
  //   unmaskedStartCharactersBeforeAt: 3,
  //   unmaskedEndCharactersAfterAt: 4,
  //   maskAtTheRate: false,
  // };
  // const email = req.body.email;
  // const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: new Error("User not found"),
          // error: "User not found",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // const message = new Error("Invalid password");
            return res.status(401).json({
              // Why this format when on the network tab it gives this: {"error":{}}
              error: new Error("Invalid password"),
              // This seems like to work better giving the following in the network tab: {"error":"Invalid password"}
              // error: "Invalid password",
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
            // "error: error" returns this -> {"error":{}} for some reason...
            error: error,
            // error: "Error on the server side!",
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        // error: "Error on the server side!",
      });
    });
};
