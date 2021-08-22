const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  participatedVotings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vote',
    }
  ],
}, {
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
