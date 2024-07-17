const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // Reference to the Review model for reviews authored by this user
    },
  ],
  isAnonymous: {
    type: Boolean,
    default: false, // store user preference to remain anonymous
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
