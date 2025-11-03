import { PrismaClient, OrderStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Device
  const dev1 = await prisma.device.upsert({
    where: { deviceId: "GPS-0001" },
    update: {},
    create: { deviceId: "GPS-0001", name: "Tracker-0001" }
  });

  // Vehicle
  const v1 = await prisma.vehicle.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Truck-01", plateNo: "MNO-1234", deviceId: dev1.id }
  });

  // Order
  const o1 = await prisma.order.upsert({
    where: { code: "DTS-2025-0001" },
    update: {},
    create: {
      code: "DTS-2025-0001",
      origin: "Erenhot CN",
      destination: "Ulaanbaatar MN",
      vehicleId: v1.id,
      status: OrderStatus.PENDING
    }
  });

  await prisma.orderStatusHistory.create({
    data: { orderId: o1.id, status: OrderStatus.PENDING, note: "Seed" }
  });

  console.log("Seed OK");
}

main().finally(async () => await prisma.$disconnect());
