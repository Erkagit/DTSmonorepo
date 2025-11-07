import { OrderStatus } from '@/types/types';
import {
  getNextStatus,
  getPreviousStatus,
  getAllowedTransitions,
  canTransitionTo,
} from '@/utils/orderStatusFlow';

/**
 * Custom hook for managing order status transitions
 * Provides business logic for status transitions
 */
export function useOrderStatusTransitions(currentStatus: OrderStatus) {
  return {
    /**
     * Get the next status in the progression path
     */
    getNext: () => getNextStatus(currentStatus),

    /**
     * Get the previous status in the progression path
     */
    getPrevious: () => getPreviousStatus(currentStatus),

    /**
     * Get all allowed status transitions from current status
     */
    getAllowed: () => getAllowedTransitions(currentStatus),

    /**
     * Check if can transition to a specific status
     */
    canTransitionTo: (newStatus: OrderStatus) => canTransitionTo(currentStatus, newStatus),

    /**
     * Check if there is a next status available
     */
    hasNext: () => getNextStatus(currentStatus) !== null,

    /**
     * Check if there is a previous status available
     */
    hasPrevious: () => getPreviousStatus(currentStatus) !== null,
  };
}
