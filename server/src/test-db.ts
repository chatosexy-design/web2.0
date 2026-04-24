import { connectDB } from './config/db';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testMongoose = async () => {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Definida' : 'No definida');
    
    await connectDB();
    console.log('✅ Conexión exitosa con Mongoose');
    
    await mongoose.connection.close();
    console.log('📡 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

testMongoose();
