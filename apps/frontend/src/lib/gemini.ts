import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-2.5-pro',
];

export async function generateContentWithFallback(params: {
  contents: any;
  config?: any;
  models?: string[];
}) {
  const ai = getGeminiClient();
  const models = params.models && params.models.length > 0 ? params.models : GEMINI_FALLBACK_MODELS;
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      // If 503 or transient failure, try the next model candidate
      console.warn(`[Gemini Fallback] Model ${model} encountered error (${err?.message || err}). Trying next fallback...`);
    }
  }

  throw lastError || new Error('All Gemini model candidates exhausted.');
}
