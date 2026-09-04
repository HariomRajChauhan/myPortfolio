import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  objective: {
    type: String,
    required: true
  },
  techStack: [{
    type: String
  }],
  githubUrl: {
    type: String,
    default: null
  },
  liveUrl: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: '/placeholder-project.png'
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
