const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  participatedVotings: {
    type: [String],
    default: undefined,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('User', userSchema);
