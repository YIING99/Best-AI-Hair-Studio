import { GoogleGenAI, Type } from "@google/genai";

// Standard Vercel Node.js Serverless Function Handler

const cleanBase64 = (str: string) => str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
const getMimeType = (str: string) => {
    const match = str.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
    return match ? `image/${match[1]}` : 'image/jpeg';
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image, availableStyles } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "API Key missing" });
    }

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

    return res.status(200).send(response.text);

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}