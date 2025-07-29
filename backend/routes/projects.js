import express from 'express';
import Project from '../models/Project.js';
import { upload, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new project
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received project data:', req.body);
    console.log('Received file:', req.file);

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ 
        message: 'Title is required',
        details: { title: { message: 'Title field is required' } }
      });
    }
    if (!req.body.description) {
      return res.status(400).json({ 
        message: 'Description is required',
        details: { description: { message: 'Description field is required' } }
      });
    }
    if (!req.body.technologies) {
      return res.status(400).json({ 
        message: 'Technologies are required',
        details: { technologies: { message: 'Technologies field is required' } }
      });
    }
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Project image is required',
        details: { image: { message: 'Project image is required' } }
      });
    }

    // Parse technologies from JSON string
    let technologies;
    try {
      technologies = JSON.parse(req.body.technologies);
      if (!Array.isArray(technologies) || technologies.length === 0) {
        return res.status(400).json({
          message: 'Invalid technologies format',
          details: { technologies: { message: 'Technologies must be a non-empty array' } }
        });
      }
    } catch (e) {
      return res.status(400).json({
        message: 'Invalid technologies format',
        details: { technologies: { message: 'Technologies must be a valid JSON array' } }
      });
    }

    const projectData = {
      ...req.body,
      technologies,
      image: {
        public_id: req.file.filename,
        url: req.file.path
      }
    };

    console.log('Creating project with data:', projectData);
    
    // Create and save project
    const project = new Project(projectData);
    const validationError = project.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: 'Validation error',
        details: validationError.errors
      });
    }

    await project.save();
    console.log('Project created successfully:', project);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ 
      message: 'Error creating project',
      error: error.message,
      details: error.errors
    });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 