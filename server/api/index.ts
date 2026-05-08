import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import app from '../src/app';
import { connectDB } from '../src/config/db';

dotenv.config();

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return app(req, res);
}
