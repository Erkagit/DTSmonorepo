import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from './middleware/auth';
import { companyRouter } from './routes/company';
import { userRouter } from './routes/user';
import { deviceRouter } from './routes/device';
import { vehicleRouter } from './routes/vehicle';
import { orderRouter } from './routes/order';

export const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check (public)
app.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    service: 'dts-backend', 
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// Auth login (public)
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { company: true } 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Login successful:', user.email);
    res.json({ 
      user,
      message: 'Login successful. Use x-user-id header with value: ' + user.id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply auth middleware to protected routes
app.use(authMiddleware);

// Protected routes
app.use('/api/companies', companyRouter);
app.use('/api/users', userRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/orders', orderRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
