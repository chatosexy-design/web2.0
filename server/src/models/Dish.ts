import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const dishSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    calories: { type: Number, required: true, default: 0 },
    protein: { type: Number, required: true, default: 0 },
    carbs: { type: Number, required: true, default: 0 },
    fat: { type: Number, required: true, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    trafficLight: { 
      type: String, 
      enum: ['verde', 'amarillo', 'rojo'], 
      default: 'verde' 
    },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, default: 'General', trim: true },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type DishDocument = InferSchemaType<typeof dishSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.Dish || mongoose.model('Dish', dishSchema);
