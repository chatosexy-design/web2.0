/**
 * @fileoverview Servicio de análisis nutricional basado en los lineamientos de la OMS.
 * Proporciona diagnósticos y recomendaciones personalizadas para los estudiantes.
 */

import { FoodLogDocument } from '../models/FoodLog';

/**
 * Estructura de un mensaje estructurado de recomendación.
 */
export interface OMSRecommendation {
  category: 'calories' | 'protein' | 'carbs' | 'fat' | 'balance';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestedActions: string[];
}

/**
 * Límites y recomendaciones de la OMS (valores aproximados para adultos/jóvenes promedio).
 * Basado en una dieta de 2000 kcal de referencia.
 */
const OMS_GUIDELINES = {
  DAILY_CALORIES: 2000,
  PROTEIN_PERCENT: { min: 0.10, max: 0.15 },
  CARBS_PERCENT: { min: 0.55, max: 0.75 },
  FAT_PERCENT: { min: 0.15, max: 0.30 },
  SUGAR_PERCENT: 0.10, // Máximo 10% de la energía total (idealmente <5%)
};

/**
 * Clase encargada de analizar las métricas nutricionales y generar consejos.
 */
export class OMSAdvisor {
  /**
   * Analiza los registros de alimentos del día actual y genera recomendaciones.
   * 
   * @param {FoodLogDocument[]} dailyLogs - Lista de registros de alimentos del estudiante hoy.
   * @returns {OMSRecommendation[]} Lista de recomendaciones estructuradas.
   */
  public static analyzeDailyIntake(dailyLogs: any[]): OMSRecommendation[] {
    const recommendations: OMSRecommendation[] = [];

    if (!dailyLogs || dailyLogs.length === 0) {
      return [{
        category: 'balance',
        priority: 'medium',
        title: '¡Inicia tu registro!',
        description: 'Aún no has registrado alimentos hoy. Según la OMS, llevar un control es el primer paso para una vida saludable.',
        suggestedActions: ['Registra tu primera comida con Lettie', 'Planea tu siguiente comida equilibrada']
      }];
    }

    // Calcular totales del día
    const totals = dailyLogs.reduce((acc, log) => {
      acc.calories += log.calories || 0;
      acc.protein += log.protein || 0;
      acc.carbs += log.carbs || 0;
      acc.fat += log.fat || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // 1. Análisis de Calorías
    this.checkCalories(totals.calories, recommendations);

    // 2. Análisis de Macronutrientes (si hay suficientes calorías para calcular porcentajes)
    if (totals.calories > 100) {
      this.checkMacros(totals, recommendations);
    }

    return recommendations;
  }

  /**
   * Evalúa el consumo calórico total.
   * @private
   */
  private static checkCalories(calories: number, recs: OMSRecommendation[]) {
    if (calories > OMS_GUIDELINES.DAILY_CALORIES * 1.2) {
      recs.push({
        category: 'calories',
        priority: 'high',
        title: 'Exceso Calórico Detectado',
        description: 'Has superado significativamente la ingesta calórica diaria recomendada por la OMS (2000 kcal).',
        suggestedActions: [
          'Aumenta tu actividad física hoy',
          'Elige opciones más ligeras para tu siguiente comida',
          'Prioriza el consumo de agua simple sobre bebidas azucaradas'
        ]
      });
    } else if (calories > 0 && calories < OMS_GUIDELINES.DAILY_CALORIES * 0.5 && new Date().getHours() > 18) {
      recs.push({
        category: 'calories',
        priority: 'medium',
        title: 'Ingesta Calórica Baja',
        description: 'Es posible que no estés cubriendo tus necesidades energéticas mínimas para el día.',
        suggestedActions: [
          'Asegúrate de no saltarte comidas',
          'Incluye una cena nutritiva con proteínas y vegetales'
        ]
      });
    } else if (calories >= OMS_GUIDELINES.DAILY_CALORIES * 0.8 && calories <= OMS_GUIDELINES.DAILY_CALORIES * 1.1) {
      recs.push({
        category: 'calories',
        priority: 'low',
        title: '¡Excelente Meta Calórica!',
        description: 'Tu consumo de energía está dentro de los rangos recomendados por la OMS para un estilo de vida saludable.',
        suggestedActions: ['Mantén este equilibrio mañana', 'Sigue registrando tus progresos']
      });
    }
  }

  /**
   * Evalúa la proporción de macronutrientes (proteínas, carbohidratos, grasas).
   * @private
   */
  private static checkMacros(totals: any, recs: OMSRecommendation[]) {
    // 4 kcal por g de prote/carbo, 9 kcal por g de grasa
    const proteinKcal = totals.protein * 4;
    const carbsKcal = totals.carbs * 4;
    const fatKcal = totals.fat * 9;
    
    const pPercent = proteinKcal / totals.calories;
    const cPercent = carbsKcal / totals.calories;
    const fPercent = fatKcal / totals.calories;

    // Análisis de Grasas (OMS: < 30%)
    if (fPercent > OMS_GUIDELINES.FAT_PERCENT.max) {
      recs.push({
        category: 'fat',
        priority: 'high',
        title: 'Consumo Elevado de Grasas',
        description: 'Las grasas superan el 30% de tu ingesta total. La OMS advierte que esto aumenta el riesgo de enfermedades no transmisibles.',
        suggestedActions: [
          'Reduce el consumo de alimentos fritos o procesados',
          'Sustituye grasas saturadas por insaturadas (nueces, aguacate, pescado)',
          'Prefiere preparaciones al vapor o a la plancha'
        ]
      });
    }

    // Análisis de Proteínas (OMS: 10-15%)
    if (pPercent < OMS_GUIDELINES.PROTEIN_PERCENT.min) {
      recs.push({
        category: 'protein',
        priority: 'medium',
        title: 'Déficit de Proteínas',
        description: 'Tu consumo de proteínas es inferior al 10% recomendado para el mantenimiento de tejidos.',
        suggestedActions: [
          'Integra legumbres (frijoles, lentejas) en tu dieta',
          'Añade huevos, lácteos bajos en grasa o carnes magras',
          'Considera frutos secos como snack saludable'
        ]
      });
    }

    // Análisis de Carbohidratos (OMS: 55-75%)
    if (cPercent < OMS_GUIDELINES.CARBS_PERCENT.min) {
      recs.push({
        category: 'carbs',
        priority: 'medium',
        title: 'Aporte Energético Bajo',
        description: 'Los carbohidratos son tu principal fuente de energía. Estás por debajo del rango sugerido.',
        suggestedActions: [
          'Aumenta el consumo de cereales integrales',
          'Consume más frutas y verduras frescas (mínimo 400g/día según OMS)',
          'Evita los carbohidratos refinados (harinas blancas)'
        ]
      });
    }
  }
}
