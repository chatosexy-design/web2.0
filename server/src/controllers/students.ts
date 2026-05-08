import { Response, NextFunction } from 'express';
import Student from '../models/Student';
import FoodLog from '../models/FoodLog';
import Dish from '../models/Dish';
import { AuthRequest } from '../middleware/auth';
import { analyzeFoodIA } from '../services/nutrition';
import { OMSAdvisor } from '../services/omsAdvisor';

export const getStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let student = await Student.findOne({ 
      $or: [{ _id: req.user?.studentId }, { user: req.user?.id }]
    });
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Estudiante no encontrado.' });
    }

    // Generar código si falta
    if (!student.parentAccessCode) {
      student.parentAccessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      await student.save();
    }

    // Obtener logs recientes
    const logs = await FoodLog.find({ student: student._id })
      .sort({ date: -1 })
      .limit(10);

    // Obtener logs de hoy para el asesor OMS
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const dailyLogs = await FoodLog.find({ 
      student: student._id,
      date: { $gte: startOfToday }
    });

    // Calcular targets personalizados
    const { NutritionCalculator } = await import('../services/nutritionCalculator');
    const targets = NutritionCalculator.getDetailedTargets({
      weight: student.weight,
      height: student.height,
      age: student.age,
      sex: student.sex,
      activityLevel: student.activityLevel,
      goal: student.goal
    });

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
    let studentId = req.user?.studentId;

    if (!studentId && req.user?.id) {
      const student = await Student.findOne({ user: req.user.id });
      if (student) studentId = student._id.toString();
    }

    if (!studentId) {
      return res.status(401).json({ success: false, error: 'Perfil de estudiante no encontrado.' });
    }

    const { refineQuery } = await import('../services/aiService');
    const extractedFoods = await refineQuery(query);
    const nutrition = await analyzeFoodIA(extractedFoods);
    
    const log = await FoodLog.create({
      student: studentId,
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

export const logDish = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { dishId, mealType } = req.body;

  try {
    let studentId = req.user?.studentId;

    if (!studentId && req.user?.id) {
      const student = await Student.findOne({ user: req.user.id });
      if (student) studentId = student._id.toString();
    }

    if (!studentId) {
      return res.status(401).json({ success: false, error: 'Perfil de estudiante no encontrado.' });
    }

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ success: false, error: 'Platillo no encontrado.' });
    }

    const log = await FoodLog.create({
      student: studentId,
      dish: dishId,
      itemName: dish.name,
      calories: dish.calories,
      protein: dish.protein,
      carbs: dish.carbs,
      fat: dish.fat,
      sugar: dish.sugar || 0,
      sodium: dish.sodium || 0,
      fiber: dish.fiber || 0,
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
    let studentId = req.user?.studentId;

    if (!studentId && req.user?.id) {
      const student = await Student.findOne({ user: req.user.id });
      if (student) studentId = student._id.toString();
    }

    if (!studentId) return res.status(401).json({ success: false, error: 'No autorizado' });

    let query: any = { student: studentId };
    
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
    let studentId = req.user?.studentId;

    if (!studentId && req.user?.id) {
      const student = await Student.findOne({ user: req.user.id });
      if (student) studentId = student._id.toString();
    }

    if (!studentId) return res.status(401).json({ success: false, error: 'No autorizado' });

    const logs = await FoodLog.find({ student: studentId }).sort({ date: -1 });

    // Aggregate by day
    const stats = (logs || []).reduce((acc: any, log) => {
      const dateStr = new Date(log.date).toDateString();
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
      acc[dateStr].calories += Number(log.calories) || 0;
      acc[dateStr].protein += Number(log.protein) || 0;
      acc[dateStr].carbs += Number(log.carbs) || 0;
      acc[dateStr].fat += Number(log.fat) || 0;
      acc[dateStr].sugar += Number(log.sugar) || 0;
      acc[dateStr].sodium += Number(log.sodium) || 0;
      acc[dateStr].fiber += Number(log.fiber) || 0;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getParentStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { code } = req.params;

  try {
    if (typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'Código de acceso inválido.' });
    }

    const student = await Student.findOne({ parentAccessCode: code.toUpperCase() });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Código de acceso parental inválido.' });
    }

    const logs = await FoodLog.find({ student: student._id }).sort({ date: -1 });

    // Aggregate by day
    const stats = (logs || []).reduce((acc: any, log) => {
      const dateStr = new Date(log.date).toDateString();
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
      acc[dateStr].calories += Number(log.calories) || 0;
      acc[dateStr].protein += Number(log.protein) || 0;
      acc[dateStr].carbs += Number(log.carbs) || 0;
      acc[dateStr].fat += Number(log.fat) || 0;
      acc[dateStr].sugar += Number(log.sugar) || 0;
      acc[dateStr].sodium += Number(log.sodium) || 0;
      acc[dateStr].fiber += Number(log.fiber) || 0;
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
