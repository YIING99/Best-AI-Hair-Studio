import { GoogleGenAI } from "@google/genai";

export const config = { runtime: 'edge' };

const cleanBase64 = (str: string) => str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
const getMimeType = (str: string) => {
    const match = str.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
    return match ? `image/${match[1]}` : 'image/jpeg';
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { image } = await request.json();
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

    return new Response(JSON.stringify({ description: response.text }), { 
        headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}