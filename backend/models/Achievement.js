import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: {
      type: String,
      enum: ['single', 'period'],
      default: 'single'
    },
    singleDate: {
      type: Date,
      required: false
    },
    startDate: {
      type: Date,
      required: false
    },
    endDate: {
      type: Date,
      required: false
    }
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: ['Certification', 'Award', 'Competition', 'Publication', 'Other'],
      message: '{VALUE} is not a valid category. Must be one of: Certification, Award, Competition, Publication, Other'
    },
    set: function(value) {
      // Convert to proper case (first letter uppercase, rest lowercase)
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  },
  image: {
    public_id: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    }
  },
  link: {
    type: String
  }
}, {
  timestamps: true
});

// Add a validator to ensure proper date fields are provided based on type
achievementSchema.pre('validate', function(next) {
  if (this.date) {
    if (this.date.type === 'single' && !this.date.singleDate) {
      this.invalidate('date.singleDate', 'Single date is required when type is single');
    }
    if (this.date.type === 'period') {
      if (!this.date.startDate) {
        this.invalidate('date.startDate', 'Start date is required for period type');
      }
      if (!this.date.endDate) {
        this.invalidate('date.endDate', 'End date is required for period type');
      }
      if (this.date.startDate && this.date.endDate && this.date.startDate > this.date.endDate) {
        this.invalidate('date.endDate', 'End date must be after start date');
      }
    }
  }
  next();
});

export default mongoose.model('Achievement', achievementSchema); 