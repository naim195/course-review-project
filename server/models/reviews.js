const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  effortForGoodGrade: Number,
  overallDifficulty: Number,
  assignmentDifficulty: Number,
  examDifficulty: Number,
  textReview: String,
});

module.exports = mongoose.model("Review", reviewSchema);
