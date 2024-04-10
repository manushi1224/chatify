const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = await req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication failed!" });
    }
    const decodedToken = jwt.verify(token, "secret is secret");
    next();
  } catch (err) {
    const error = new Error("Authentication failed!", 401);
    return res.status(401).json({ message: "Authentication failed!" });
  }
};
