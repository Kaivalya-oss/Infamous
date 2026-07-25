import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('infamous_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for Refresh Token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('infamous_refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');
        
        // Attempt to refresh
        const refreshResponse = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, {
          refreshToken
        });
        
        const newAccessToken = refreshResponse.data.accessToken;
        
        // Save new token
        localStorage.setItem('infamous_token', newAccessToken);
        
        // Update header for original request and retry
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., expired or invalid refresh token), logout
        localStorage.removeItem('infamous_token');
        localStorage.removeItem('infamous_refresh_token');
        localStorage.removeItem('infamous_user');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login?session_expired=true';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
