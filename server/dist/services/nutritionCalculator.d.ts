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
export declare class NutritionCalculator {
    /**
     * Calcula el TMB (Tasa Metabólica Basal) usando Harris-Benedict revisado por Mifflin-St Jeor.
     */
    static calculateTMB(weight: number, height: number, age: number, sex: string): number;
    /**
     * Calcula el Gasto Energético Total Diario (GETD) basado en el nivel de actividad.
     */
    static calculateDailyCalories(tmb: number, activityLevel: string, goal: string): number;
    /**
     * Calcula el IMC y su categoría.
     */
    static calculateBMI(weight: number, height: number): {
        bmi: number;
        category: string;
    };
    /**
     * Genera metas nutricionales detalladas.
     */
    static getDetailedTargets(student: any): NutritionalTargets;
}
