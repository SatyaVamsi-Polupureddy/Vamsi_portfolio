import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log environment variables (remove in production)
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});

// Verify required environment variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Missing required Cloudinary environment variables. Please check your .env file.');
  throw new Error('Missing required Cloudinary environment variables');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    resource_type: 'auto'
  }
});

const upload = multer({ storage: storage });

export { cloudinary, upload }; 