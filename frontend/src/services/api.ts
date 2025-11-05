import axios from 'axios';
import type { User, Company, Vehicle, Order, LocationPing } from '@/types/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

console.log('API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.message, error.config?.url);
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API Methods
export const authApi = {
  login: (email: string, password: string) => api.post<{
    user: User;
    token: string;
    message: string;
  }>('/api/auth/login', { email, password }),
};

export const companiesApi = {
  getAll: () => api.get<Company[]>('/api/companies'),
};

export const usersApi = {
  getAll: () => api.get<User[]>('/api/users'),
};

export const vehiclesApi = {
  getAll: () => api.get<Vehicle[]>('/api/vehicles'),
  sendPing: (vehicleId: number, data: { lat: number; lng: number; speedKph?: number; heading?: number }) =>
    api.post<LocationPing>(`/api/vehicles/${vehicleId}/ping`, data),
};

export const ordersApi = {
  getAll: () => api.get<Order[]>('/api/orders'),
  create: (data: { code: string; origin: string; destination: string; vehicleId?: number; companyId?: number }) =>
    api.post<Order>('/api/orders', data),
};

export default api;
