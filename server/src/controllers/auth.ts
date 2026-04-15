import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, controlNumber } = req.body;

  try {
    // 1. Verificar si el número de control existe (Base de Datos Institucional simulada)
    const student = await prisma.student.findUnique({
      where: { controlNumber }
    });

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Número de control no encontrado en el sistema institucional' 
      });
    }

    // 2. Verificar si el estudiante ya tiene un usuario
    const existingUser = await prisma.user.findUnique({
      where: { studentId: student.id }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Este estudiante ya tiene una cuenta registrada' 
      });
    }

    // 3. Hashear password y crear usuario
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        studentId: student.id,
        role: Role.STUDENT,
        name: student.name
      }
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign(
    { id: user.id, role: user.role, studentId: user.studentId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
};
