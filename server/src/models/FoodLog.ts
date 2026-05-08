import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodLog extends Document {
  student: mongoose.Types.ObjectId;
  dish?: mongoose.Types.ObjectId;
  itemName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  mealType: string;
  date: Date;
  createdAt: Date;
}

const FoodLogSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  dish: { type: Schema.Types.ObjectId, ref: 'Dish' },
  itemName: { type: String, required: true },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  sugar: { type: Number, default: 0 },
  sodium: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  mealType: { type: String, default: 'refrigerio' },
  date: { type: Date, default: Date.now },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IFoodLog>('FoodLog', FoodLogSchema);
