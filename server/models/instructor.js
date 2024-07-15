const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for Instructor collection
const instructorSchema = new Schema({
  name: String, // Instructor's name

  ratings: [
    {
      // Array of review IDs referencing the "Review" model
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  averageRating: {
    // Average rating of the instructor
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Instructor", instructorSchema);
