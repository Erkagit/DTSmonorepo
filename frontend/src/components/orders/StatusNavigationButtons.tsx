import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OrderStatus } from '@/types/types';

interface StatusNavigationButtonsProps {
  currentStatus: OrderStatus;
  previousStatus: OrderStatus | null;
  nextStatus: OrderStatus | null;
  onStatusChange: (newStatus: OrderStatus) => void;
  canUpdate: boolean;
}

/**
 * Navigation buttons for quick status transitions (Previous/Next)
 */
export function StatusNavigationButtons({
  currentStatus,
  previousStatus,
  nextStatus,
  onStatusChange,
  canUpdate,
}: StatusNavigationButtonsProps) {
  if (!canUpdate) return null;

  const handlePreviousClick = () => {
    if (previousStatus && confirm(`Go back to ${previousStatus.replace(/_/g, ' ')}?`)) {
      onStatusChange(previousStatus);
    }
  };

  const handleNextClick = () => {
    if (nextStatus && confirm(`Move forward to ${nextStatus.replace(/_/g, ' ')}?`)) {
      onStatusChange(nextStatus);
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      {previousStatus && (
        <button
          onClick={handlePreviousClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition border border-gray-300"
          title={`Go back to ${previousStatus.replace(/_/g, ' ')}`}
          aria-label={`Go back to ${previousStatus.replace(/_/g, ' ')}`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Prev</span>
        </button>
      )}
      {nextStatus && (
        <button
          onClick={handleNextClick}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-200"
          title={`Move forward to ${nextStatus.replace(/_/g, ' ')}`}
          aria-label={`Move forward to ${nextStatus.replace(/_/g, ' ')}`}
        >
          <span className="text-sm font-medium">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
