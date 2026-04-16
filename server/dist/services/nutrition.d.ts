import { ExtractedFood } from './aiService';
export interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    name: string;
}
export declare const analyzeFoodIA: (query: string | ExtractedFood[]) => Promise<NutritionData>;
