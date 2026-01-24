import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAppInsight(appName: string, language: string) {
  try {
    // Definindo o prompt como uma string (template literal) para evitar erro de sintaxe
    const promptText = `For an app called "${appName}", give a very short "AI Insight" (max 20 words) on why it's a must-have and suggest one crazy experimental mod feature. 
      CRITICAL: You MUST answer in the ${language} language. 
      Return as JSON: { "insight": "...", "experimentalMod": "..." }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptText,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    const fallbacks: Record<string, any> = {
      pt: { insight: "Este app é essencial para quem busca performance e exclusividade.", experimentalMod: "Modo de processamento quântico ativado." },
      en: { insight: "This app is essential for those seeking performance and exclusivity.", experimentalMod: "Quantum processing mode activated." },
      es: { insight: "Esta aplicación es esencial para quienes buscan rendimiento y exclusividad.", experimentalMod: "Modo de procesamiento quântico activado." }
    };
    return fallbacks[language] || fallbacks['en'];
  }
}

export async function generateAudioInsight(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Diga de forma elegante e tecnológica: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}