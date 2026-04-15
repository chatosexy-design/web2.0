"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNutritionStats = exports.logFoodIA = exports.getStudentProfile = void 0;
const db_1 = __importDefault(require("../config/db"));
const nutrition_1 = require("../services/nutrition");
const getStudentProfile = async (req, res, next) => {
    if (!req.user?.studentId) {
        return res.status(403).json({ success: false, error: 'No tienes permisos de estudiante' });
    }
    try {
        const student = await db_1.default.student.findUnique({
            where: { id: req.user.studentId },
            include: { logs: { take: 10, orderBy: { date: 'desc' } } }
        });
        res.status(200).json({ success: true, data: student });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentProfile = getStudentProfile;
const logFoodIA = async (req, res, next) => {
    const { query } = req.body;
    try {
        const nutrition = await (0, nutrition_1.analyzeFoodIA)(query);
        const log = await db_1.default.foodLog.create({
            data: {
                studentId: req.user?.studentId,
                itemName: nutrition.name,
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat
            }
        });
        res.status(201).json({ success: true, data: log });
    }
    catch (error) {
        next(error);
    }
};
exports.logFoodIA = logFoodIA;
const getNutritionStats = async (req, res, next) => {
    try {
        const logs = await db_1.default.foodLog.findMany({
            where: { studentId: req.user?.studentId },
            orderBy: { date: 'desc' }
        });
        // Aggregate by day (simple logic)
        const stats = logs.reduce((acc, log) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getNutritionStats = getNutritionStats;
//# sourceMappingURL=students.js.map