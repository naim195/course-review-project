const yup = require("yup");

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
  assignmentDifficulty: yup
    .number()
    .required("Assignment Difficulty is required")
    .oneOf([1, 2, 3, 4, 5], "Assignment Difficulty must be between 1 and 5"),
  examDifficulty: yup
    .number()
    .required("Exam Difficulty is required")
    .oneOf([1, 2, 3, 4, 5], "Exam Difficulty must be between 1 and 5"),
  textReview: yup
    .string()
    .required("Text Review is required")
    .min(10, "Text Review must be at least 10 characters")
    .max(1000, "Text Review cannot be more than 1000 characters"),
});

module.exports = {
  reviewSchema,
};
