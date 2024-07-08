const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

module.exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log('Checking if user is logged in with token:', token);

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded; // Attach the decoded user info to the request object
      console.log(decoded);
      console.log('User is authenticated with JWT:', decoded);
      return next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Unauthorized', user: null });
    }
  } else {
    console.error('User is not authenticated');
    return res.status(401).json({ message: 'Unauthorized', user: null });
  }
};
