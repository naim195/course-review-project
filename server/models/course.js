const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for a course
const courseSchema = new Schema({
  // course name
  name: String,

  // course code
  code: String,

  // course credits
  credits: Number,

  // Array of references to Instructor documents
  instructor: [
    {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
    },
  ],

  // course category
  category: String,

  // Array of references to Review documents
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // Average overall difficulty of course
  avgOverallDifficulty: {
    type: Number,
    default: 0,
  },

  // Average effort required to achieve a good grade in the course
  avgEffortForGoodGrade: {
    type: Number,
    default: 0,
  },

  // Average rating of the course
  avgRating: {
    type: Number,
    default: 0,
  },
});

// Export the Course model
module.exports = mongoose.model("Course", courseSchema);
