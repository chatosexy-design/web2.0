import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../types/roles';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  role: { type: String, default: 'student' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
