import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const studentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    semester: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    shift: { type: String, required: true, trim: true },
    parentAccessCode: { type: String, unique: true, sparse: true },
    // Campos de perfil avanzado
    age: { type: Number, default: 16 },
    weight: { type: Number, default: 60 }, // kg
    height: { type: Number, default: 165 }, // cm
    sex: { type: String, enum: ['M', 'F', 'Otro'], default: 'Otro' },
    activityLevel: { 
      type: String, 
      enum: ['sedentario', 'ligero', 'moderado', 'activo', 'muy_activo'], 
      default: 'moderado' 
    },
    goal: { 
      type: String, 
      enum: ['perder_peso', 'mantener', 'ganar_musculo'], 
      default: 'mantener' 
    }
  },
  { timestamps: true }
);

// Generar código parental automáticamente si no existe
studentSchema.pre('save', async function () {
  const student = this as any;
  if (!student.parentAccessCode) {
    let isUnique = false;
    let newCode = '';
    while (!isUnique) {
      newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const existing = await mongoose.models.Student.findOne({ parentAccessCode: newCode });
      if (!existing) isUnique = true;
    }
    student.parentAccessCode = newCode;
  }
});

studentSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

export type StudentDocument = InferSchemaType<typeof studentSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
