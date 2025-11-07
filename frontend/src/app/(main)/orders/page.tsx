'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, vehiclesApi, companiesApi } from '@/services/api';
import { Package, Plus } from 'lucide-react';
import { type OrderStatus } from '@/types/types';
import { useAuth } from '@/context/AuthProvider';
import api from '@/services/api';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateOrderModal, StatusUpdateModal, OrderCard } from './components';

// Allowed status transitions - Sequential workflow with cancel option at each step
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['LOADING', 'CANCELLED'],
  LOADING: ['TRANSFER_LOADING', 'CANCELLED'],
  TRANSFER_LOADING: ['CN_EXPORT_CUSTOMS', 'CANCELLED'],
  CN_EXPORT_CUSTOMS: ['MN_IMPORT_CUSTOMS', 'CANCELLED'],
  MN_IMPORT_CUSTOMS: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['ARRIVED_AT_SITE', 'CANCELLED'],
  ARRIVED_AT_SITE: ['UNLOADED', 'CANCELLED'],
  UNLOADED: ['RETURN_TRIP', 'CANCELLED'],
  RETURN_TRIP: ['MN_EXPORT_RETURN', 'CANCELLED'],
  MN_EXPORT_RETURN: ['CN_IMPORT_RETURN', 'CANCELLED'],
  CN_IMPORT_RETURN: ['TRANSFER', 'CANCELLED'],
  TRANSFER: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: []
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    origin: '',
    destination: '',
    vehicleId: '',
    companyId: String(user?.companyId || ''),
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await ordersApi.getAll();
      return res.data;
    },
  });

  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await vehiclesApi.getAll();
      return res.data;
    },
  });

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await companiesApi.getAll();
      return res.data;
    },
    enabled: user?.role === 'ADMIN',
  });

    const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      // For non-admin users with a companyId, use their company
      // For admin users, require company selection
      const finalCompanyId = user?.companyId || data.companyId;
      
      if (!finalCompanyId) {
        throw new Error('Company is required');
      }

      const payload = {
        code: data.code,
        origin: data.origin,
        destination: data.destination,
        vehicleId: data.vehicleId ? parseInt(data.vehicleId) : undefined,
        companyId: parseInt(finalCompanyId),
        createdById: user?.id,
      };
      return ordersApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      handleCloseCreateModal();
      alert('✅ Order created successfully!');
    },
    onError: (error: any) => {
      alert('❌ ' + (error.response?.data?.error || 'Failed to create order'));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, note }: { orderId: number; status: OrderStatus; note?: string }) => {
      return api.patch(`/api/orders/${orderId}/status`, { status, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      handleCloseStatusModal();
    },
    onError: (error: any) => {
      alert('❌ ' + (error.response?.data?.error || 'Failed to update status'));
    },
  });

  const generateOrderCode = (count: number) => {
    const year = new Date().getFullYear();
    return `Achir Bayron LLC-${year}-${String(count).padStart(4, '0')}`;
  };  const handleCreateClick = () => {
    setFormData({ ...formData, code: generateOrderCode(orders?.length || 0) });
    setShowCreateForm(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateForm(false);
    setFormData({
      code: '',
      origin: '',
      destination: '',
      vehicleId: '',
      companyId: String(user?.companyId || ''),
    });
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setSelectedStatus('');
    setStatusNote('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrderMutation.mutate(formData);
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedStatus) return;
    updateStatusMutation.mutate({
      orderId: selectedOrder.id,
      status: selectedStatus as OrderStatus,
      note: statusNote || undefined
    });
  };

  const canUpdateStatus = (order: any) => {
    return user?.role === 'ADMIN' && order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
  };

  const STATUS_ORDER: OrderStatus[] = [
    'PENDING',
    'LOADING',
    'TRANSFER_LOADING',
    'CN_EXPORT_CUSTOMS',
    'MN_IMPORT_CUSTOMS',
    'IN_TRANSIT',
    'ARRIVED_AT_SITE',
    'UNLOADED',
    'RETURN_TRIP',
    'MN_EXPORT_RETURN',
    'CN_IMPORT_RETURN',
    'TRANSFER',
    'COMPLETED'
  ];

  const getPreviousStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    return currentIndex <= 0 ? null : STATUS_ORDER[currentIndex - 1];
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    return currentIndex === -1 || currentIndex >= STATUS_ORDER.length - 1 ? null : STATUS_ORDER[currentIndex + 1];
  };

  const handleQuickStatusUpdate = (order: any, newStatus: OrderStatus) => {
    if (confirm(`Update order ${order.code} status to ${newStatus.replace(/_/g, ' ')}?`)) {
      updateStatusMutation.mutate({
        orderId: order.id,
        status: newStatus,
        note: undefined
      });
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        icon={<Package className="w-8 h-8 text-blue-600" />}
        title="Orders"
        subtitle="Delivery order management"
        action={
          <Button icon={Plus} onClick={handleCreateClick}>
            New Order
          </Button>
        }
      />

      <CreateOrderModal
        isOpen={showCreateForm}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={setFormData}
        vehicles={vehicles || []}
        companies={companies}
        isAdmin={user.role === 'ADMIN'}
        isLoading={createOrderMutation.isPending}
      />

      {selectedOrder && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={handleCloseStatusModal}
          onSubmit={handleStatusUpdate}
          order={selectedOrder}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          statusNote={statusNote}
          onNoteChange={setStatusNote}
          allowedTransitions={ALLOWED_TRANSITIONS[selectedOrder.status as OrderStatus] || []}
          isLoading={updateStatusMutation.isPending}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-white rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                canUpdate={canUpdateStatus(order)}
                previousStatus={getPreviousStatus(order.status as OrderStatus)}
                nextStatus={getNextStatus(order.status as OrderStatus)}
                onQuickUpdate={handleQuickStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Create your first order to get started"
            actionLabel="Create Order"
            onAction={handleCreateClick}
          />
        )}
      </main>
    </div>
  );
}
