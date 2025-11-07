import { Package, Plus } from 'lucide-react';

interface EmptyOrdersStateProps {
  onCreateOrder: () => void;
}

/**
 * Display empty state when no orders exist
 */
export function EmptyOrdersState({ onCreateOrder }: EmptyOrdersStateProps) {
  return (
    <div className="text-center py-12">
      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-500 mb-6">Create your first order to get started</p>
      <button
        onClick={onCreateOrder}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        aria-label="Create first order"
      >
        <Plus className="w-5 h-5" />
        Create Order
      </button>
    </div>
  );
}
