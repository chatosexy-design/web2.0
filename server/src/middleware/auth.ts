import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    studentId?: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // LOGIN TEMPORALMENTE DESACTIVADO
  // Mock user for development
  req.user = {
    id: 'mock-user-id',
    role: 'STUDENT', // Default role
    studentId: 'mock-student-id'
  };
  return next();

  /* Logic to be re-enabled later:
  let token;
  ...
  */
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // LOGIN TEMPORALMENTE DESACTIVADO
    return next();

    /* Logic to be re-enabled later:
    if (!req.user || !roles.includes(req.user.role)) {
      ...
    }
    next();
    */
  };
};
