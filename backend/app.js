const express = require('express');

const app = express();

app.use((req, res) => {
  res.json({ message: 'Hello from the web server!' })
});


module.exports = app;