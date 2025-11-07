'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '@/services/api';
import api from '@/services/api';
import { Truck, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { PageHeader, Button, EmptyState } from '@/components/ui';
import { CreateVehicleModal, CreateDeviceModal, VehicleCard } from './components';

export default function VehiclesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateVehicle, setShowCreateVehicle] = useState(false);
  const [showCreateDevice, setShowCreateDevice] = useState(false);
  
  const [vehicleForm, setVehicleForm] = useState({
    plateNo: '',
    driverName: '',
    driverPhone: '',
    deviceId: '',
  });

  const [deviceForm, setDeviceForm] = useState({
    deviceId: '',
  });

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await vehiclesApi.getAll();
      return res.data;
    },
  });

  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await api.get('/api/devices');
      return res.data;
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/api/vehicles', {
        plateNo: data.plateNo,
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        deviceId: data.deviceId ? parseInt(data.deviceId) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setShowCreateVehicle(false);
      setVehicleForm({ plateNo: '', driverName: '', driverPhone: '', deviceId: '' });
      alert('Vehicle created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create vehicle');
    },
  });

  const createDeviceMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/api/devices', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setShowCreateDevice(false);
      setDeviceForm({ deviceId: '' });
      alert('Device created successfully!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create device');
    },
  });

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicleMutation.mutate(vehicleForm);
  };

  const handleDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeviceMutation.mutate(deviceForm);
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={<Truck className="w-8 h-8 text-green-600" />}
        title="Vehicles"
        subtitle="Manage your fleet and GPS devices"
        action={
          <div className="flex gap-2">
            {user.role === 'ADMIN' && (
              <Button
                variant="secondary"
                onClick={() => setShowCreateDevice(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                New Device
              </Button>
            )}
            <Button
              variant="success"
              onClick={() => setShowCreateVehicle(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              New Vehicle
            </Button>
          </div>
        }
      />

      <CreateVehicleModal
        isOpen={showCreateVehicle}
        onClose={() => setShowCreateVehicle(false)}
        onSubmit={handleVehicleSubmit}
        formData={vehicleForm}
        onChange={setVehicleForm}
        devices={devices}
        isLoading={createVehicleMutation.isPending}
      />

      <CreateDeviceModal
        isOpen={showCreateDevice}
        onClose={() => setShowCreateDevice(false)}
        onSubmit={handleDeviceSubmit}
        formData={deviceForm}
        onChange={setDeviceForm}
        isLoading={createDeviceMutation.isPending}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Truck}
            title="No vehicles registered"
            description="Add your first vehicle to start tracking"
            actionLabel="Add Vehicle"
            onAction={() => setShowCreateVehicle(true)}
          />
        )}
      </main>
    </div>
  );
}
