import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `You are the Modegah AI Assistant, an expert in construction materials for Modegah Block Factory in Ghana. 

Our standard block sizing uses a 400mm x 200mm face.
Product Range:
- 5" Block (400x125x200mm): Standard residential external walls.
- 6" Block (400x150x200mm): Most common load-bearing structural block.
- 8" Block (400x200x200mm): Heavy structural loads, multi-story buildings.
- Paving Stones (200x100x60mm): Driveways and walkways.

IMPORTANT: Delivery is ONLY available within the Greater Accra Region. Outside this region, customers must arrange pickup from Afienyah/Shai Hills.

Provide professional advice on quantities and material selection. Use GH₵ as the primary currency.
Use the googleSearch tool to provide up-to-date information on cement prices (GHACEM, Dangote) and construction trends in Ghana if the user asks.`;

// Using a world-class senior frontend engineer approach to interact with Gemini API
export const getGeminiResponse = async (history: ChatMessage[]) => {
  // Initialize AI client inside the function to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }]
      },
    });

    // Access the text property directly as per modern GenAI SDK guidelines
    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // If search was used, extract URLs from groundingChunks and append as sources for compliance
    let sources = "";
    if (groundingChunks && groundingChunks.length > 0) {
      sources = "\n\n**Sources:**\n" + groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => `- [${chunk.web?.title}](${chunk.web?.uri})`)
        .join("\n");
    }

    return (text + sources) || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI consultant is currently unavailable. Please try again later.";
  }
};