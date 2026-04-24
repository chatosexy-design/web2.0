import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatosano';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(connectionString, {
    dbName: process.env.MONGODB_DB_NAME || undefined
  });

  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
  return mongoose.connection;
};

export default mongoose;
