const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for an instructor
const instructorSchema = new Schema({
  // instructor name
  name: String,

  // Array of references to Review documents
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  // Average rating of instructor
  averageRating: {
    type: Number,
    default: 0,
  },
});

// Export the Instructor model
module.exports = mongoose.model("Instructor", instructorSchema);
