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
    
    // Most consumed dishes (top 5) using aggregation
    const topDishes = await FoodLog.aggregate([
      { $group: { _id: { dishId: '$dishId', itemName: '$itemName' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Calories per semester (average)
    const students = await Student.find().lean();
    const studentIds = students.map(s => s._id);
    const logs = await FoodLog.find({ studentId: { $in: studentIds } }).lean();

    const semesterAverages = students.reduce((acc: any, student: any) => {
      const semester = student.semester;
      if (!acc[semester]) acc[semester] = { total: 0, count: 0 };
      
      const studentLogs = logs.filter(l => l.studentId.toString() === student._id.toString());
      studentLogs.forEach(log => {
        acc[semester].total += log.calories;
        acc[semester].count++;
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
        semesterAverages 
      } 
    });
  } catch (error) {
    next(error);
  }
};
