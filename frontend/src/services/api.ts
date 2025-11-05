import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR' | 'CLIENT_ADMIN';
  companyId: number | null;
  company?: Company;
}

export interface Company {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: number;
  name: string;
  plateNo: string;
  deviceId: number;
  device?: {
    id: number;
    deviceId: string;
  };
}

export interface Order {
  id: number;
  code: string;
  companyId: number;
  origin: string;
  destination: string;
  vehicleId: number | null;
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  createdById: number;
  assignedToId: number | null;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  vehicle?: Vehicle;
  createdBy?: User;
  assignedTo?: User;
}

export interface LocationPing {
  id: number;
  vehicleId: number;
  lat: number;
  lng: number;
  speedKph?: number;
  heading?: number;
  at: string;
}

// API Methods
export const authApi = {
  login: (email: string) => api.post<{ user: User }>('/api/auth/login', { email }),
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