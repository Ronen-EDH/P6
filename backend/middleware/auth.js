const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401);
    console.log("token:", token);
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    userId = decodedToken.userId;
    console.log("User ID:", userId);
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request"),
    });
  }
};
