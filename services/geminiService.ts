
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function translateAppDetails(name: string, description: string, features: string[], targetLang: string) {
  try {
    const promptText = `Translate the following app details for "${name}" into ${targetLang}. 
    Maintain the technical tone of a Modder/Reverse Engineer.
    
    Description to translate: "${description}"
    Features list to translate: ${JSON.stringify(features)}
    
    Return ONLY a JSON object with this structure: 
    { "description": "translated text", "features": ["feat1", "feat2", ...] }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Translation Error:", error);
    return { description, features };
  }
}

export async function getAppInsight(appName: string, language: string) {
  try {
    const promptText = `For an app called "${appName}", give a very short "AI Insight" (max 20 words) on why it's a must-have. 
      Answer in ${language}. Return as JSON: { "insight": "..." }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { insight: "Performance e exclusividade." };
  }
}
