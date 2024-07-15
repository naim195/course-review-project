const { ValidationError } = require("yup");

// middleware function to validate request body against schema
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next(); // Proceed to next middleware if validation passes
    } catch (err) {
      if (err instanceof ValidationError) {
        // Handle Yup validation errors
        return res.status(400).json({
          errors: err.inner.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      next(err); // Pass other errors to the error handler middleware
    }
  };
};

module.exports = validate;
