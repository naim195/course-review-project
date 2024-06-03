const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  effortForGoodGrade: Number,
  overallDifficulty: Number,
  assignmentDifficulty: Number,
  examDifficulty: Number,
  grade: String,
  textReview: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
