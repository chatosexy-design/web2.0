"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const getDashboardStats = async (req, res, next) => {
    try {
        const totalStudents = await db_1.default.student.count();
        const totalUsers = await db_1.default.user.count();
        const totalFoodLogs = await db_1.default.foodLog.count();
        // Most consumed dishes (top 5)
        const topDishes = await db_1.default.foodLog.groupBy({
            by: ['dishId', 'itemName'],
            _count: { dishId: true },
            orderBy: { _count: { dishId: 'desc' } },
            take: 5
        });
        // Calories per group (average)
        const groupStats = await db_1.default.student.findMany({
            include: {
                logs: {
                    select: { calories: true }
                }
            }
        });
        const groupAverages = groupStats.reduce((acc, student) => {
            const group = student.group;
            if (!acc[group])
                acc[group] = { total: 0, count: 0 };
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=admin.js.map