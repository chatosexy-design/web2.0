"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParentStats = exports.getNutritionStats = exports.getFoodHistory = exports.logDish = exports.logFoodIA = exports.getStudentProfile = void 0;
const Student_1 = __importDefault(require("../models/Student"));
const FoodLog_1 = __importDefault(require("../models/FoodLog"));
const Dish_1 = __importDefault(require("../models/Dish"));
const nutrition_1 = require("../services/nutrition");
const omsAdvisor_1 = require("../services/omsAdvisor");
const getStudentProfile = async (req, res, next) => {
    try {
        let student = await Student_1.default.findOne({
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
        const logs = await FoodLog_1.default.find({ student: student._id })
            .sort({ date: -1 })
            .limit(10);
        // Obtener logs de hoy para el asesor OMS
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const dailyLogs = await FoodLog_1.default.find({
            student: student._id,
            date: { $gte: startOfToday }
        });
        // Calcular targets personalizados
        const { NutritionCalculator } = await Promise.resolve().then(() => __importStar(require('../services/nutritionCalculator')));
        const targets = NutritionCalculator.getDetailedTargets({
            weight: student.weight,
            height: student.height,
            age: student.age,
            sex: student.sex,
            activityLevel: student.activityLevel,
            goal: student.goal
        });
        const recommendations = omsAdvisor_1.OMSAdvisor.analyzeDailyIntake(dailyLogs, targets);
        res.status(200).json({
            success: true,
            data: {
                ...student.toObject(),
                logs,
                nutritionalTargets: targets,
                omsRecommendations: recommendations
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudentProfile = getStudentProfile;
const logFoodIA = async (req, res, next) => {
    const { query, mealType } = req.body;
    try {
        let studentId = req.user?.studentId;
        if (!studentId && req.user?.id) {
            const student = await Student_1.default.findOne({ user: req.user.id });
            if (student)
                studentId = student._id.toString();
        }
        if (!studentId) {
            return res.status(401).json({ success: false, error: 'Perfil de estudiante no encontrado.' });
        }
        const { refineQuery } = await Promise.resolve().then(() => __importStar(require('../services/aiService')));
        const extractedFoods = await refineQuery(query);
        const nutrition = await (0, nutrition_1.analyzeFoodIA)(extractedFoods);
        const log = await FoodLog_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.logFoodIA = logFoodIA;
const logDish = async (req, res, next) => {
    const { dishId, mealType } = req.body;
    try {
        let studentId = req.user?.studentId;
        if (!studentId && req.user?.id) {
            const student = await Student_1.default.findOne({ user: req.user.id });
            if (student)
                studentId = student._id.toString();
        }
        if (!studentId) {
            return res.status(401).json({ success: false, error: 'Perfil de estudiante no encontrado.' });
        }
        const dish = await Dish_1.default.findById(dishId);
        if (!dish) {
            return res.status(404).json({ success: false, error: 'Platillo no encontrado.' });
        }
        const log = await FoodLog_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.logDish = logDish;
const getFoodHistory = async (req, res, next) => {
    const { date, mealType } = req.query;
    try {
        let studentId = req.user?.studentId;
        if (!studentId && req.user?.id) {
            const student = await Student_1.default.findOne({ user: req.user.id });
            if (student)
                studentId = student._id.toString();
        }
        if (!studentId)
            return res.status(401).json({ success: false, error: 'No autorizado' });
        let query = { student: studentId };
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }
        if (mealType && mealType !== 'todos') {
            query.mealType = mealType;
        }
        const logs = await FoodLog_1.default.find(query).sort({ date: -1 });
        res.status(200).json({ success: true, data: logs });
    }
    catch (error) {
        next(error);
    }
};
exports.getFoodHistory = getFoodHistory;
const getNutritionStats = async (req, res, next) => {
    try {
        let studentId = req.user?.studentId;
        if (!studentId && req.user?.id) {
            const student = await Student_1.default.findOne({ user: req.user.id });
            if (student)
                studentId = student._id.toString();
        }
        if (!studentId)
            return res.status(401).json({ success: false, error: 'No autorizado' });
        const logs = await FoodLog_1.default.find({ student: studentId }).sort({ date: -1 });
        // Aggregate by day
        const stats = (logs || []).reduce((acc, log) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getNutritionStats = getNutritionStats;
const getParentStats = async (req, res, next) => {
    const { code } = req.params;
    try {
        if (typeof code !== 'string') {
            return res.status(400).json({ success: false, error: 'Código de acceso inválido.' });
        }
        const student = await Student_1.default.findOne({ parentAccessCode: code.toUpperCase() });
        if (!student) {
            return res.status(404).json({ success: false, error: 'Código de acceso parental inválido.' });
        }
        const logs = await FoodLog_1.default.find({ student: student._id }).sort({ date: -1 });
        // Aggregate by day
        const stats = (logs || []).reduce((acc, log) => {
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
    }
    catch (error) {
        next(error);
    }
};
exports.getParentStats = getParentStats;
//# sourceMappingURL=students.js.map