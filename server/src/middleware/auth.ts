import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '../types/roles';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    studentId?: string;
  };
}

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
      role: Role;
      studentId?: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
      studentId: decoded.studentId
    };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token inválido' });
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
