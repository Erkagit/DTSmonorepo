import { Package, Plus } from 'lucide-react';
import Link from 'next/link';

interface OrdersHeaderProps {
  onCreateOrder: () => void;
}

/**
 * Page header with title and action buttons for Orders page
 */
export function OrdersHeader({ onCreateOrder }: OrdersHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-sm text-gray-500">Delivery order management</p>
            </div>
          </div>
          <button
            onClick={onCreateOrder}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            aria-label="Create new order"
          >
            <Plus className="w-5 h-5" />
            New Order
          </button>
        </div>
      </div>
    </header>
  );
}
