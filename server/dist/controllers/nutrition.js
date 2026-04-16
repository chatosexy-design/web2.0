"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeNutrition = void 0;
const nutrition_1 = require("../services/nutrition");
const aiService_1 = require("../services/aiService");
const analyzeNutrition = async (req, res) => {
    try {
        let { query } = req.body;
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Por favor, proporciona el texto del alimento a analizar.'
            });
        }
        // Refinar la consulta con Hugging Face (ahora devuelve un array de objetos)
        const extractedFoods = await (0, aiService_1.refineQuery)(query);
        console.log(`Query original: ${query} -> Alimentos extraídos:`, extractedFoods);
        const data = await (0, nutrition_1.analyzeFoodIA)(extractedFoods);
        res.status(200).json({
            success: true,
            data,
            refinedQuery: extractedFoods.map(f => `${f.quantity} ${f.item}`).join(', ')
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Error interno del servidor al analizar la nutrición.'
        });
    }
};
exports.analyzeNutrition = analyzeNutrition;
//# sourceMappingURL=nutrition.js.map