const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null // null means currently working
  },
  description: {
    type: String,
    default: ''
  },
  highlights: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
