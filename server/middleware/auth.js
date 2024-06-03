const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ error: "You must be logged in to perform this action" });
};

module.exports = { isAuthenticated };