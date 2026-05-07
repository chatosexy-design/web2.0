import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { count: totalStudents } = await supabase.from('students').select('*', { count: 'exact', head: true });
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalFoodLogs } = await supabase.from('food_logs').select('*', { count: 'exact', head: true });
    
    // Top platillos consumidos
    const { data: topDishesData } = await supabase
      .from('food_logs')
      .select('item_name, dish_id')
      .limit(1000); // Obtenemos una muestra para procesar en JS (Supabase free tier no soporta GROUP BY complejo en API directa)

    const dishCounts = (topDishesData || []).reduce((acc: any, log) => {
      const key = log.item_name;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topDishes = Object.entries(dishCounts)
      .map(([name, count]) => ({ _id: { itemName: name }, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    // Promedios por semestre
    const { data: students } = await supabase.from('students').select('id, semester');
    const { data: logs } = await supabase.from('food_logs').select('student_id, calories');

    const semesterAverages = (students || []).reduce((acc: any, student: any) => {
      const semester = student.semester;
      if (!acc[semester]) acc[semester] = { total: 0, count: 0 };
      
      const studentLogs = (logs || []).filter(l => l.student_id === student.id);
      studentLogs.forEach(log => {
        acc[semester].total += Number(log.calories);
        acc[semester].count++;
      });
      return acc;
    }, {});

    res.status(200).json({ 
      success: true, 
      data: { 
        totalStudents: totalStudents || 0, 
        totalUsers: totalUsers || 0, 
        totalFoodLogs: totalFoodLogs || 0, 
        topDishes, 
        semesterAverages 
      } 
    });
  } catch (error) {
    next(error);
  }
};
