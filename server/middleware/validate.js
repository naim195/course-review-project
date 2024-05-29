const { ValidationError } = require("yup");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({
          errors: err.inner.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
};

module.exports = validate;
