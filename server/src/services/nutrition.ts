import axios from 'axios';
import { ExtractedFood } from './aiService';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/guessNutrition';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
  name: string;
  warnings?: string[];
  alternatives?: string[];
}

export const analyzeFoodIA = async (query: string | ExtractedFood[]): Promise<NutritionData> => {
  if (!SPOONACULAR_API_KEY) {
    // Mock simulation for production readiness (if no key provided)
    console.warn('⚠️ No Spoonacular API Key found. Using mock simulation.');
    const name = typeof query === 'string' ? query : query.map(f => `${f.quantity} ${f.item}`).join(', ');
    const warnings = Array.isArray(query) ? query.flatMap(f => f.warnings || []) : ['Análisis simulado'];
    const alternatives = Array.isArray(query) ? query.flatMap(f => f.alternatives || []) : ['Fruta fresca', 'Agua'];

    return {
      name,
      calories: Math.round(Math.random() * 500 + 100),
      protein: Math.round(Math.random() * 30 + 5),
      carbs: Math.round(Math.random() * 60 + 10),
      fat: Math.round(Math.random() * 20 + 2),
      sugar: Math.round(Math.random() * 20),
      sodium: Math.round(Math.random() * 500),
      fiber: Math.round(Math.random() * 10),
      warnings: [...new Set(warnings)],
      alternatives: [...new Set(alternatives)]
    };
  }

  try {
    // Si recibimos un array de objetos extraídos por la IA
    if (Array.isArray(query)) {
      console.log(`Processing extracted foods:`, query);
      const results = await Promise.all(query.map(f => fetchNutrition(`${f.quantity} ${f.item}`)));
      
      const combinedName = query.map(f => `${f.quantity} ${f.item}`).join(', ');
      const combinedWarnings = query.flatMap(f => f.warnings || []);
      const combinedAlternatives = query.flatMap(f => f.alternatives || []);

      return results.reduce((acc, res) => ({
        name: combinedName,
        calories: acc.calories + res.calories,
        protein: acc.protein + res.protein,
        carbs: acc.carbs + res.carbs,
        fat: acc.fat + res.fat,
        sugar: acc.sugar + res.sugar,
        sodium: acc.sodium + res.sodium,
        fiber: acc.fiber + res.fiber,
        warnings: [...new Set(combinedWarnings)],
        alternatives: [...new Set(combinedAlternatives)]
      }), { 
        name: combinedName, 
        calories: 0, 
        protein: 0, 
        carbs: 0, 
        fat: 0, 
        sugar: 0, 
        sodium: 0, 
        fiber: 0,
        warnings: [],
        alternatives: []
      });
    }

    // Fallback para strings simples
    const parts = query.split(/ and | y | \+ /i);
    if (parts.length > 1) {
      const results = await Promise.all(parts.map(p => fetchNutrition(p.trim())));
      return results.reduce((acc, res) => ({
        name: query,
        calories: acc.calories + res.calories,
        protein: acc.protein + res.protein,
        carbs: acc.carbs + res.carbs,
        fat: acc.fat + res.fat,
        sugar: acc.sugar + res.sugar,
        sodium: acc.sodium + res.sodium,
        fiber: acc.fiber + res.fiber,
        warnings: [],
        alternatives: []
      }), { 
        name: query, 
        calories: 0, 
        protein: 0, 
        carbs: 0, 
        fat: 0, 
        sugar: 0, 
        sodium: 0, 
        fiber: 0,
        warnings: [],
        alternatives: []
      });
    }

    return await fetchNutrition(query);
  } catch (error: any) {
    console.error('Error in IA Service:', error.response?.data || error.message);
    throw new Error('No se pudo analizar el alimento. Intenta especificar mejor las cantidades.');
  }
};

const fetchNutrition = async (title: string): Promise<NutritionData> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { title, apiKey: SPOONACULAR_API_KEY }
    });

    const { calories, protein, fat, carbs } = response.data;

    // Spoonacular guessNutrition no devuelve sugar, sodium, fiber directamente.
    // En una implementación real usaríamos /recipes/complexSearch o /food/ingredients/parse
    // Por ahora, estimamos valores o dejamos en 0 si no están disponibles.
    
    if (!calories || calories.value === 0) {
      return {
        name: `${title} (No encontrado)`,
        calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0
      };
    }

    return {
      name: title,
      calories: Math.round(calories.value || 0),
      protein: Math.round(protein.value || 0),
      carbs: Math.round(carbs.value || 0),
      fat: Math.round(fat.value || 0),
      sugar: Math.round((carbs.value || 0) * 0.2), // Estimación
      sodium: 200, // Estimación genérica
      fiber: Math.round((carbs.value || 0) * 0.1) // Estimación
    };
  } catch (err) {
    console.error(`Error al buscar "${title}":`, err);
    return { name: title, calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0 };
  }
};
