# Deployment Guide

This guide explains how to deploy your portfolio application to work in both development and production environments.

## Development Setup

### Frontend (React/Vite)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

### Backend (Node.js/Express)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with your MongoDB URI:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

## Production Deployment (Vercel)

### Backend Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the following environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`

4. Deploy the backend

### Frontend Deployment
1. Update the API configuration in `frontend/src/config/api.js`:
   ```javascript
   // Replace 'your-backend-domain.vercel.app' with your actual backend Vercel URL
   return import.meta.env.VITE_API_URL || "https://your-backend-domain.vercel.app/api";
   ```

2. Set the environment variable in Vercel:
   - `VITE_API_URL`: `https://your-backend-domain.vercel.app/api`

3. Deploy the frontend

## Environment Variables

### Frontend (.env file)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env file)
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (development)
- `https://vamsi-portfolio-rust.vercel.app` (production)
- `https://vamsi-portfolio.vercel.app` (production)
- And other Vercel preview URLs

## Troubleshooting

### CORS Errors
If you encounter CORS errors:
1. Check that your frontend URL is in the `allowedOrigins` array in `backend/server.js`
2. Ensure the backend is running and accessible
3. Verify environment variables are set correctly

### API Connection Issues
1. Check that the `VITE_API_URL` environment variable is set correctly
2. Verify the backend is deployed and accessible
3. Check the browser console for any network errors

### Database Connection Issues
1. Verify your MongoDB URI is correct
2. Check that your MongoDB cluster allows connections from your IP/Vercel
3. Ensure the database user has the correct permissions 