import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getStudentProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logFoodIA: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getNutritionStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
