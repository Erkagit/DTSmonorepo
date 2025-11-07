import { Router } from 'express';
import { prisma } from '../libs/prisma';
import { requireRole } from '../middleware/auth';
import { Role, OrderStatus } from '@prisma/client';

const router = Router();

// Allowed status transitions
// Correct flow: PENDING → LOADING → TRANSFER_LOADING → CN_EXPORT_CUSTOMS → MN_IMPORT_CUSTOMS → 
// IN_TRANSIT → ARRIVED_AT_SITE → UNLOADED → RETURN_TRIP → MN_EXPORT_RETURN → 
// CN_IMPORT_RETURN → TRANSFER → COMPLETED
// All statuses (except COMPLETED and CANCELLED) can transition to CANCELLED
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.LOADING, OrderStatus.CANCELLED],
  LOADING: [OrderStatus.TRANSFER_LOADING, OrderStatus.CANCELLED],
  TRANSFER_LOADING: [OrderStatus.CN_EXPORT_CUSTOMS, OrderStatus.CANCELLED],
  CN_EXPORT_CUSTOMS: [OrderStatus.MN_IMPORT_CUSTOMS, OrderStatus.CANCELLED],
  MN_IMPORT_CUSTOMS: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED],
  IN_TRANSIT: [OrderStatus.ARRIVED_AT_SITE, OrderStatus.CANCELLED],
  ARRIVED_AT_SITE: [OrderStatus.UNLOADED, OrderStatus.CANCELLED],
  UNLOADED: [OrderStatus.RETURN_TRIP, OrderStatus.CANCELLED],
  RETURN_TRIP: [OrderStatus.MN_EXPORT_RETURN, OrderStatus.CANCELLED],
  MN_EXPORT_RETURN: [OrderStatus.CN_IMPORT_RETURN, OrderStatus.CANCELLED],
  CN_IMPORT_RETURN: [OrderStatus.TRANSFER, OrderStatus.CANCELLED],
  TRANSFER: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  COMPLETED: [],
  CANCELLED: []
};

// Basic CRUD operations for orders
router.get('/', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        vehicle: true,
        company: true,
        createdBy: true,
        assignedTo: true
      }
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        vehicle: true,
        company: true,
        createdBy: true,
        assignedTo: true
      }
    });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { code, companyId, origin, destination, vehicleId, createdById, assignedToId } = req.body;
    const order = await prisma.order.create({
      data: {
        code,
        companyId,
        origin,
        destination,
        vehicleId,
        createdById,
        assignedToId
      }
    });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (Admin and Operator only)
router.patch('/:id/status', requireRole(Role.ADMIN, Role.OPERATOR), async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status, note } = req.body;
    const requestingUser = req.user;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Validate status is a valid OrderStatus
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}` 
      });
    }

    // Get the current order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if operator is assigned to this order
    if (requestingUser?.role === Role.OPERATOR && order.assignedToId !== requestingUser.userId) {
      return res.status(403).json({ 
        error: 'Forbidden: You can only update orders assigned to you' 
      });
    }

    // Validate status transition
    const allowedStatuses = ALLOWED_TRANSITIONS[order.status as OrderStatus] || [];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${order.status} to ${status}. Allowed transitions: ${allowedStatuses.join(', ')}` 
      });
    }

    // Update order status and create history entry in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update the order
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { 
          status,
          updatedAt: new Date()
        },
        include: {
          vehicle: true,
          company: true,
          createdBy: true,
          assignedTo: true
        }
      });

      // Create status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status,
          note: note || `Status updated by ${requestingUser?.email || 'system'}`
        }
      });

      return updated;
    });

    res.json(updatedOrder);
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get order status history
router.get('/:id/history', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    const history = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as orderRouter };
