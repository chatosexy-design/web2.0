/**
 * @fileoverview Servicio para cálculos nutricionales avanzados.
 * Basado en fórmulas estándar de nutrición (Harris-Benedict, IMC).
 */

export interface NutritionalTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  sugar: number;
  sodium: number;
  fiber: number;
  bmi: number;
  bmiCategory: string;
}

export class NutritionCalculator {
  /**
   * Calcula el TMB (Tasa Metabólica Basal) usando Harris-Benedict revisado por Mifflin-St Jeor.
   */
  public static calculateTMB(weight: number, height: number, age: number, sex: string): number {
    if (sex === 'M') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  /**
   * Calcula el Gasto Energético Total Diario (GETD) basado en el nivel de actividad.
   */
  public static calculateDailyCalories(tmb: number, activityLevel: string, goal: string): number {
    const activityFactors: { [key: string]: number } = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725,
      muy_activo: 1.9
    };

    let calories = tmb * (activityFactors[activityLevel] || 1.55);

    // Ajuste según meta
    if (goal === 'perder_peso') calories -= 500;
    if (goal === 'ganar_musculo') calories += 500;

    return Math.round(calories);
  }

  /**
   * Calcula el IMC y su categoría.
   */
  public static calculateBMI(weight: number, height: number): { bmi: number, category: string } {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    let category = '';

    if (bmi < 18.5) category = 'Bajo peso';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Sobrepeso';
    else category = 'Obesidad';

    return { bmi: parseFloat(bmi.toFixed(1)), category };
  }

  /**
   * Genera metas nutricionales detalladas.
   */
  public static getDetailedTargets(student: any): NutritionalTargets {
    const { weight, height, age, sex, activityLevel, goal } = student;
    
    const tmb = this.calculateTMB(weight, height, age, sex);
    const calories = this.calculateDailyCalories(tmb, activityLevel, goal);
    const { bmi, category: bmiCategory } = this.calculateBMI(weight, height);

    // Reparto de macros estándar (40% Carbos, 30% Proteína, 30% Grasa)
    // Se puede ajustar según la meta
    let pPercent = 0.25, cPercent = 0.45, fPercent = 0.30;
    
    if (goal === 'ganar_musculo') {
      pPercent = 0.30; cPercent = 0.50; fPercent = 0.20;
    } else if (goal === 'perder_peso') {
      pPercent = 0.35; cPercent = 0.35; fPercent = 0.30;
    }

    return {
      calories,
      protein: Math.round((calories * pPercent) / 4),
      carbs: Math.round((calories * cPercent) / 4),
      fat: Math.round((calories * fPercent) / 9),
      water: parseFloat((weight * 0.035).toFixed(1)), // 35ml por kg
      sugar: Math.round((calories * 0.10) / 4), // Máximo 10%
      sodium: 2300, // mg (máximo recomendado)
      fiber: sex === 'M' ? 38 : 25, // g
      bmi,
      bmiCategory
    };
  }
}
