const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// middleware to check if user is authenticated with JWT
module.exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.access_token; // get JWT token from cookies

  if (token) {
    try {
      const decoded = jwt.verify(token, secret); // Verify token using JWT secret
      req.user = decoded; // Attach decoded user info to request object
      return next(); // Proceed to next middleware
    } catch (error) {
      console.error("JWT verification error:", error);
      return res.status(401).json({ message: "Unauthorized", user: null }); // Unauthorized if token verification fails
    }
  } else {
    console.error("User is not authenticated");
    return res.status(401).json({ message: "Unauthorized", user: null }); // Unauthorized if no token found
  }
};
