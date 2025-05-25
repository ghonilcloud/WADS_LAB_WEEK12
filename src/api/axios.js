import axios from 'axios';

// For debugging CORS issues
console.log('Setting up axios with baseURL: http://localhost:5000/api');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Set to false to match our CORS configuration
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  console.log('Axios request config:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    headers: config.headers,
    withCredentials: config.withCredentials
  });
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Axios response error:', error.message);
    return Promise.reject(error);
  }
);

export default api;