"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDish = exports.updateDish = exports.createDish = exports.getDishes = void 0;
const Dish_1 = __importDefault(require("../models/Dish"));
const nutrition_1 = require("../services/nutrition");
const FULL_MENU = [
    { name: 'Chilaquiles Verdes con Pollo', description: 'Totopos horneados en salsa verde con pollo deshebrado, crema y queso.', price: 45, category: 'Desayunos', calories: 420, protein: 24, carbs: 38, fat: 18, trafficLight: 'verde' },
    { name: 'Torta de Jamon con Queso', description: 'Bolillo con jamon, queso, jitomate, lechuga y aguacate.', price: 35, category: 'Desayunos', calories: 390, protein: 18, carbs: 41, fat: 16, trafficLight: 'amarillo' },
    { name: 'Enchiladas Rojas', description: 'Orden de 4 enchiladas con pollo, lechuga, crema y queso fresco.', price: 50, category: 'Comidas', calories: 470, protein: 27, carbs: 42, fat: 20, trafficLight: 'verde' },
    { name: 'Tacos Dorados de Papa', description: 'Orden de 4 tacos dorados acompañados de lechuga, queso y salsa.', price: 40, category: 'Comidas', calories: 360, protein: 10, carbs: 39, fat: 17, trafficLight: 'verde' },
    { name: 'Hamburguesa Escolar', description: 'Hamburguesa sencilla con carne, queso amarillo, lechuga y jitomate.', price: 55, category: 'Comidas', calories: 520, protein: 26, carbs: 40, fat: 28, trafficLight: 'rojo' },
    { name: 'Quesadillas de Tinga', description: 'Dos quesadillas de maíz rellenas de tinga de pollo con crema.', price: 42, category: 'Comidas', calories: 410, protein: 21, carbs: 33, fat: 19, trafficLight: 'amarillo' },
    { name: 'Jugo de Mango 500 ml', description: 'Bebida natural de mango sin gas.', price: 22, category: 'Bebidas', calories: 120, protein: 1, carbs: 29, fat: 0, trafficLight: 'amarillo' },
    { name: 'Agua de Horchata 500 ml', description: 'Agua fresca de horchata servida fría.', price: 20, category: 'Bebidas', calories: 140, protein: 1, carbs: 32, fat: 1, trafficLight: 'amarillo' },
    { name: 'Fruta Picada', description: 'Vaso mediano de fruta de temporada con limón y chile en polvo.', price: 25, category: 'Snacks', calories: 95, protein: 1, carbs: 23, fat: 0, trafficLight: 'verde' },
    { name: 'Yogurt con Granola', description: 'Vaso individual de yogurt natural con granola y fruta.', price: 28, category: 'Snacks', calories: 210, protein: 8, carbs: 30, fat: 6, trafficLight: 'verde' }
];
const getDishes = async (req, res, next) => {
    try {
        let dishes = await Dish_1.default.find({ available: true })
            .sort({ category: 1, name: 1 });
        if (!dishes || dishes.length === 0) {
            dishes = await Dish_1.default.insertMany(FULL_MENU);
        }
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
        const dish = await Dish_1.default.create({
            name,
            description,
            price,
            category,
            ...macros
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
        const dish = await Dish_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!dish)
            return res.status(404).json({ success: false, error: 'Platillo no encontrado' });
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
        await Dish_1.default.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Platillo eliminado' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDish = deleteDish;
//# sourceMappingURL=cafeteria.js.map