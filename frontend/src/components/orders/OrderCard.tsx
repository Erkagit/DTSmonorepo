import { Truck, MapPin, User, Calendar } from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types/types';
import { StatusNavigationButtons } from './StatusNavigationButtons';

interface OrderCardProps {
  order: Order;
  canUpdateStatus: boolean;
  previousStatus: OrderStatus | null;
  nextStatus: OrderStatus | null;
  onStatusUpdate: (newStatus: OrderStatus) => void;
}

/**
 * Individual order display card component
 * Displays order information with status badge and navigation buttons
 */
export function OrderCard({
  order,
  canUpdateStatus,
  previousStatus,
  nextStatus,
  onStatusUpdate,
}: OrderCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900">{order.code}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            ORDER_STATUS_COLORS[order.status as OrderStatus]
          }`}
        >
          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-gray-600">
              From: <span className="font-medium text-gray-900">{order.origin}</span>
            </p>
            <p className="text-gray-600">
              To: <span className="font-medium text-gray-900">{order.destination}</span>
            </p>
          </div>
        </div>

        {order.vehicle && (
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{order.vehicle.plateNo}</span>
          </div>
        )}

        {order.assignedTo && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{order.assignedTo.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Calendar className="w-3 h-3" />
          <span>
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <StatusNavigationButtons
          currentStatus={order.status as OrderStatus}
          previousStatus={previousStatus}
          nextStatus={nextStatus}
          onStatusChange={onStatusUpdate}
          canUpdate={canUpdateStatus}
        />
      </div>
    </div>
  );
}
