// API Configuration
const getApiUrl = () => {
  console.log('getApiUrl called with:', {
    DEV: import.meta.env.DEV,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    MODE: import.meta.env.MODE
  });
  
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    const devUrl = "http://localhost:5000/api";
    console.log('Using development URL:', devUrl);
    return devUrl;
  }
  // In production, use environment variable or fallback to your Vercel backend URL
  const prodUrl = import.meta.env.VITE_BACKEND_URL || "https://vamsi-portfolio-backend.vercel.app/api";
  console.log('Using production URL:', prodUrl);
  return prodUrl;
};

export const API_BASE_URL = getApiUrl();

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL); 