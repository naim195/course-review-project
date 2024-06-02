const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
