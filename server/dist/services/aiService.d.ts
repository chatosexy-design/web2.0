export interface ExtractedFood {
    item: string;
    quantity: string;
}
export declare const refineQuery: (query: string) => Promise<ExtractedFood[]>;
