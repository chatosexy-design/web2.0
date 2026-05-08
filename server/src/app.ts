import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import cafeteriaRoutes from './routes/cafeteria';
import adminRoutes from './routes/admin';
import nutritionRoutes from './routes/nutrition';
import { errorHandler } from './middleware/error';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/cafeteria', cafeteriaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nutrition', nutritionRoutes);

app.use(errorHandler);

export default app;
