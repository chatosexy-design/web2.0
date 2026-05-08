import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IFoodLog, {}, {}, {}, mongoose.Document<unknown, {}, IFoodLog, {}, mongoose.DefaultSchemaOptions> & IFoodLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFoodLog>;
export default _default;
