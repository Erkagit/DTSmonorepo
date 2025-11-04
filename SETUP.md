# Delivery Tracking System (DTS) - Setup Guide

This is a monorepo containing both the frontend and backend for the Delivery Tracking System.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd DTSmonorepo
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set your DATABASE_URL

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed

# Build the backend
npm run build

# Start the backend server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables (optional)
# Create .env.local if you want to customize the API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local

# Build the frontend
npm run build

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## Project Structure

```
DTSmonorepo/
├── backend/
│   ├── src/
│   │   ├── app.ts              # Express app configuration
│   │   ├── server.ts           # Server entry point
│   │   ├── routes/             # API routes
│   │   │   ├── delivery.ts     # Delivery tracking endpoints
│   │   │   ├── order.ts        # Order management
│   │   │   └── ...
│   │   ├── modules/
│   │   │   └── telemetry/      # GPS telemetry endpoints
│   │   ├── middleware/         # Auth and other middleware
│   │   └── libs/               # Shared libraries
│   └── prisma/
│       ├── schema.prisma       # Database schema
│       └── seed.ts             # Database seeding
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── deliveries/     # Delivery tracking page
│   │   │   └── page.tsx        # Home page
│   │   ├── components/
│   │   │   ├── DeliveryCard.tsx
│   │   │   └── MapPlaceholder.tsx
│   │   ├── services/
│   │   │   └── api.ts          # API service layer
│   │   └── types/
│   │       └── delivery.ts     # TypeScript types
```

## Features

### Backend API

- **Delivery Management**: CRUD operations for deliveries
- **Delivery Status Tracking**: 13 different delivery statuses in Mongolian
- **Real-time Telemetry**: GPS location tracking for vehicles
- **Order Management**: Full order lifecycle management
- **RESTful API**: Clean API design with Express.js

### Frontend

- **Delivery Dashboard**: Real-time view of all active deliveries
- **Status Updates**: Update delivery status with one click
- **Map View**: GPS tracking visualization (placeholder)
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Updates**: Simulated real-time data updates

## API Endpoints

### Deliveries

- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get delivery by ID
- `PATCH /api/deliveries/:id/status` - Update delivery status

### Telemetry

- `GET /api/telemetry/latest` - Get latest GPS data for all vehicles
- `GET /api/telemetry/vehicle/:id` - Get GPS history for a vehicle
- `POST /api/telemetry/ping` - Record new GPS ping

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order

## Delivery Status Flow

The system supports the following delivery statuses (in Mongolian):

1. Хүлээгдэж байна (WAITING)
2. Ачилт хийгдэж байна (LOADING)
3. Шилжүүлэн ачилт хийгдэж байна - Хятадын экспорт гааль (TRANSIT_LOADING_CHINA_EXPORT)
4. Монгол экспорт гааль (MONGOLIA_EXPORT_CUSTOMS)
5. Монгол импорт гааль (MONGOLIA_IMPORT_CUSTOMS)
6. Хүргэлт замдаа явж байна (IN_TRANSIT)
7. Буулгах хаягт ирсэн (ARRIVED_AT_DESTINATION)
8. Ачаа буусан (UNLOADED)
9. Дуусгах (COMPLETED)

## Development

### Backend

```bash
cd backend
npm run dev  # Start with hot reload
```

### Frontend

```bash
cd frontend
npm run dev  # Start Next.js dev server
```

### Linting

```bash
# Backend
cd backend
npm run build  # TypeScript type checking

# Frontend
cd frontend
npm run lint   # ESLint
```

## Technologies Used

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React (icons)

## Notes

- The map view currently shows a placeholder. In production, integrate with Google Maps API or similar service.
- Authentication is currently bypassed for development. Implement proper authentication before deployment.
- Real-time updates are simulated. For production, implement WebSocket or Server-Sent Events.
