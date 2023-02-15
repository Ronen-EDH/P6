const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.auth = decodedToken;
    next();
  } catch {
    res.status(401).json({
      error: "Invalid request",
    });
  }
};
