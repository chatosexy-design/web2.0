import dotenv from 'dotenv';
import { connectDB } from './config/db';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ MongoDB integration ready`);
  });
};

startServer().catch((error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
