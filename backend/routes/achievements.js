import express from 'express';
import Achievement from '../models/Achievement.js';
import { upload, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get achievements by category
router.get('/category/:category', async (req, res) => {
  try {
    const achievements = await Achievement.find({ 
      category: req.params.category 
    }).sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new achievement
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received achievement data:', req.body);
    console.log('Received file:', req.file);

    // Validate required fields first
    if (!req.body.title) {
      return res.status(400).json({ 
        message: 'Title is required',
        details: { title: { message: 'Title field is required' } }
      });
    }
    if (!req.body.category) {
      return res.status(400).json({ 
        message: 'Category is required',
        details: { category: { message: 'Category field is required' } }
      });
    }

    // Normalize and validate category
    const category = req.body.category.toLowerCase();
    const validCategories = ['certification', 'award', 'competition', 'publication', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
        details: { category: { message: `Category must be one of: ${validCategories.join(', ')}` } }
      });
    }

    const achievementData = { 
      ...req.body,
      category // Use normalized category
    };
    
    // Parse date data if it exists
    if (achievementData.date) {
      try {
        const parsedDate = JSON.parse(achievementData.date);
        // Validate date structure
        if (parsedDate.type === 'single' && !parsedDate.singleDate) {
          return res.status(400).json({
            message: 'Invalid date format',
            details: { date: { message: 'Single date is required when type is single' } }
          });
        }
        if (parsedDate.type === 'period' && (!parsedDate.startDate || !parsedDate.endDate)) {
          return res.status(400).json({
            message: 'Invalid date format',
            details: { date: { message: 'Both start and end dates are required for period type' } }
          });
        }
        achievementData.date = parsedDate;
      } catch (e) {
        console.error('Error parsing date data:', e);
        // If date is not JSON, assume it's a single date
        achievementData.date = {
          type: 'single',
          singleDate: achievementData.date
        };
      }
    }

    // Handle image upload
    if (req.file) {
      try {
        achievementData.image = {
          public_id: req.file.filename,
          url: req.file.path
        };
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(400).json({
          message: 'Error processing image upload',
          error: error.message
        });
      }
    }

    console.log('Creating achievement with data:', achievementData);
    
    // Create and save achievement
    const achievement = new Achievement(achievementData);
    const validationError = achievement.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: 'Validation error',
        details: validationError.errors
      });
    }

    await achievement.save();
    
    console.log('Achievement created successfully:', achievement);
    res.status(201).json(achievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: error.errors
      });
    }
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate entry',
        error: 'An achievement with this title already exists'
      });
    }

    res.status(500).json({ 
      message: 'Error creating achievement',
      error: error.message,
      details: error.errors || error.stack
    });
  }
});

// Update achievement
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    console.log('Updating achievement:', req.params.id);
    console.log('Update data:', req.body);
    console.log('Update file:', req.file);

    const achievementData = { ...req.body };
    
    // Parse date data if it exists
    if (achievementData.date) {
      try {
        achievementData.date = JSON.parse(achievementData.date);
      } catch (e) {
        console.error('Error parsing date data:', e);
        achievementData.date = {
          type: 'single',
          singleDate: achievementData.date
        };
      }
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      const oldAchievement = await Achievement.findById(req.params.id);
      if (oldAchievement && oldAchievement.image && oldAchievement.image.public_id) {
        console.log('Deleting image from Cloudinary:', oldAchievement.image.public_id);
        await cloudinary.uploader.destroy(oldAchievement.image.public_id);
      }

      achievementData.image = {
        public_id: req.file.filename,
        url: req.file.path
      };
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      achievementData,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    console.log('Achievement updated successfully:', achievement);
    res.json(achievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(400).json({ 
      message: 'Error updating achievement',
      error: error.message,
      details: error.errors
    });
  }
});

// Delete achievement
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting achievement:', req.params.id);
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    // Delete image from Cloudinary if it exists
    if (achievement.image && achievement.image.public_id) {
      console.log('Deleting image from Cloudinary:', achievement.image.public_id);
      await cloudinary.uploader.destroy(achievement.image.public_id);
    }

    await achievement.deleteOne();
    console.log('Achievement deleted successfully');
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ 
      message: 'Error deleting achievement',
      error: error.message
    });
  }
});

export default router; 