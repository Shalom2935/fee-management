// lib/api.ts
// Centralized API logic for the application. Add endpoints and custom logic as needed.

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// You can set your base URL here or load from environment variables
const BASE_URL = process.env.API_BASE_URL;

// Create an Axios instance for the app
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add default headers here if needed
  },
  // You can add more config options here
});

// Optional: Add interceptors for request/response if you want global error handling, auth, etc.
// apiClient.interceptors.request.use(
//   (config) => {
//     // Modify config (e.g., add token)
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle global errors
//     return Promise.reject(error);
//   }
// );

export default apiClient;

// Usage:
// import apiClient from '@/lib/api';
// apiClient.get('/your-endpoint');
