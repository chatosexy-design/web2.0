/**
 * @fileoverview Servicio de análisis nutricional basado en los lineamientos de la OMS.
 * Proporciona diagnósticos y recomendaciones personalizadas para los estudiantes.
 */

import { NutritionalTargets } from './nutritionCalculator';

/**
 * Estructura de un mensaje estructurado de recomendación.
 */
export interface OMSRecommendation {
  category: 'calories' | 'protein' | 'carbs' | 'fat' | 'sugar' | 'sodium' | 'fiber' | 'balance';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestedActions: string[];
}

/**
 * Clase encargada de analizar las métricas nutricionales y generar consejos.
 */
export class OMSAdvisor {
  /**
   * Analiza los registros de alimentos del día actual y genera recomendaciones.
   * 
   * @param {any[]} dailyLogs - Lista de registros de alimentos del estudiante hoy.
   * @param {NutritionalTargets} targets - Metas personalizadas del estudiante.
   * @returns {OMSRecommendation[]} Lista de recomendaciones estructuradas.
   */
  public static analyzeDailyIntake(dailyLogs: any[], targets?: NutritionalTargets): OMSRecommendation[] {
    const recommendations: OMSRecommendation[] = [];

    // Valores por defecto si no hay targets personalizados
    const defaultTargets: NutritionalTargets = {
      calories: 2000,
      protein: 75,
      carbs: 275,
      fat: 65,
      sugar: 50,
      sodium: 2300,
      fiber: 30,
      water: 2.5,
      bmi: 22,
      bmiCategory: 'Normal'
    };

    const activeTargets = targets || defaultTargets;

    if (!dailyLogs || dailyLogs.length === 0) {
      return [{
        category: 'balance',
        priority: 'medium',
        title: '¡Inicia tu registro!',
        description: 'Aún no has registrado alimentos hoy. Según el ODS Hambre Cero, llevar un control nutricional es clave para un desarrollo sostenible.',
        suggestedActions: ['Registra tu primera comida con Lettie', 'Planea tu siguiente comida equilibrada']
      }];
    }

    // Calcular totales del día
    const totals = dailyLogs.reduce((acc, log) => {
      acc.calories += log.calories || 0;
      acc.protein += log.protein || 0;
      acc.carbs += log.carbs || 0;
      acc.fat += log.fat || 0;
      acc.sugar += log.sugar || 0;
      acc.sodium += log.sodium || 0;
      acc.fiber += log.fiber || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0, fiber: 0 });

    // 1. Análisis de Calorías
    this.checkCalories(totals.calories, activeTargets.calories, recommendations);

    // 2. Análisis de Macronutrientes
    this.checkMacros(totals, activeTargets, recommendations);

    // 3. Análisis de Azúcar y Sodio
    this.checkWarnings(totals, activeTargets, recommendations);

    return recommendations;
  }

  private static checkCalories(calories: number, target: number, recs: OMSRecommendation[]) {
    if (calories > target * 1.2) {
      recs.push({
        category: 'calories',
        priority: 'high',
        title: 'Exceso Calórico Detectado',
        description: `Has superado tu meta diaria de ${target} kcal.`,
        suggestedActions: [
          'Aumenta tu actividad física hoy',
          'Elige opciones más ligeras para tu siguiente comida',
          'Prioriza el consumo de agua simple'
        ]
      });
    } else if (calories > 0 && calories < target * 0.5 && new Date().getHours() > 18) {
      recs.push({
        category: 'calories',
        priority: 'medium',
        title: 'Ingesta Calórica Baja',
        description: 'Es posible que no estés cubriendo tus necesidades energéticas mínimas.',
        suggestedActions: [
          'Asegúrate de no saltarte comidas',
          'Incluye una cena nutritiva con proteínas y vegetales'
        ]
      });
    }
  }

  private static checkMacros(totals: any, targets: NutritionalTargets, recs: OMSRecommendation[]) {
    // Proteínas
    if (totals.protein < targets.protein * 0.8) {
      recs.push({
        category: 'protein',
        priority: 'medium',
        title: 'Déficit de Proteínas',
        description: 'Tu consumo de proteínas es bajo para el mantenimiento de tus músculos.',
        suggestedActions: [
          'Integra legumbres (frijoles, lentejas) o huevo',
          'Añade pollo, atún o lácteos bajos en grasa',
          'Considera frutos secos como snack'
        ]
      });
    }

    // Fibra
    if (totals.fiber < targets.fiber * 0.6) {
      recs.push({
        category: 'fiber',
        priority: 'medium',
        title: 'Poca Fibra en tu Dieta',
        description: 'La fibra es esencial para tu digestión y salud intestinal.',
        suggestedActions: [
          'Aumenta el consumo de verduras frescas',
          'Elige cereales integrales y avena',
          'Consume frutas con cáscara'
        ]
      });
    }
  }

  private static checkWarnings(totals: any, targets: NutritionalTargets, recs: OMSRecommendation[]) {
    // Azúcar
    if (totals.sugar > targets.sugar) {
      recs.push({
        category: 'sugar',
        priority: 'high',
        title: 'Exceso de Azúcar',
        description: 'Has superado el límite diario de azúcar recomendado.',
        suggestedActions: [
          'Sustituye refrescos por agua natural',
          'Evita dulces y pan dulce por hoy',
          'Prefiere frutas naturales si tienes antojo de algo dulce'
        ]
      });
    }

    // Sodio
    if (totals.sodium > targets.sodium) {
      recs.push({
        category: 'sodium',
        priority: 'medium',
        title: 'Alto Consumo de Sodio',
        description: 'El exceso de sal puede afectar tu presión arterial a largo plazo.',
        suggestedActions: [
          'Reduce el uso de sal de mesa',
          'Evita alimentos ultraprocesados y enlatados',
          'Bebe más agua para ayudar a tu cuerpo'
        ]
      });
    }
  }
}
