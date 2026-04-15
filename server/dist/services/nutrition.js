"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFoodIA = void 0;
const axios_1 = __importDefault(require("axios"));
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/food/ingredients';
const analyzeFoodIA = async (query) => {
    if (!SPOONACULAR_API_KEY) {
        // Mock simulation for production readiness (if no key provided)
        console.warn('⚠️ No Spoonacular API Key found. Using mock simulation.');
        return {
            name: query,
            calories: Math.random() * 500 + 100,
            protein: Math.random() * 30 + 5,
            carbs: Math.random() * 60 + 10,
            fat: Math.random() * 20 + 2
        };
    }
    try {
        // 1. Search for food ID
        const searchRes = await axios_1.default.get(`${BASE_URL}/search`, {
            params: { query, number: 1, apiKey: SPOONACULAR_API_KEY }
        });
        if (searchRes.data.results.length === 0) {
            throw new Error('Alimento no encontrado');
        }
        const foodId = searchRes.data.results[0].id;
        // 2. Get nutrition info by ID
        const infoRes = await axios_1.default.get(`${BASE_URL}/${foodId}/information`, {
            params: { amount: 100, unit: 'grams', apiKey: SPOONACULAR_API_KEY }
        });
        const nutrients = infoRes.data.nutrition.nutrients;
        const getVal = (name) => nutrients.find((n) => n.name === name)?.amount || 0;
        return {
            name: infoRes.data.name,
            calories: getVal('Calories'),
            protein: getVal('Protein'),
            carbs: getVal('Carbohydrates'),
            fat: getVal('Fat')
        };
    }
    catch (error) {
        console.error('Error in IA Service:', error);
        throw new Error('Error al analizar el alimento con IA');
    }
};
exports.analyzeFoodIA = analyzeFoodIA;
//# sourceMappingURL=nutrition.js.map