import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/NUTRI';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);

    // Limpieza de indice legado de versiones anteriores (campo userId ya no existe)
    const students = mongoose.connection.collection('students');
    const indexes = await students.indexes();
    const hasLegacyUserIdIndex = indexes.some((idx) => idx.name === 'userId_1');
    if (hasLegacyUserIdIndex) {
      await students.dropIndex('userId_1');
      console.log('🧹 Indice legado eliminado: students.userId_1');
    }
  } catch (error: any) {
    console.error(`❌ Error de Conexión a MongoDB: ${error.message}`);
    throw error;
  }
};
