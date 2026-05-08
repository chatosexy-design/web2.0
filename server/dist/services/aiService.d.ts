export interface ExtractedFood {
    item: string;
    quantity: string;
    alternatives?: string[];
    warnings?: string[];
}
export declare const refineQuery: (query: string) => Promise<ExtractedFood[]>;
