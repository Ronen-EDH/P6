const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauces");

const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(`mongodb+srv://${process.env.MONGODB_User}:${process.env.MONGODB_PW}@cluster0.xcz0hre.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

// const data = { name: "Best sauce", manufacturer: "Best manufacturer", description: "desc.", mainPepper: "Ghost Pepper", heat: 8 };

// const onlyName = data.name;
// console.log("onlyName:", onlyName);

/* const string = "asda.gt_012.jpg";
const breakpoint = /.(?=[^.]+$)/;
const stringNoExtension = string.split(breakpoint)[0];

// /\.(?=[^\.]+$)/

app.use((req, res) => {
  res.json({ message: stringNoExtension });
}); */

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;
