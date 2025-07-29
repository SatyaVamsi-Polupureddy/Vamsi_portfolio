// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import skillsRoutes from './routes/skills.js';
import projectsRoutes from './routes/projects.js';
import achievementsRoutes from './routes/achievements.js';

dotenv.config();

const app = express();
// Middleware
const corsOptions = {
  origin: [
    'https://vamsi-portfolio-rust.vercel.app',
    'http://localhost:5173',  // For local development
    'http://localhost:3000'   // Alternative local development port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
