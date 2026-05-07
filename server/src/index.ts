import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import cafeteriaRoutes from './routes/cafeteria';
import adminRoutes from './routes/admin';
import nutritionRoutes from './routes/nutrition';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/cafeteria', cafeteriaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Supabase integration ready`);
  });
};

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
