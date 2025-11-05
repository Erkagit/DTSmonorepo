import express from 'express';  
import cors from 'cors';    
import morgan from 'morgan';  
import ordersRouter from './modules/orders/order.routes';
import telemetryRouter from './modules/telemetry/telemetry.routes';

const app = express();

app.use(cors({
  origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(','),
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/telemetry', telemetryRouter);

export default app;
