import axios from 'axios';

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-large';

export interface ExtractedFood {
  item: string;
  quantity: string;
}

export const refineQuery = async (query: string): Promise<ExtractedFood[]> => {
  if (!HF_TOKEN) {
    console.warn('⚠️ No Hugging Face Token found. Returning basic split.');
    return query.split(/ y | and /i).map(f => ({ item: f.trim(), quantity: '1' }));
  }

  try {
    // Prompt optimizado para extraer JSON-like format de alimentos y cantidades
    const prompt = `Task: Extract food items and their exact quantities from this Spanish text. 
    Format: Item|Quantity
    Example: "dos hamburguesas y un litro de jugo" -> Hamburguesa|2 units; Jugo|1 liter
    Example: "una rebanada de pastel" -> Pastel|1 slice
    Input: "${query}"
    Output:`;

    const response = await axios.post(
      MODEL_URL,
      {
        inputs: prompt,
        parameters: { max_new_tokens: 100, temperature: 0.1 }
      },
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}` }
      }
    );

    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      const text = response.data[0].generated_text.replace(prompt, '').trim();
      const lines = text.split(';').map((l: string) => l.trim()).filter((l: string) => l.includes('|'));
      
      const extracted = lines.map((line: string) => {
        const [item, quantity] = line.split('|');
        return { item: item.trim(), quantity: quantity.trim() || '1' };
      });

      if (extracted.length > 0) return extracted;
    }

    // Fallback simple si el modelo no responde en el formato esperado
    return query.split(/ y | and | con /i).map(f => ({ item: f.trim(), quantity: '1' }));
  } catch (error) {
    console.error('Error in Hugging Face Service:', error);
    return query.split(/ y | and /i).map(f => ({ item: f.trim(), quantity: '1' }));
  }
};
