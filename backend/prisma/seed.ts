import { PrismaClient, Role, OrderStatus, DeliveryStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // company
  const acme = await prisma.company.upsert({
    where: { name: 'Demo Logistics' },
    update: {},
    create: { name: 'Demo Logistics' },
  })

  // users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dts.local' },
    update: {},
    create: { email: 'admin@dts.local', name: 'Batchuluun', role: Role.ADMIN },
  })

  const operator = await prisma.user.upsert({
    where: { email: 'op@dts.local' },
    update: {},
    create: { email: 'op@dts.local', name: 'Operator', role: Role.OPERATOR },
  })

  const clientAdmin = await prisma.user.upsert({
    where: { email: 'client@acme.local' },
    update: {},
    create: { email: 'client@acme.local', name: 'Client Admin', role: Role.CLIENT_ADMIN, companyId: acme.id },
  })

  // vehicles + devices
  const device1 = await prisma.device.create({ data: { deviceId: 'GPS-0001' } })
  const vehicle1 = await prisma.vehicle.create({
    data: { name: 'Hino 1', plateNo: 'УНД-8701', deviceId: device1.id }
  })

  const device2 = await prisma.device.create({ data: { deviceId: 'GPS-0002' } })
  const vehicle2 = await prisma.vehicle.create({
    data: { name: 'Truck 2', plateNo: 'ААА-1234', deviceId: device2.id }
  })

  const device3 = await prisma.device.create({ data: { deviceId: 'GPS-0003' } })
  const vehicle3 = await prisma.vehicle.create({
    data: { name: 'Truck 3', plateNo: 'БББ-5678', deviceId: device3.id }
  })

  // sample orders with different delivery statuses
  const order1 = await prisma.order.create({
    data: {
      code: 'ORDER-991',
      companyId: acme.id,
      origin: 'Улаанбаатар',
      destination: 'Манжуур',
      vehicleId: vehicle1.id,
      status: OrderStatus.IN_PROGRESS,
      deliveryStatus: DeliveryStatus.IN_TRANSIT,
      createdById: admin.id,
      assignedToId: operator.id,
    }
  })

  const order2 = await prisma.order.create({
    data: {
      code: 'ORDER-992',
      companyId: acme.id,
      origin: 'Бээжин',
      destination: 'Дархан',
      vehicleId: vehicle2.id,
      status: OrderStatus.IN_PROGRESS,
      deliveryStatus: DeliveryStatus.MONGOLIA_IMPORT_CUSTOMS,
      createdById: admin.id,
      assignedToId: operator.id,
    }
  })

  const order3 = await prisma.order.create({
    data: {
      code: 'ORDER-993',
      companyId: acme.id,
      origin: 'Эрлян',
      destination: 'Улаангом',
      vehicleId: vehicle3.id,
      status: OrderStatus.PENDING,
      deliveryStatus: DeliveryStatus.WAITING,
      createdById: admin.id,
      assignedToId: operator.id,
    }
  })

  // Add location pings for the vehicles
  await prisma.locationPing.createMany({
    data: [
      { vehicleId: vehicle1.id, lat: 47.9188, lng: 106.9175, speedKph: 60, at: new Date(Date.now() - 5000) },
      { vehicleId: vehicle2.id, lat: 44.5778, lng: 115.4292, speedKph: 55, at: new Date(Date.now() - 3000) },
      { vehicleId: vehicle3.id, lat: 49.2000, lng: 105.0000, speedKph: 0, at: new Date(Date.now() - 1000) },
    ]
  })

  console.log({ acme, admin, operator, clientAdmin, order1, order2, order3 })
}

main().finally(() => prisma.$disconnect())

