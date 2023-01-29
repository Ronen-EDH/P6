const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.MONGODB_User}:${process.env.MONGODB_PW}@cluster0.xcz0hre.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

// app.use((req, res) => {
//   res.json({ message: 'Hello from the web server!' })
// });

app.use('/api/auth', userRoutes);

module.exports = app;