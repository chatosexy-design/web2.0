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
export declare class OMSAdvisor {
    /**
     * Analiza los registros de alimentos del día actual y genera recomendaciones.
     *
     * @param {any[]} dailyLogs - Lista de registros de alimentos del estudiante hoy.
     * @param {NutritionalTargets} targets - Metas personalizadas del estudiante.
     * @returns {OMSRecommendation[]} Lista de recomendaciones estructuradas.
     */
    static analyzeDailyIntake(dailyLogs: any[], targets?: NutritionalTargets): OMSRecommendation[];
    private static checkCalories;
    private static checkMacros;
    private static checkWarnings;
}
