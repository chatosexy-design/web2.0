import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '../types/roles';
import { supabase } from '../config/supabase';
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
    // 1) Intentar JWT interno
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
    // 2) Fallback: token de Supabase (Google OAuth / sesión Supabase)
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ success: false, error: 'Token inválido' });
    }

    const userId = data.user.id;
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', userId)
      .single();

    req.user = {
      id: userId,
      role: normalizeRole(profile?.role),
      studentId: student?.id
    };
    return next();
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
