// Custom error class for Express
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message; // Error message
    this.statusCode = statusCode; // HTTP status code for the error
  }
}

module.exports = ExpressError;
