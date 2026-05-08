"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refineQuery = void 0;
const axios_1 = __importDefault(require("axios"));
const HF_TOKEN = process.env.HF_TOKEN;
const MODEL_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-large';
const refineQuery = async (query) => {
    if (!HF_TOKEN) {
        console.warn('⚠️ No Hugging Face Token found. Returning basic split.');
        return query.split(/ y | and /i).map(f => ({
            item: f.trim(),
            quantity: '1',
            alternatives: ['Fruta fresca', 'Agua natural'],
            warnings: ['Información basada en estimación genérica']
        }));
    }
    try {
        // Prompt optimizado para extraer JSON-like format de alimentos, cantidades, advertencias y alternativas
        const prompt = `Task: Extract food items, quantities, health warnings, and healthy alternatives from this Spanish text.
    Format: Item|Quantity|Warnings (comma separated)|Alternatives (comma separated)
    Example: "dos hamburguesas y un refresco" -> Hamburguesa|2 units|Alta en grasa saturada, Exceso de sodio|Pechuga de pollo a la plancha, Ensalada; Refresco|1 unit|Exceso de azúcar, Calorías vacías|Agua natural, Agua de fruta sin azúcar
    Input: "${query}"
    Output:`;
        const response = await axios_1.default.post(MODEL_URL, {
            inputs: prompt,
            parameters: { max_new_tokens: 250, temperature: 0.1 }
        }, {
            headers: { Authorization: `Bearer ${HF_TOKEN}` }
        });
        if (Array.isArray(response.data) && response.data[0]?.generated_text) {
            const text = response.data[0].generated_text.replace(prompt, '').trim();
            const lines = text.split(';').map((l) => l.trim()).filter((l) => l.includes('|'));
            const extracted = lines.map((line) => {
                const [item, quantity, warnings, alternatives] = line.split('|');
                return {
                    item: item.trim(),
                    quantity: quantity.trim() || '1',
                    warnings: warnings ? warnings.split(',').map(w => w.trim()) : [],
                    alternatives: alternatives ? alternatives.split(',').map(a => a.trim()) : ['Opción saludable genérica']
                };
            });
            if (extracted.length > 0)
                return extracted;
        }
        // Fallback simple si el modelo no responde en el formato esperado
        return query.split(/ y | and | con /i).map(f => ({
            item: f.trim(),
            quantity: '1',
            warnings: ['Análisis simplificado'],
            alternatives: ['Fruta', 'Vegetales']
        }));
    }
    catch (error) {
        console.error('Error in Hugging Face Service:', error);
        return query.split(/ y | and /i).map(f => ({
            item: f.trim(),
            quantity: '1',
            warnings: ['Error en servicio IA'],
            alternatives: ['Agua natural']
        }));
    }
};
exports.refineQuery = refineQuery;
//# sourceMappingURL=aiService.js.map