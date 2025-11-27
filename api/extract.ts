import { GoogleGenAI } from "@google/genai";

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
    const { image } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "API Key missing" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = "Describe the hairstyle in this image strictly (cut, length, texture) in one sentence for replication. Ignore face.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
            { inlineData: { mimeType: getMimeType(image), data: cleanBase64(image) } },
            { text: prompt }
        ],
      }
    });

    return res.status(200).json({ description: response.text });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}