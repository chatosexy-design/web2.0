import { Response, NextFunction } from 'express';
import Student from '../models/Student';
import FoodLog from '../models/FoodLog';
import { AuthRequest } from '../middleware/auth';
import { analyzeFoodIA } from '../services/nutrition';
import { OMSAdvisor } from '../services/omsAdvisor';

export const getStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.studentId) {
    return res.status(403).json({ success: false, error: 'No tienes permisos de estudiante' });
  }

  try {
    const student = await Student.findById(req.user.studentId).lean();
    const logs = await FoodLog.find({ studentId: req.user.studentId })
      .sort({ date: -1 })
      .limit(10);

    // Obtener logs de hoy para el asesor OMS
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const dailyLogs = await FoodLog.find({
      studentId: req.user.studentId,
      date: { $gte: startOfToday }
    }).lean();

    const recommendations = OMSAdvisor.analyzeDailyIntake(dailyLogs);

    res.status(200).json({ 
      success: true, 
      data: { 
        ...student, 
        logs,
        omsRecommendations: recommendations 
      } 
    });
  } catch (error) {
    next(error);
  }
};

export const logFoodIA = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { query, mealType } = req.body;

  try {
    const nutrition = await analyzeFoodIA(query);
    
    const log = await FoodLog.create({
      studentId: req.user?.studentId!,
      itemName: nutrition.name,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      mealType: mealType || 'refrigerio'
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

export const getFoodHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { date, mealType } = req.query;
  
  try {
    const query: any = { studentId: req.user?.studentId! };
    
    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (mealType && mealType !== 'todos') {
      query.mealType = mealType;
    }

    const logs = await FoodLog.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

export const getNutritionStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await FoodLog.find({ studentId: req.user?.studentId! })
      .sort({ date: -1 });

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
