import { Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';
import { analyzeFoodIA } from '../services/nutrition';
import { OMSAdvisor } from '../services/omsAdvisor';

export const getStudentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let student;
    
    // Buscar en Supabase
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq(req.user?.studentId ? 'id' : 'user_id', req.user?.studentId || req.user?.id)
      .single();
    
    if (studentError || !studentData) {
      return res.status(404).json({ success: false, error: 'Estudiante no encontrado. Asegúrate de tener una cuenta de estudiante.' });
    }

    student = studentData;
    const studentId = student.id;

    // Generar código si falta
    if (!student.parent_access_code) {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data: updatedStudent, error: updateError } = await supabaseAdmin
        .from('students')
        .update({ parent_access_code: newCode })
        .eq('id', studentId)
        .select()
        .single();
      
      if (!updateError) student = updatedStudent;
    }

    // Obtener logs recientes
    const { data: logs, error: logsError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false })
      .limit(10);

    // Obtener logs de hoy para el asesor OMS
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const { data: dailyLogs, error: dailyLogsError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('student_id', studentId)
      .gte('date', startOfToday.toISOString());

    // Calcular targets personalizados
    const { NutritionCalculator } = await import('../services/nutritionCalculator');
    const targets = NutritionCalculator.getDetailedTargets({
      weight: student.weight,
      height: student.height,
      age: student.age,
      sex: student.sex,
      activityLevel: student.activity_level,
      goal: student.goal
    });

    // Transformar logs para el asesor (asegurar que campos coincidan)
    const formattedLogs = (dailyLogs || []).map(l => ({
      ...l,
      itemName: l.item_name,
      mealType: l.meal_type
    }));

    const recommendations = OMSAdvisor.analyzeDailyIntake(formattedLogs, targets);

    res.status(200).json({ 
      success: true, 
      data: { 
        ...student, 
        logs: logs || [],
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

    // Si no viene el studentId en el token (token viejo), buscarlo en la DB
    if (!studentId && req.user?.id) {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', req.user.id)
        .single();
      
      if (!studentError && student) {
        studentId = student.id;
      }
    }

    if (!studentId) {
      return res.status(401).json({ success: false, error: 'Perfil de estudiante no encontrado. Por favor reinicia sesión.' });
    }

    const { refineQuery } = await import('../services/aiService');
    const extractedFoods = await refineQuery(query);
    const nutrition = await analyzeFoodIA(extractedFoods);
    
    const { data: log, error: logError } = await supabase
      .from('food_logs')
      .insert([
        {
          student_id: studentId,
          item_name: nutrition.name,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          sugar: nutrition.sugar || 0,
          sodium: nutrition.sodium || 0,
          fiber: nutrition.fiber || 0,
          meal_type: mealType || 'refrigerio'
        }
      ])
      .select()
      .single();

    if (logError) return res.status(400).json({ success: false, error: logError.message });

    res.status(201).json({ 
      success: true, 
      data: {
        ...log,
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
    let studentId = req.user?.studentId;

    if (!studentId && req.user?.id) {
      const { data: student } = await supabase.from('students').select('id').eq('user_id', req.user.id).single();
      if (student) studentId = student.id;
    }

    if (!studentId) return res.status(401).json({ success: false, error: 'No autorizado' });

    let supabaseQuery = supabase
      .from('food_logs')
      .select('*')
      .eq('student_id', studentId);
    
    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      
      supabaseQuery = supabaseQuery
        .gte('date', startOfDay.toISOString())
        .lte('date', endOfDay.toISOString());
    }
    
    if (mealType && mealType !== 'todos') {
      supabaseQuery = supabaseQuery.eq('meal_type', mealType);
    }

    const { data: logs, error: logsError } = await supabaseQuery.order('date', { ascending: false });
    
    if (logsError) return res.status(400).json({ success: false, error: logsError.message });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

export const getNutritionStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let studentId = req.user?.studentId;

    if (!studentId && req.user?.id) {
      const { data: student } = await supabase.from('students').select('id').eq('user_id', req.user.id).single();
      if (student) studentId = student.id;
    }

    if (!studentId) return res.status(401).json({ success: false, error: 'No autorizado' });

    const { data: logs, error: logsError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (logsError) return res.status(400).json({ success: false, error: logsError.message });

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

  if (typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Código de acceso inválido' });
  }

  try {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('parent_access_code', code.toUpperCase())
      .single();

    if (studentError || !student) {
      return res.status(404).json({ success: false, error: 'Código de acceso inválido' });
    }

    const { data: logs, error: logsError } = await supabase
      .from('food_logs')
      .select('*')
      .eq('student_id', student.id);

    if (logsError) return res.status(400).json({ success: false, error: logsError.message });

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
        studentName: `${student.first_name} ${student.last_name}`,
        stats
      } 
    });
  } catch (error) {
    next(error);
  }
};
