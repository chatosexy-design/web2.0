export interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    name: string;
}
export declare const analyzeFoodIA: (query: string) => Promise<NutritionData>;
