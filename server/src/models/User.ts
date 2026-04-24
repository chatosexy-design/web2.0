import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { Roles } from '../types/roles';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Roles),
      default: Roles.STUDENT,
      required: true
    },
    name: { type: String, trim: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', default: null }
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.User || mongoose.model('User', userSchema);
