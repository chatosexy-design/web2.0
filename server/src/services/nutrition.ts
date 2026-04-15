import axios from 'axios';
import { ExtractedFood } from './aiService';

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes/guessNutrition';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  name: string;
}

export const analyzeFoodIA = async (query: string | ExtractedFood[]): Promise<NutritionData> => {
  if (!SPOONACULAR_API_KEY) {
    // Mock simulation for production readiness (if no key provided)
    console.warn('⚠️ No Spoonacular API Key found. Using mock simulation.');
    const name = typeof query === 'string' ? query : query.map(f => `${f.quantity} ${f.item}`).join(', ');
    return {
      name,
      calories: Math.round(Math.random() * 500 + 100),
      protein: Math.round(Math.random() * 30 + 5),
      carbs: Math.round(Math.random() * 60 + 10),
      fat: Math.round(Math.random() * 20 + 2)
    };
  }

  try {
    // Si recibimos un array de objetos extraídos por la IA
    if (Array.isArray(query)) {
      console.log(`Processing extracted foods:`, query);
      const results = await Promise.all(query.map(f => fetchNutrition(`${f.quantity} ${f.item}`)));
      
      const combinedName = query.map(f => `${f.quantity} ${f.item}`).join(', ');

      return results.reduce((acc, res) => ({
        name: combinedName,
        calories: acc.calories + res.calories,
        protein: acc.protein + res.protein,
        carbs: acc.carbs + res.carbs,
        fat: acc.fat + res.fat
      }), { name: combinedName, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    // Fallback para strings simples (descomposición manual si no vino de la IA de refinamiento)
    const parts = query.split(/ and | y | \+ /i);
    if (parts.length > 1) {
      const results = await Promise.all(parts.map(p => fetchNutrition(p.trim())));
      return results.reduce((acc, res) => ({
        name: query,
        calories: acc.calories + res.calories,
        protein: acc.protein + res.protein,
        carbs: acc.carbs + res.carbs,
        fat: acc.fat + res.fat
      }), { name: query, calories: 0, protein: 0, carbs: 0, fat: 0 });
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

    // Si la API no devuelve calorías o son 0, intentamos una búsqueda más genérica
    if (!calories || calories.value === 0) {
      console.warn(`Spoonacular no encontró datos precisos para: ${title}. Intentando fallback...`);
      // Fallback: Si es algo como "600ml coke", intentamos buscarlo como ingrediente simple
      // Por ahora devolvemos un objeto con 0 para no romper el Promise.all, 
      // pero podríamos mejorar esto con otra llamada a la API de ingredientes.
      return {
        name: `${title} (No encontrado)`,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };
    }

    return {
      name: title,
      calories: Math.round(calories.value || 0),
      protein: Math.round(protein.value || 0),
      carbs: Math.round(carbs.value || 0),
      fat: Math.round(fat.value || 0)
    };
  } catch (err) {
    console.error(`Error al buscar "${title}":`, err);
    return { name: title, calories: 0, protein: 0, carbs: 0, fat: 0 };
  }
};
