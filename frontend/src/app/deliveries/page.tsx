'use client';

import { useState, useEffect, useCallback } from 'react';
import { Truck, Loader, XCircle } from 'lucide-react';
import DeliveryCard from '@/components/DeliveryCard';
import MapPlaceholder from '@/components/MapPlaceholder';
import { Delivery, Telemetry, User, DeliveryStatusEnum } from '@/types/delivery';
import { deliveryService, telemetryService, userService } from '@/services/api';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>({ role: '', username: '' });
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [deliveriesData, telemetryData, userData] = await Promise.all([
          deliveryService.getDeliveries(),
          telemetryService.getLatestTelemetry(),
          userService.getCurrentUser(),
        ]);

        setDeliveries(deliveriesData);
        
        // Transform telemetry data
        const transformedTelemetry: Telemetry[] = telemetryData.map((t: {
          vehicleId: number;
          vehicle?: { device?: { deviceId: string } };
          lat: number;
          lng: number;
          at: string;
        }) => ({
          device_id: t.vehicle?.device?.deviceId || `device-${t.vehicleId}`,
          latitude: t.lat,
          longitude: t.lng,
          timestamp: new Date(t.at).getTime(),
        }));
        setTelemetry(transformedTelemetry);
        
        setUser(userData);
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Realtime Updates Simulation (Mock WebSocket/Socket.IO)
  useEffect(() => {
    // 5 секунд тутамд Telemetry болон Delivery-г шинэчлэх симуляци
    const interval = setInterval(() => {
      // Телеметрийн шинэчлэл (газрын зураг хөдөлгөөн)
      setTelemetry(prev => prev.map(t => ({
        ...t,
        latitude: t.latitude + (Math.random() - 0.5) * 0.005,
        longitude: t.longitude + (Math.random() - 0.5) * 0.005,
        timestamp: Date.now()
      })));

      // Delivery статусын шинэчлэл (Дашбоард дээрх өгөгдлийг шинэчлэх)
      setDeliveries(prev => prev.map(d => ({
        ...d,
        last_updated: new Date()
      })));

      console.log('Realtime update simulation triggered.');
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 3. Status Update Logic (PATCH /deliveries/{id}/status)
  const handleStatusUpdate = useCallback(async (deliveryId: string, newStatus: DeliveryStatusEnum) => {
    try {
      console.log(`API Call: PATCH /deliveries/${deliveryId}/status with new_status: ${newStatus}`);

      const updatedDelivery = await deliveryService.updateDeliveryStatus(deliveryId, newStatus);

      setDeliveries(prev => prev.map(d => {
        if (d.id === deliveryId) {
          return { ...updatedDelivery, last_updated: new Date() };
        }
        return d;
      }));
    } catch (err) {
      const error = err as Error;
      console.error('Error updating delivery status:', error);
      alert('Статусыг шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-gray-600">Өгөгдөл ачаалж байна...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-800 mb-2">Алдаа гарлаа</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  const activeDeliveries = deliveries.filter(d => d.current_status !== 'Дуусгах');
  const completedDeliveries = deliveries.filter(d => d.current_status === 'Дуусгах');

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <header className="mb-8 border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Delivery Tracking System (DTS)</h1>
          <p className="text-sm text-gray-500 mt-1">Дотоод Логистикийн Хяналтын Платформ | Хэрэглэгч: {user.username} ({user.role})</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition">
          <Truck className="w-5 h-5 mr-2" /> Шинэ Хүргэлт
        </button>
      </header>

      {/* Гол Хяналтын Самбар */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Зүүн тал: Хүргэлтийн жагсаалт */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Идэвхтэй Хүргэлтүүд ({activeDeliveries.length})</h2>
          {activeDeliveries.length > 0 ? (
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {activeDeliveries.map(d => (
                <DeliveryCard
                  key={d.id}
                  delivery={d}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-gray-500">Одоогоор идэвхтэй хүргэлт алга.</p>
            </div>
          )}
        </div>

        {/* Баруун тал: Realtime Map View */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Бодит Цагийн GPS Хяналт</h2>
          <div className="h-[75vh] w-full rounded-xl shadow-2xl">
            <MapPlaceholder telemetry={telemetry} />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3 border-b pb-1">Дууссан Ачаанууд ({completedDeliveries.length})</h3>
          <div className="flex flex-wrap gap-2">
            {completedDeliveries.slice(0, 5).map(d => (
              <span key={d.id} className="text-xs font-medium px-2 py-1 rounded-full bg-lime-100 text-lime-700">
                {d.plate_number} ({d.order_id})
              </span>
            ))}
            {completedDeliveries.length > 5 && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                + {completedDeliveries.length - 5}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
