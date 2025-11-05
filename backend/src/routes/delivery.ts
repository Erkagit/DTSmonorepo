import { Router } from 'express';
import { prisma } from '../libs/prisma';

const router = Router();

// Хүргэлтийн статусын монгол хэл рүү хувиргах map
const DeliveryStatusToMongolian: Record<string, string> = {
  PENDING: 'Хүлээгдэж байна',
  LOADING: 'Ачилт хийгдэж байна',
  TRANSFER_LOADING: 'Шилжүүлэн ачилт',
  CN_EXPORT_CUSTOMS: 'Хятадын экспорт гааль',
  MN_IMPORT_CUSTOMS: 'Монгол импорт гааль',
  IN_TRANSIT: 'Хүргэлт замдаа явж байна',
  ARRIVED_AT_SITE: 'Буулгах хаягт ирсэн',
  UNLOADED: 'Ачаа буусан',
  RETURN_TRIP: 'Буцах хүргэлт',
  MN_EXPORT_RETURN: 'Монголын экспорт буцах',
  CN_IMPORT_RETURN: 'Хятадын импорт буцах',
  TRANSFER: 'Шилжүүлэн ачилт',
  COMPLETED: 'Дуусгах',
  CANCELLED: 'Цуцлагдсан'
};

/**
 * GET /api/deliveries
 * Бүх хүргэлтүүдийг буцаана
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const deliveries = await prisma.order.findMany({
      where,
      include: {
        vehicle: {
          include: {
            device: true,
            pings: {
              orderBy: { at: 'desc' },
              take: 1
            }
          }
        },
        company: true,
        createdBy: true,
        assignedTo: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform to match frontend expectations
    const transformed = deliveries.map(delivery => ({
      id: `d-${delivery.id}`,
      order_id: delivery.code,
      vehicle_id: delivery.vehicle ? `v-${delivery.vehicle.id}` : null,
      plate_number: delivery.vehicle?.plateNo || 'N/A',
      current_status: DeliveryStatusToMongolian[delivery.status],
      current_status_enum: delivery.status,
      origin: delivery.origin,
      destination: delivery.destination,
      last_updated: delivery.updatedAt,
      company: delivery.company.name,
      assigned_to: delivery.assignedTo?.name
    }));

    res.json(transformed);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/deliveries/:id
 * Тухайн хүргэлтийн дэлгэрэнгүй мэдээлэл
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('d-', ''));
    
    const delivery = await prisma.order.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            device: true,
            pings: {
              orderBy: { at: 'desc' },
              take: 10
            }
          }
        },
        company: true,
        createdBy: true,
        assignedTo: true,
        statusHistory: true
      }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const transformed = {
      id: `d-${delivery.id}`,
      order_id: delivery.code,
      vehicle_id: delivery.vehicle ? `v-${delivery.vehicle.id}` : null,
      plate_number: delivery.vehicle?.plateNo || 'N/A',
      current_status: DeliveryStatusToMongolian[delivery.status],
      current_status_enum: delivery.status,
      origin: delivery.origin,
      destination: delivery.destination,
      last_updated: delivery.updatedAt,
      company: delivery.company.name,
      assigned_to: delivery.assignedTo?.name,
      location_history: delivery.vehicle?.pings || []
    };

    res.json(transformed);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/deliveries/:id/status
 * Хүргэлтийн статусыг шинэчлэх
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id.replace('d-', ''));
    const { new_status } = req.body;

    if (!new_status) {
      return res.status(400).json({ error: 'new_status is required' });
    }

    const delivery = await prisma.order.update({
      where: { id },
      data: {
        status: new_status,
        updatedAt: new Date()
      },
      include: {
        vehicle: true,
        company: true
      }
    });

    const transformed = {
      id: `d-${delivery.id}`,
      order_id: delivery.code,
      vehicle_id: delivery.vehicle ? `v-${delivery.vehicle.id}` : null,
      plate_number: delivery.vehicle?.plateNo || 'N/A',
      current_status: DeliveryStatusToMongolian[delivery.status],
      current_status_enum: delivery.status,
      origin: delivery.origin,
      destination: delivery.destination,
      last_updated: delivery.updatedAt
    };

    res.json(transformed);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as deliveryRouter };
