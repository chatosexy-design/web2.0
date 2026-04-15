import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalUsers = await prisma.user.count();
    const totalFoodLogs = await prisma.foodLog.count();
    
    // Most consumed dishes (top 5)
    const topDishes = await prisma.foodLog.groupBy({
      by: ['dishId', 'itemName'],
      _count: { dishId: true },
      orderBy: { _count: { dishId: 'desc' } },
      take: 5
    });

    // Calories per group (average)
    const groupStats = await prisma.student.findMany({
      include: {
        logs: {
          select: { calories: true }
        }
      }
    });

    const groupAverages = groupStats.reduce((acc: any, student) => {
      const group = student.group;
      if (!acc[group]) acc[group] = { total: 0, count: 0 };
      student.logs.forEach(log => {
        acc[group].total += log.calories;
        acc[group].count++;
      });
      return acc;
    }, {});

    res.status(200).json({ 
      success: true, 
      data: { 
        totalStudents, 
        totalUsers, 
        totalFoodLogs, 
        topDishes, 
        groupAverages 
      } 
    });
  } catch (error) {
    next(error);
  }
};
