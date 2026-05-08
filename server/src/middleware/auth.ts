import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '../types/roles';
import { Roles } from '../types/roles';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    studentId?: string;
  };
}

const normalizeRole = (role?: string): Role => {
  const upper = String(role || '').toUpperCase();
  if (upper === Roles.ADMIN) return Roles.ADMIN;
  if (upper === Roles.CAFETERIA) return Roles.CAFETERIA;
  return Roles.STUDENT;
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      role: string;
      studentId?: string;
    };

    req.user = {
      id: decoded.id,
      role: normalizeRole(decoded.role),
      studentId: decoded.studentId
    };
    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `El rol ${req.user?.role} no tiene permisos para esta acción`
      });
    }

    next();
  };
};
