import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const studentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    semester: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    shift: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

studentSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

export type StudentDocument = InferSchemaType<typeof studentSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
