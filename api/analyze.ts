import { GoogleGenAI, Type } from "@google/genai";

// Default runtime is Node.js, which is recommended for the full SDK.
// Removed 'runtime: edge' to prevent compatibility issues.

const cleanBase64 = (str: string) => str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
const getMimeType = (str: string) => {
    const match = str.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
    return match ? `image/${match[1]}` : 'image/jpeg';
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { image, availableStyles } = await request.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const stylesJson = JSON.stringify(availableStyles);
    const prompt = `Analyze face shape. Select top 3 fitting style IDs from: ${stylesJson}.
    Return JSON: { "faceShape": "string", "faceShapeZh": "string", "recommendedStyleIds": ["id"], "reasoning": "string" }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            { inlineData: { mimeType: getMimeType(image), data: cleanBase64(image) } },
            { text: prompt }
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceShape: { type: Type.STRING },
            faceShapeZh: { type: Type.STRING },
            recommendedStyleIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    return new Response(response.text, { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}