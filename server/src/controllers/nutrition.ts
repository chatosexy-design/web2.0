import { Request, Response } from 'express';
import { analyzeFoodIA } from '../services/nutrition';
import { refineQuery } from '../services/aiService';

export const analyzeNutrition = async (req: Request, res: Response) => {
  try {
    let { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Por favor, proporciona el texto del alimento a analizar.'
      });
    }

    // Refinar la consulta con Hugging Face (ahora devuelve un array de objetos)
    const extractedFoods = await refineQuery(query);
    console.log(`Query original: ${query} -> Alimentos extraídos:`, extractedFoods);

    const data = await analyzeFoodIA(extractedFoods);

    res.status(200).json({
      success: true,
      data,
      refinedQuery: extractedFoods.map(f => `${f.quantity} ${f.item}`).join(', ')
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor al analizar la nutrición.'
    });
  }
};
