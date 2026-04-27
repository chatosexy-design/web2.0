import { Response, NextFunction } from 'express';
import Student from '../models/Student';
import FoodLog from '../models/FoodLog';
import { AuthRequest } from '../middleware/auth';
import { analyzeFoodIA } from '../services/nutrition';
import { OMSAdvisor } from '../services/omsAdvisor';

export const getStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let student;
    
    // Intentar buscar por studentId del token, si no existe, buscar por userId
    if (req.user?.studentId) {
      student = await Student.findById(req.user.studentId);
    } else if (req.user?.id) {
      student = await Student.findOne({ userId: req.user.id });
    }
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Estudiante no encontrado. Asegúrate de tener una cuenta de estudiante.' });
    }

    const studentId = student._id;

    // Generate code if missing (for legacy users)
    if (!student.parentAccessCode) {
      let isUnique = false;
      let newCode = '';
      
      while (!isUnique) {
        newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const existing = await Student.findOne({ parentAccessCode: newCode });
        if (!existing) isUnique = true;
      }
      
      student = await Student.findByIdAndUpdate(
        studentId,
        { parentAccessCode: newCode },
        { new: true }
      );
    }

    const logs = await FoodLog.find({ studentId })
      .sort({ date: -1 })
      .limit(10);

    // Obtener logs de hoy para el asesor OMS
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const dailyLogs = await FoodLog.find({
      studentId,
      date: { $gte: startOfToday }
    }).lean();

    // Calcular targets personalizados
    const { NutritionCalculator } = await import('../services/nutritionCalculator');
    const targets = NutritionCalculator.getDetailedTargets(student);

    const recommendations = OMSAdvisor.analyzeDailyIntake(dailyLogs, targets);

    res.status(200).json({ 
      success: true, 
      data: { 
        ...student.toObject(), 
        logs,
        nutritionalTargets: targets,
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
    const { refineQuery } = await import('../services/aiService');
    const extractedFoods = await refineQuery(query);
    const nutrition = await analyzeFoodIA(extractedFoods);
    
    const log = await FoodLog.create({
      studentId: req.user?.studentId!,
      itemName: nutrition.name,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      sugar: nutrition.sugar || 0,
      sodium: nutrition.sodium || 0,
      fiber: nutrition.fiber || 0,
      mealType: mealType || 'refrigerio'
    });

    res.status(201).json({ 
      success: true, 
      data: {
        ...log.toObject(),
        warnings: nutrition.warnings,
        alternatives: nutrition.alternatives
      } 
    });
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

    // Aggregate by day (enhanced logic)
    const stats = logs.reduce((acc: any, log) => {
      const dateStr = log.date.toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = { 
          calories: 0, 
          protein: 0, 
          carbs: 0, 
          fat: 0,
          sugar: 0,
          sodium: 0,
          fiber: 0
        };
      }
      acc[dateStr].calories += log.calories || 0;
      acc[dateStr].protein += log.protein || 0;
      acc[dateStr].carbs += log.carbs || 0;
      acc[dateStr].fat += log.fat || 0;
      acc[dateStr].sugar += log.sugar || 0;
      acc[dateStr].sodium += log.sodium || 0;
      acc[dateStr].fiber += log.fiber || 0;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getParentStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { code } = req.params;

  if (typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Código de acceso inválido' });
  }

  try {
    const student = await Student.findOne({ parentAccessCode: code.toUpperCase() }).lean();
    if (!student) {
      return res.status(404).json({ success: false, error: 'Código de acceso inválido' });
    }

    const logs = await FoodLog.find({ studentId: student._id });

    // Aggregate by day
    const stats = logs.reduce((acc: any, log) => {
      const dateStr = log.date.toDateString();
      if (!acc[dateStr]) {
        acc[dateStr] = { 
          calories: 0, 
          protein: 0, 
          carbs: 0, 
          fat: 0,
          sugar: 0,
          sodium: 0,
          fiber: 0
        };
      }
      acc[dateStr].calories += log.calories || 0;
      acc[dateStr].protein += log.protein || 0;
      acc[dateStr].carbs += log.carbs || 0;
      acc[dateStr].fat += log.fat || 0;
      acc[dateStr].sugar += log.sugar || 0;
      acc[dateStr].sodium += log.sodium || 0;
      acc[dateStr].fiber += log.fiber || 0;
      return acc;
    }, {});

    res.status(200).json({ 
      success: true, 
      data: {
        studentName: `${student.firstName} ${student.lastName}`,
        stats
      } 
    });
  } catch (error) {
    next(error);
  }
};
