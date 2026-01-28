
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Translates app details into target language using Gemini with a structured JSON schema.
 */
export async function translateAppDetails(name: string, description: string, features: string[], targetLang: string) {
  try {
    const promptText = `Translate the following app details for "${name}" into ${targetLang}. 
    Maintain the technical tone of a Modder/Reverse Engineer.
    
    Description: "${description}"
    Features: ${JSON.stringify(features)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["description", "features"]
        }
      }
    });
    
    // Correctly accessing the text property instead of calling it as a method
    const result = response.text ? JSON.parse(response.text) : { description, features };
    return result;
  } catch (error) {
    console.error("Translation Error:", error);
    return { description, features };
  }
}

/**
 * Generates an AI insight for an app with structured JSON output.
 */
export async function getAppInsight(appName: string, language: string) {
  try {
    const promptText = `For an app called "${appName}", give a very short "AI Insight" (max 20 words) on why it's a must-have. 
      Answer in ${language}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: { type: Type.STRING }
          },
          required: ["insight"]
        }
      }
    });
    
    // Correctly accessing the text property
    const result = response.text ? JSON.parse(response.text) : { insight: "Performance e exclusividade." };
    return result;
  } catch (error) {
    console.error("Insight Error:", error);
    return { insight: "Performance e exclusividade." };
  }
}
