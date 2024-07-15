const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for Course collection
const courseSchema = new Schema({
  name: String, // Course name
  code: String, // Course code
  credits: Number, // Number of credits for the course
  instructor: [
    {
      // Array of instructor IDs referencing the "Instructor" model
      type: Schema.Types.ObjectId,
      ref: "Instructor",
    },
  ],
  category: String, // Course category
  reviews: [
    {
      // Array of review IDs referencing the "Review" model
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  avgOverallDifficulty: {
    // Average overall difficulty of the course
    type: Number,
    default: 0,
  },
  avgEffortForGoodGrade: {
    // Average effort required for a good grade
    type: Number,
    default: 0,
  },
  avgRating: {
    // Average rating of the course
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Course", courseSchema);
