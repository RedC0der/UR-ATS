const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  keywords: [{
    word: String,
    found: Boolean
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', ResultSchema);