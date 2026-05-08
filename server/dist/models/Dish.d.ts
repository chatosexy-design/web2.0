import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IDish, {}, {}, {}, mongoose.Document<unknown, {}, IDish, {}, mongoose.DefaultSchemaOptions> & IDish & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IDish>;
export default _default;
