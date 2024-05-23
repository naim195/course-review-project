const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const courseSchema = new Schema({
  name: String,
  code: String,
  instructor: [String],
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
