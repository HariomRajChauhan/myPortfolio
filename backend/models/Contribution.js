import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 140,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    maxlength: 48,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  link: {
    type: String,
    default: null,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('Contribution', contributionSchema);
