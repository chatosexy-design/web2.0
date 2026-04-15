
const axios = require('axios');

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

/**
 * @desc    Buscar alimentos en la API externa
 * @route   GET /api/nutrition/search
 * @access  Público
 */
exports.searchNutrition = async (req, res, next) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ success: false, error: 'Se requiere un término de búsqueda' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/food/ingredients/search`, {
            params: {
                query,
                apiKey: API_KEY,
                number: 10
            }
        });
        res.status(200).json({ success: true, count: response.data.results.length, data: response.data });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Obtener detalles nutricionales por ID de alimento
 * @route   GET /api/nutrition/info/:id
 * @access  Público
 */
exports.getNutritionInfo = async (req, res, next) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/food/ingredients/${id}/information`, {
            params: {
                amount: 100,
                unit: 'grams',
                apiKey: API_KEY
            }
        });
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        next(error);
    }
};
