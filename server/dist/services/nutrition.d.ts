import { ExtractedFood } from './aiService';
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
export declare const analyzeFoodIA: (query: string | ExtractedFood[]) => Promise<NutritionData>;
