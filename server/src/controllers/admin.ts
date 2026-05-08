import { Response, NextFunction } from 'express';
import User from '../models/User';
import Student from '../models/Student';
import FoodLog from '../models/FoodLog';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalFoodLogs = await FoodLog.countDocuments();
    
    // Top platillos consumidos
    const topDishes = await FoodLog.aggregate([
      { $group: { _id: "$itemName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Promedios por semestre
    const semesterAverages = await Student.aggregate([
      {
        $lookup: {
          from: 'foodlogs',
          localField: '_id',
          foreignField: 'student',
          as: 'logs'
        }
      },
      { $unwind: "$logs" },
      {
        $group: {
          _id: "$semester",
          total: { $sum: "$logs.calories" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ 
      success: true, 
      data: { 
        totalStudents, 
        totalUsers, 
        totalFoodLogs, 
        topDishes, 
        semesterAverages 
      } 
    });
  } catch (error) {
    next(error);
  }
};
