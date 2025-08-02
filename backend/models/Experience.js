import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    default: null
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  technologies: {
    type: [String],
    default: []
  },
  achievements: {
    type: [String],
    default: []
  },
  companyLogo: {
    public_id: String,
    url: String
  }
}, {
  timestamps: true
});

// Add validation to ensure endDate is required if not current position
experienceSchema.pre('validate', function(next) {
  if (!this.isCurrent && !this.endDate) {
    this.invalidate('endDate', 'End date is required for past positions');
  }
  next();
});

export default mongoose.model('Experience', experienceSchema); 