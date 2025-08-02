// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import skillsRoutes from './routes/skills.js';
import projectsRoutes from './routes/projects.js';
import achievementsRoutes from './routes/achievements.js';
import experiencesRoutes from './routes/experiences.js';

dotenv.config();

const app = express();
// Middleware
const allowedOrigins = [
  'https://vamsi-portfolio-rust.vercel.app',
  'http://localhost:5173',
  'https://vamsi-portfolio.vercel.app',
  'https://vamsi-portfolio-git-main.vercel.app',
  'https://vamsi-portfolio-git-develop.vercel.app',
  // Add any other domains you might use
  'https://vamsi-portfolio-frontend.vercel.app',
  'https://vamsi-portfolio-backend.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If you need to send cookies or authentication headers
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
// app.use('/api/skills', skillsRoutes);
app.get('/', (req, res) => {
  res.send("Vamsi's portfolio backend running!");
});
app.use('/api/projects', projectsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/experiences', experiencesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
