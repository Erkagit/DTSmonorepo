import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// Basic CRUD operations for devices
router.get('/', async (_req, res) => {
  try {
    const devices = await prisma.device.findMany();
    res.json(devices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { deviceId } = req.body;
    const device = await prisma.device.create({
      data: { deviceId }
    });
    res.json(device);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as deviceRouter };
