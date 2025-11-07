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
 * Map of each status to its previous status in the main flow
 * This provides a deterministic way to navigate backwards
 */
const STATUS_SEQUENCE_MAP: Record<OrderStatus, OrderStatus | null> = {
  PENDING: null,
  LOADING: 'PENDING',
  TRANSFER_LOADING: 'LOADING',
  CN_EXPORT_CUSTOMS: 'TRANSFER_LOADING',
  MN_IMPORT_CUSTOMS: 'CN_EXPORT_CUSTOMS',
  IN_TRANSIT: 'MN_IMPORT_CUSTOMS',
  ARRIVED_AT_SITE: 'IN_TRANSIT',
  UNLOADED: 'ARRIVED_AT_SITE',
  RETURN_TRIP: 'UNLOADED',
  MN_EXPORT_RETURN: 'RETURN_TRIP',
  CN_IMPORT_RETURN: 'MN_EXPORT_RETURN',
  TRANSFER: 'CN_IMPORT_RETURN',
  COMPLETED: 'TRANSFER',
  CANCELLED: null
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
 * Get the previous status by using the sequence map
 * This ensures deterministic backwards navigation in the main flow
 */
export function getPreviousStatus(currentStatus: OrderStatus): OrderStatus | null {
  return STATUS_SEQUENCE_MAP[currentStatus];
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
