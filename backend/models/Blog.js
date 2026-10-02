import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 360,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  coverImage: {
    type: String,
    default: null,
    trim: true,
  },
  tags: [{ type: String, trim: true, maxlength: 32 }],
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

blogSchema.pre('save', function setPublishedDate(next) {
  if (this.published && !this.publishedAt) this.publishedAt = new Date();
  if (!this.published) this.publishedAt = null;
  next();
});

export default mongoose.model('Blog', blogSchema);
