const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  code: String,
  credits: Number,
  instructor: [
    {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
    },
  ],
  category: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  avgOverallDifficulty: {
    type: Number,
    default: 0,
  },
  avgEffortForGoodGrade: {
    type: Number,
    default: 0,
  },
  avgRating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Course", courseSchema);
