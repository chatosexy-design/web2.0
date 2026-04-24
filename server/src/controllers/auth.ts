import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Student from '../models/Student';
import { Roles } from '../types/roles';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, semester, email, specialty, shift, password } = req.body;

  try {
    if (!firstName || !lastName || !semester || !email || !specialty || !shift || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos del alumno son obligatorios'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Ya existe una cuenta registrada con este correo'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const fullName = `${firstName} ${lastName}`.trim();

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: Roles.STUDENT,
      name: fullName
    });

    const student = await Student.create({
      userId: user._id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      semester: String(semester).trim(),
      email: email.toLowerCase().trim(),
      specialty: specialty.trim(),
      shift: shift.trim()
    });

    user.studentId = student._id;
    await user.save();

    sendTokenResponse(user, student, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    const student = user.studentId ? await Student.findById(user.studentId) : await Student.findOne({ userId: user._id });

    sendTokenResponse(user, student, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = (user: any, student: any, statusCode: number, res: Response) => {
  const token = jwt.sign(
    { id: String(user._id), role: user.role, studentId: student ? String(student._id) : undefined },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
      studentId: student ? String(student._id) : undefined,
      student: student
        ? {
            id: String(student._id),
            firstName: student.firstName,
            lastName: student.lastName,
            semester: student.semester,
            specialty: student.specialty,
            shift: student.shift,
            email: student.email
          }
        : null
    },
    student: student
      ? {
          id: String(student._id),
          firstName: student.firstName,
          lastName: student.lastName,
          semester: student.semester,
          specialty: student.specialty,
          shift: student.shift,
          email: student.email
        }
      : null
  });
};
