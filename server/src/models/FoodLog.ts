import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const foodLogSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    dishId: { type: Schema.Types.ObjectId, ref: 'Dish', default: null },
    itemName: { type: String, default: '', trim: true },
    calories: { type: Number, required: true, default: 0 },
    protein: { type: Number, required: true, default: 0 },
    carbs: { type: Number, required: true, default: 0 },
    fat: { type: Number, required: true, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    mealType: { 
      type: String, 
      enum: ['desayuno', 'almuerzo', 'cena', 'refrigerio'], 
      default: 'refrigerio' 
    },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export type FoodLogDocument = InferSchemaType<typeof foodLogSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.FoodLog || mongoose.model('FoodLog', foodLogSchema);
