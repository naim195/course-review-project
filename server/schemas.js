const yup = require("yup");

// Schema for a review object
const reviewSchema = yup.object({
  rating: yup
    .number()
    .required("Rating is required")
    .oneOf([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], "Invalid rating value"),
  effortForGoodGrade: yup
    .number()
    .required("Effort for Good Grade is required")
    .oneOf([1, 2, 3, 4, 5], "Effort for Good Grade must be between 1 and 5"),
  overallDifficulty: yup
    .number()
    .required("Overall Difficulty is required")
    .oneOf([1, 2, 3, 4, 5], "Overall Difficulty must be between 1 and 5"),
  grade: yup.string().oneOf(["A", "A-", "B", "B-", "C", "C-", "D", "E"]),
  textReview: yup.string(),
});

// Schema for a user object
const userSchema = yup.object({
  googleId: yup.string().required("UID is required"),
  displayName: yup.string().required("Display Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
  reviews: yup
    .array()
    .of(yup.string().matches(/^[0-9a-fA-F]{24}$/, "Invalid review ID")),
});

// Schema for an instructor object
const instructorSchema = yup.object({
  name: yup.string().required("Instructor name is required"),
  rating: yup
    .array()
    .of(yup.number().oneOf([1, 2, 3, 4, 5], "Invalid rating value"))
    .required("Rating is required"),
  isAnonymous: yup.boolean().default(false),
});

module.exports = {
  reviewSchema,
  userSchema,
  instructorSchema,
};
