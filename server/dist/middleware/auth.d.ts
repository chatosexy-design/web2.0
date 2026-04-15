import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: Role;
        studentId?: string;
    };
}
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const authorize: (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
