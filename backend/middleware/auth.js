const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    // Maybe this line is useless? If no token it seem it goes to line 13
    // if (token == null) return res.status(401).json({ message: "Authentication failed!" });
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // const error = { message: "Invalid request"}
    next();
  } catch {
    res.status(401).json({
      // error: new Error("Invalid request"),
      error: "Invalid request",
    });
  }
};
