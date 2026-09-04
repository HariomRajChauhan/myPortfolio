import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: null
  },
  visitedAt: {
    type: Date,
    default: Date.now
  }
});

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
