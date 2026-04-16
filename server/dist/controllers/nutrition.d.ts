import { Request, Response } from 'express';
export declare const analyzeNutrition: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
