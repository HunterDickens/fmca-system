// src/axiosInstance.js
import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', // Set your base URL
    headers: {
        'Content-Type': 'application/json',
        // Add other default headers if needed, e.g., Authorization headers
    },
});

// Optionally, you can add interceptors for handling requests and responses globally
axiosInstance.interceptors.request.use(
    (config) => {
        // Add authorization token if needed
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (e.g., token expiration, network issues)
        if (error.response && error.response.status === 401) {
            // Redirect to login or show an error
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;