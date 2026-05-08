import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Student from '../models/Student';
import { Roles } from '../types/roles';

const normalizeRole = (role?: string) => {
  const upper = String(role || '').toUpperCase();
  if (upper === Roles.ADMIN) return Roles.ADMIN;
  if (upper === Roles.CAFETERIA) return Roles.CAFETERIA;
  return Roles.STUDENT;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { 
    firstName, lastName, semester, email, specialty, shift, password,
    age, weight, height, sex, activityLevel, goal 
  } = req.body;

  try {
    if (!firstName || !lastName || !semester || !email || !specialty || !shift || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos básicos del alumno son obligatorios'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'El correo ya está registrado' });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Crear usuario en MongoDB
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: fullName,
      role: Roles.STUDENT
    });

    // 2. Crear registro de estudiante
    const student = await Student.create({
      user: user._id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      semester: String(semester).trim(),
      specialty: specialty.trim(),
      shift: shift.trim(),
      age: age || 17,
      weight: weight || 65,
      height: height || 183,
      sex: sex || 'Otro',
      activityLevel: activityLevel || 'moderado',
      goal: goal || 'mantener',
      parentAccessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: Roles.STUDENT, studentId: student._id.toString() },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con éxito.',
      token,
      user: { id: user._id.toString(), email: user.email, role: Roles.STUDENT, name: fullName, studentId: student._id.toString() },
      student
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const student = await Student.findOne({ user: user._id });

    const token = jwt.sign(
      { id: user._id.toString(), role: normalizeRole(user.role), studentId: student?._id?.toString() },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: normalizeRole(user.role), studentId: student?._id?.toString() },
      student
    });
  } catch (error) {
    next(error);
  }
};
