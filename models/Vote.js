const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  createUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    default: new Date().toISOString(),
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
  versionKey: false
});

module.exports = mongoose.model('Vote', voteSchema);
