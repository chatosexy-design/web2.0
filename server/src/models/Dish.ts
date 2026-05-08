import mongoose, { Schema, Document } from 'mongoose';

export interface IDish extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  trafficLight: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, default: 'General' },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  trafficLight: { type: String, default: 'verde' },
  available: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IDish>('Dish', DishSchema);
