import mongoose, { Schema, Document } from 'mongoose';

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

const StudentSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  semester: { type: String, required: true },
  specialty: { type: String, required: true },
  shift: { type: String, required: true },
  age: { type: Number, default: 17 },
  weight: { type: Number, default: 65 },
  height: { type: Number, default: 183 },
  sex: { type: String, default: 'Otro' },
  activityLevel: { type: String, default: 'moderado' },
  goal: { type: String, default: 'mantener' },
  parentAccessCode: { type: String, unique: true },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
