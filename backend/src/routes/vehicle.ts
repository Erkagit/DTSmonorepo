import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// Basic CRUD operations for vehicles
router.get('/', async (_req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { device: true }
    });
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, plateNo, deviceId } = req.body;
    const vehicle = await prisma.vehicle.create({
      data: { name, plateNo, deviceId }
    });
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as vehicleRouter };
