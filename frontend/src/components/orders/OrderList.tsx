import { Order, OrderStatus } from '@/types/types';
import { OrderCard } from './OrderCard';
import { useOrderStatusTransitions } from '@/hooks/useOrderStatusTransitions';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  canUpdateStatus: (order: Order) => boolean;
  onStatusUpdate: (orderId: number, newStatus: OrderStatus) => void;
}

/**
 * Grid container for displaying order cards
 * Handles responsive layout and loading skeletons
 */
export function OrderList({
  orders,
  isLoading,
  canUpdateStatus,
  onStatusUpdate,
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => {
        const { getPrevious, getNext } = useOrderStatusTransitions(
          order.status as OrderStatus
        );
        
        return (
          <OrderCard
            key={order.id}
            order={order}
            canUpdateStatus={canUpdateStatus(order)}
            previousStatus={getPrevious()}
            nextStatus={getNext()}
            onStatusUpdate={(newStatus) => onStatusUpdate(order.id, newStatus)}
          />
        );
      })}
    </div>
  );
}
