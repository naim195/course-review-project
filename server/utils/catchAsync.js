// middleware to handle async functions in Express route handlers
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next); // Executes the async function and forwards errors to Express error handling
  };
};
