"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDish = exports.updateDish = exports.createDish = exports.getDishes = void 0;
const db_1 = __importDefault(require("../config/db"));
const nutrition_1 = require("../services/nutrition");
const getDishes = async (req, res, next) => {
    try {
        const dishes = await db_1.default.dish.findMany({ where: { available: true } });
        res.status(200).json({ success: true, data: dishes });
    }
    catch (error) {
        next(error);
    }
};
exports.getDishes = getDishes;
const createDish = async (req, res, next) => {
    const { name, description, price, category, autoMacros } = req.body;
    try {
        let macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        if (autoMacros) {
            const nutrition = await (0, nutrition_1.analyzeFoodIA)(name);
            macros = {
                calories: nutrition.calories,
                protein: nutrition.protein,
                carbs: nutrition.carbs,
                fat: nutrition.fat
            };
        }
        else {
            macros = {
                calories: req.body.calories || 0,
                protein: req.body.protein || 0,
                carbs: req.body.carbs || 0,
                fat: req.body.fat || 0
            };
        }
        const dish = await db_1.default.dish.create({
            data: {
                name,
                description,
                price,
                category,
                ...macros
            }
        });
        res.status(201).json({ success: true, data: dish });
    }
    catch (error) {
        next(error);
    }
};
exports.createDish = createDish;
const updateDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dish = await db_1.default.dish.update({
            where: { id: id },
            data: req.body
        });
        res.status(200).json({ success: true, data: dish });
    }
    catch (error) {
        next(error);
    }
};
exports.updateDish = updateDish;
const deleteDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db_1.default.dish.delete({ where: { id: id } });
        res.status(200).json({ success: true, message: 'Platillo eliminado' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDish = deleteDish;
//# sourceMappingURL=cafeteria.js.map