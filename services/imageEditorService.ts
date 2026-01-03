
import { GoogleGenAI } from "@google/genai";

/**
 * Uses Gemini 2.5 Flash Image to edit an image based on a text prompt.
 * @param base64Image The source image in base64 format (with or without data prefix).
 * @param prompt The editing instruction (e.g., "Add a retro filter").
 * @returns The edited image as a base64 data URL.
 */
export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract clean base64 data if it contains the data:image/... prefix
  const cleanBase64 = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
  const mimeType = base64Image.includes('image/png') ? 'image/png' : 'image/jpeg';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // The output response may contain both image and text parts; iterate through all parts.
    let editedImageBase64 = '';
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          editedImageBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!editedImageBase64) {
      throw new Error("No image data returned from Gemini.");
    }

    return editedImageBase64;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};
