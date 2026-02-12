
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { InventoryItem } from "../types";

// Always use the recommended initialization with named parameter and direct process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInventoryInsights = async (items: InventoryItem[]) => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Analyze this inventory data and provide 3 actionable insights. 
    Look for items that are low in stock relative to their thresholds, items that might be overstocked, or suggestions for reorganization.
    Data: ${JSON.stringify(items)}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ['title', 'description', 'type']
          }
        }
      }
    });

    // Access the text property directly and trim as per guidelines
    const jsonStr = response.text?.trim() || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error fetching insights:", error);
    return [];
  }
};

export const identifyItemFromImage = async (base64Image: string) => {
  const model = 'gemini-3-flash-preview';
  const prompt = "Identify this product from the image. Provide its likely category, a brief description, and a suggested name.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ['name', 'category', 'description']
        }
      }
    });

    // Access the text property directly and trim as per guidelines
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error identifying item:", error);
    return null;
  }
};

export const createInventoryChat = (items: InventoryItem[]): Chat => {
  const systemInstruction = `
    You are InvenTrack AI, an expert inventory management assistant. 
    You have access to the current inventory data: ${JSON.stringify(items)}.
    Answer user questions about stock levels, recommendations, price trends, or general inventory management advice.
    Be professional, concise, and helpful. 
    If asked about items not in the list, mention that you don't see them in the current catalog.
  `;

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    },
  });
};
