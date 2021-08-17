const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  createUser: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    default: Date.now(),
  },
  options: [
    {
      option: {
        type: String,
        required: true,
      },
      votingCount: {
        type: Number,
        default: 0,
      },
    },
  ],
}, {
  versionKey: false,
});

module.exports = mongoose.model('Vote', voteSchema);
