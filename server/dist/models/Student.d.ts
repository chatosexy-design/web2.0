import mongoose, { Document } from 'mongoose';
export interface IStudent extends Document {
    user: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    semester: string;
    specialty: string;
    shift: string;
    age: number;
    weight: number;
    height: number;
    sex: string;
    activityLevel: string;
    goal: string;
    parentAccessCode?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, mongoose.DefaultSchemaOptions> & IStudent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IStudent>;
export default _default;
