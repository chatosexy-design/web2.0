"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const Student_1 = __importDefault(require("../models/Student"));
const FoodLog_1 = __importDefault(require("../models/FoodLog"));
const getDashboardStats = async (req, res, next) => {
    try {
        const totalStudents = await Student_1.default.countDocuments();
        const totalUsers = await User_1.default.countDocuments();
        const totalFoodLogs = await FoodLog_1.default.countDocuments();
        // Top platillos consumidos
        const topDishes = await FoodLog_1.default.aggregate([
            { $group: { _id: "$itemName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        // Promedios por semestre
        const semesterAverages = await Student_1.default.aggregate([
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=admin.js.map