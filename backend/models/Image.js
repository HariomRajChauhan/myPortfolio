import mongoose from 'mongoose';

// Images live in one of two places depending on whether Cloudinary is
// configured. Keeping both shapes in one collection means older records
// created before the migration keep resolving through /api/images/:id.
const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  provider: {
    type: String,
    enum: ['mongodb', 'cloudinary'],
    default: 'mongodb',
    index: true
  },
  // provider === 'mongodb': full base64 data URL
  data: {
    type: String,
    required() {
      return this.provider === 'mongodb';
    }
  },
  // provider === 'cloudinary': absolute CDN URL
  url: {
    type: String,
    required() {
      return this.provider === 'cloudinary';
    }
  },
  // provider === 'cloudinary': handle used for deletion
  publicId: {
    type: String,
    required() {
      return this.provider === 'cloudinary';
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// The base64 payload is large and is never needed when listing images.
imageSchema.index({ createdAt: -1 });

export default mongoose.model('Image', imageSchema);
