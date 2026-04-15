import prisma from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const testPrisma = async () => {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'No definida');
    
    // Intenta una operación simple
    await prisma.$connect();
    console.log('✅ Conexión exitosa con Prisma Client');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error al conectar con Prisma:', error);
    process.exit(1);
  }
};

testPrisma();
