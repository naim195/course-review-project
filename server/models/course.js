const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: String,
  code: String,
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
});

module.exports = mongoose.model("Course", courseSchema);
