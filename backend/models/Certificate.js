import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  credentialUrl: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: '/placeholder-certificate.png'
  }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
