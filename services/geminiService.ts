
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the Modegah AI Assistant, an expert in construction materials for Modegah Block Factory in Ghana. 

Our standard block sizing uses a 400mm x 200mm face.
Product Range:
- 4" Block (400x100x200mm): Partition walls, non-load bearing.
- 5" Block (400x125x200mm): Standard residential external walls.
- 6" Block (400x150x200mm): Most common load-bearing structural block.
- 8" Block (400x200x200mm): Heavy structural loads, multi-story buildings.
- Paving Stones (200x100x60mm): Driveways and walkways.

IMPORTANT: Delivery is ONLY available within the Greater Accra Region. Outside this region, customers must arrange pickup from Afienyah/Shai Hills.

Provide professional advice on quantities and material selection. Use GH₵ as the primary currency.`;

export const getGeminiResponse = async (history: ChatMessage[]) => {
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Must use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // The text property (not a method) directly returns the string output.
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI consultant is currently unavailable. Please try again later.";
  }
};
