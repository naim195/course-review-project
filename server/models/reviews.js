const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for a review
const reviewSchema = new Schema({
  // overall rating for the course
  rating: Number,

  // effort required to achieve a good grade in the course
  effortForGoodGrade: Number,

  // overall difficulty of the course
  overallDifficulty: Number,

  // Array of ratings for instructors associated with the course
  instructorRating: [
    {
      // Reference to the Instructor document
      instructorId: {
        type: Schema.Types.ObjectId,
        ref: "Instructor",
      },
      // instructor rating
      rating: Number,
    },
  ],

  // The grade received by the author in the course
  grade: String,

  // The text content of the review
  textReview: String,

  // Reference to the User document representing the author of the review
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);
