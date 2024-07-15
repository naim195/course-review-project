const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  effortForGoodGrade: Number,
  overallDifficulty: Number,
  instructorRating: [
    {
      instructorId: {
        type: Schema.Types.ObjectId,
        ref: "Instructor", // Reference to the Instructor model
      },
      rating: Number, //instructor rating
    },
  ],

  grade: String, //grade of reviewer in course
  textReview: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User", //Reference to User model
  },
});

module.exports = mongoose.model("Review", reviewSchema);
