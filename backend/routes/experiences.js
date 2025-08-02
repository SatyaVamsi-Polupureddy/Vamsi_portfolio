import express from 'express';
import Experience from '../models/Experience.js';
import { upload, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new experience
router.post('/', upload.single('companyLogo'), async (req, res) => {
  try {
    console.log('Received experience data:', req.body);
    console.log('Received file:', req.file);

    // Validate required fields first
    if (!req.body.jobTitle) {
      return res.status(400).json({ 
        message: 'Job title is required',
        details: { jobTitle: { message: 'Job title field is required' } }
      });
    }
    if (!req.body.company) {
      return res.status(400).json({ 
        message: 'Company is required',
        details: { company: { message: 'Company field is required' } }
      });
    }
    if (!req.body.description) {
      return res.status(400).json({ 
        message: 'Description is required',
        details: { description: { message: 'Description field is required' } }
      });
    }
    if (!req.body.startDate) {
      return res.status(400).json({ 
        message: 'Start date is required',
        details: { startDate: { message: 'Start date field is required' } }
      });
    }

    const experienceData = { ...req.body };
    
    // Parse technologies and achievements from JSON strings
    if (experienceData.technologies) {
      try {
        experienceData.technologies = JSON.parse(experienceData.technologies);
        if (!Array.isArray(experienceData.technologies)) {
          experienceData.technologies = [];
        }
      } catch (e) {
        console.error('Error parsing technologies:', e);
        experienceData.technologies = [];
      }
    }

    if (experienceData.achievements) {
      try {
        experienceData.achievements = JSON.parse(experienceData.achievements);
        if (!Array.isArray(experienceData.achievements)) {
          experienceData.achievements = [];
        }
      } catch (e) {
        console.error('Error parsing achievements:', e);
        experienceData.achievements = [];
      }
    }

    // Handle company logo upload
    if (req.file) {
      try {
        experienceData.companyLogo = {
          public_id: req.file.filename,
          url: req.file.path
        };
      } catch (error) {
        console.error('Error processing company logo:', error);
        return res.status(400).json({
          message: 'Error processing company logo upload',
          error: error.message
        });
      }
    }

    console.log('Creating experience with data:', experienceData);
    
    // Create and save experience
    const experience = new Experience(experienceData);
    const validationError = experience.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: 'Validation error',
        details: validationError.errors
      });
    }

    await experience.save();
    
    console.log('Experience created successfully:', experience);
    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    
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
        error: 'An experience with this title already exists'
      });
    }

    res.status(500).json({ 
      message: 'Error creating experience',
      error: error.message,
      details: error.errors || error.stack
    });
  }
});

// Update experience
router.put('/:id', upload.single('companyLogo'), async (req, res) => {
  try {
    console.log('Updating experience:', req.params.id);
    console.log('Update data:', req.body);
    console.log('Update file:', req.file);

    const experienceData = { ...req.body };
    
    // Parse technologies and achievements from JSON strings
    if (experienceData.technologies) {
      try {
        experienceData.technologies = JSON.parse(experienceData.technologies);
        if (!Array.isArray(experienceData.technologies)) {
          experienceData.technologies = [];
        }
      } catch (e) {
        console.error('Error parsing technologies:', e);
        experienceData.technologies = [];
      }
    }

    if (experienceData.achievements) {
      try {
        experienceData.achievements = JSON.parse(experienceData.achievements);
        if (!Array.isArray(experienceData.achievements)) {
          experienceData.achievements = [];
        }
      } catch (e) {
        console.error('Error parsing achievements:', e);
        experienceData.achievements = [];
      }
    }

    // Handle company logo upload
    if (req.file) {
      // Delete old logo if it exists
      const oldExperience = await Experience.findById(req.params.id);
      if (oldExperience && oldExperience.companyLogo && oldExperience.companyLogo.public_id) {
        console.log('Deleting logo from Cloudinary:', oldExperience.companyLogo.public_id);
        await cloudinary.uploader.destroy(oldExperience.companyLogo.public_id);
      }

      experienceData.companyLogo = {
        public_id: req.file.filename,
        url: req.file.path
      };
    }

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      experienceData,
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    console.log('Experience updated successfully:', experience);
    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(400).json({ 
      message: 'Error updating experience',
      error: error.message,
      details: error.errors
    });
  }
});

// Delete experience
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting experience:', req.params.id);
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    // Delete company logo from Cloudinary if it exists
    if (experience.companyLogo && experience.companyLogo.public_id) {
      console.log('Deleting logo from Cloudinary:', experience.companyLogo.public_id);
      await cloudinary.uploader.destroy(experience.companyLogo.public_id);
    }

    await experience.deleteOne();
    console.log('Experience deleted successfully');
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ 
      message: 'Error deleting experience',
      error: error.message
    });
  }
});

export default router; 