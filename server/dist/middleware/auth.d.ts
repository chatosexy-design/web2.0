import { Request, Response, NextFunction } from 'express';
import type { Role } from '../types/roles';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: Role;
        studentId?: string;
    };
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const authorize: (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
