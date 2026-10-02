import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  role: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
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

export default mongoose.model('Community', communitySchema);
