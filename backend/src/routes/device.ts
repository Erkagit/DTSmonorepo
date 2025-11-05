import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// GET /api/devices - Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        vehicles: true,
      },
    });
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// POST /api/devices - Create new device
router.post('/', async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required' });
    }

    // Check if device already exists
    const existing = await prisma.device.findFirst({
      where: { deviceId },
    });

    if (existing) {
      return res.status(400).json({ error: 'Device with this ID already exists' });
    }

    const device = await prisma.device.create({
      data: { deviceId },
    });

    res.status(201).json(device);
  } catch (error) {
    console.error('Error creating device:', error);
    res.status(500).json({ error: 'Failed to create device' });
  }
});

export { router as deviceRouter };
