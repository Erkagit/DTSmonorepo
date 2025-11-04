import { Delivery, User, DeliveryStatusEnum } from '@/types/delivery';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface TelemetryResponse {
  vehicleId: number;
  vehicle?: {
    device?: {
      deviceId: string;
    };
  };
  lat: number;
  lng: number;
  speedKph?: number;
  heading?: number;
  at: string;
}

export const deliveryService = {
  // Get all deliveries
  async getDeliveries(): Promise<Delivery[]> {
    const response = await fetch(`${API_BASE_URL}/deliveries`);
    if (!response.ok) {
      throw new Error('Failed to fetch deliveries');
    }
    return response.json();
  },

  // Get a single delivery by ID
  async getDelivery(id: string): Promise<Delivery> {
    const response = await fetch(`${API_BASE_URL}/deliveries/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch delivery');
    }
    return response.json();
  },

  // Update delivery status
  async updateDeliveryStatus(id: string, newStatus: DeliveryStatusEnum): Promise<Delivery> {
    const response = await fetch(`${API_BASE_URL}/deliveries/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_status: newStatus }),
    });
    if (!response.ok) {
      throw new Error('Failed to update delivery status');
    }
    return response.json();
  },
};

export const telemetryService = {
  // Get latest telemetry data for all vehicles
  async getLatestTelemetry(): Promise<TelemetryResponse[]> {
    const response = await fetch(`${API_BASE_URL}/telemetry/latest`);
    if (!response.ok) {
      throw new Error('Failed to fetch telemetry');
    }
    return response.json();
  },

  // Get telemetry for a specific vehicle
  async getVehicleTelemetry(vehicleId: number): Promise<TelemetryResponse[]> {
    const response = await fetch(`${API_BASE_URL}/telemetry/vehicle/${vehicleId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vehicle telemetry');
    }
    return response.json();
  },
};

// Mock user data for now
export const userService = {
  async getCurrentUser(): Promise<User> {
    // In a real app, this would fetch from the API
    return {
      role: 'Admin',
      username: 'Batchuluun',
    };
  },
};
