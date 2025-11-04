import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

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
        assignedTo: true,
        histories: true
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

export { router as orderRouter };
