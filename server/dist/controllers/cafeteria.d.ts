import { Request, Response, NextFunction } from 'express';
export declare const getDishes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createDish: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDish: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDish: (req: Request, res: Response, next: NextFunction) => Promise<void>;
