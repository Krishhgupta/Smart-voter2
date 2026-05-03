import axios from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api'),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract the custom backend error message
    const customMessage = error.response?.data?.error;
    
    // Override the generic Axios message so the frontend can display it
    if (customMessage) {
      error.message = customMessage;
    }
    
    // Only show the generic fallback toast if there isn't a custom message handled by the component
    if (error.response && error.response.status >= 500 && !customMessage) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
