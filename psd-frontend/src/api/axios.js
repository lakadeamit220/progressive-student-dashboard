import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 Unauthorized, the token has expired or is invalid
      localStorage.removeItem('token');
      // Redirecting to login can be handled by the router or by forcing a reload
      // But clearing the token ensures ProtectedRoute will kick them out
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default api;
