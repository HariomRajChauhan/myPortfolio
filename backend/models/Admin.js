import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  // Constant value with a unique index. This makes "only one admin can ever
  // exist" an atomic database guarantee: a concurrent second registration
  // fails with a duplicate-key error instead of creating a second account.
  singleton: {
    type: String,
    default: 'primary',
    unique: true,
    immutable: true,
    select: false
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
