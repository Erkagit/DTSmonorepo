import { OrderStatus } from '@/types/types';
import { User, Order } from '@/types/types';

/**
 * Correct order status flow:
 * PENDING → LOADING → TRANSFER_LOADING → CN_EXPORT_CUSTOMS → MN_IMPORT_CUSTOMS → 
 * IN_TRANSIT → ARRIVED_AT_SITE → UNLOADED → RETURN_TRIP → MN_EXPORT_RETURN → 
 * CN_IMPORT_RETURN → TRANSFER → COMPLETED
 * 
 * All statuses (except COMPLETED and CANCELLED) can transition to CANCELLED
 */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
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

/**
 * Get the next status in the progression path
 */
export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowedNext || allowedNext.length === 0) return null;
  
  // Return the first allowed next status (primary progression path, excluding CANCELLED)
  return allowedNext.find(status => status !== 'CANCELLED') || null;
}

/**
 * Get the previous status by finding which status has currentStatus in its allowed transitions
 */
export function getPreviousStatus(currentStatus: OrderStatus): OrderStatus | null {
  // Can't go back from PENDING, COMPLETED, or CANCELLED
  if (currentStatus === 'PENDING' || currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
    return null;
  }
  
  const entries = Object.entries(ALLOWED_TRANSITIONS) as [OrderStatus, OrderStatus[]][];
  for (const [prevStatus, allowedNext] of entries) {
    if (allowedNext.includes(currentStatus)) {
      return prevStatus;
    }
  }
  return null;
}

/**
 * Get all allowed status transitions from current status
 */
export function getAllowedTransitions(currentStatus: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

/**
 * Check if a status transition is valid
 */
export function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
}

/**
 * Check if a user can update an order's status
 */
export function canUpdateStatus(order: Order, user: User | null): boolean {
  // Only ADMIN and OPERATOR can update status
  if (!user || (user.role !== 'ADMIN' && user.role !== 'OPERATOR')) {
    return false;
  }
  
  // OPERATOR can only update their assigned orders
  if (user.role === 'OPERATOR' && order.assignedToId !== user.id) {
    return false;
  }
  
  // Can't update if already completed or cancelled
  return order.status !== 'COMPLETED' && order.status !== 'CANCELLED';
}
