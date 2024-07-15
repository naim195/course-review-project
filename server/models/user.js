const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for a user
const userSchema = new Schema({
  // The Google ID of the user, used to check if the user exists in the database
  googleId: {
    type: String,
    required: true,
    unique: true,
  },

  // display name of the user
  displayName: {
    type: String,
    required: true,
  },

  // email address of the user
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // Array of references to Review documents created by the user
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
