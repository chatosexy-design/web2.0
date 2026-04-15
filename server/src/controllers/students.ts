import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { analyzeFoodIA } from '../services/nutrition';

export const getStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.studentId) {
    return res.status(403).json({ success: false, error: 'No tienes permisos de estudiante' });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.studentId },
      include: { logs: { take: 10, orderBy: { date: 'desc' } } }
    });

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

export const logFoodIA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { query } = req.body;

  try {
    const nutrition = await analyzeFoodIA(query);
    
    const log = await prisma.foodLog.create({
      data: {
        studentId: req.user?.studentId!,
        itemName: nutrition.name,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat
      }
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

export const getNutritionStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await prisma.foodLog.findMany({
      where: { studentId: req.user?.studentId! },
      orderBy: { date: 'desc' }
    });

    // Aggregate by day (simple logic)
    const stats = logs.reduce((acc: any, log) => {
      const dateStr = log.date.toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      acc[dateStr].calories += log.calories;
      acc[dateStr].protein += log.protein;
      acc[dateStr].carbs += log.carbs;
      acc[dateStr].fat += log.fat;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
