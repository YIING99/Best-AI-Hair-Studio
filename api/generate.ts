import { GoogleGenAI } from "@google/genai";

// Standard Vercel Node.js Serverless Function Handler
// Refactored from Edge syntax (Request/Response) to Node syntax (req, res)

const cleanBase64 = (str: string) => str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
const getMimeType = (str: string) => {
  const match = str.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
};

const mapRangeToDesc = (value: number, descriptors: string[]) => {
  const index = Math.min(Math.floor((value / 101) * descriptors.length), descriptors.length - 1);
  return descriptors[index];
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // In Vercel Node.js runtime, req.body is automatically parsed if Content-Type is application/json
    const { image, style, config } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Server configuration error: API Key missing" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const lengthDesc = mapRangeToDesc(config.length, ['very short', 'short', 'medium length', 'long', 'very long']);
    const curlDesc = mapRangeToDesc(config.curl, ['bone straight', 'straight', 'wavy', 'curly', 'very curly/coily']);
    const volumeDesc = mapRangeToDesc(config.volume, ['sleek and flat', 'natural volume', 'voluminous', 'high volume']);
    
    let ageInstruction = "";
    if (config.age !== undefined) {
        if (config.age < 20) ageInstruction = "Make the person appear like a teenager (18-20).";
        else if (config.age < 40) ageInstruction = "Make the person appear as a young adult (20s-30s).";
        else if (config.age < 60) ageInstruction = "Make the person appear middle-aged (40s-50s).";
        else if (config.age < 80) ageInstruction = "Make the person appear mature/senior (60s).";
        else ageInstruction = "Make the person appear elderly (70+).";
    }

    let prompt = `Edit this image to change the person's hairstyle.
    Base Style: ${style}.
    Details: Length: ${lengthDesc}, Texture: ${curlDesc}, Volume: ${volumeDesc}.
    `;

    if (config.hairColor) prompt += `- Hair Color: ${config.hairColor} (natural blend).\n`;
    if (config.parting !== 'auto') prompt += `- Parting: ${config.parting}.\n`;
    if (config.bangs !== 'auto') prompt += `- Bangs: ${config.bangs === 'none' ? 'no bangs' : config.bangs}.\n`;
    if (config.beard) prompt += `- Add well-groomed beard.\n`;
    if (ageInstruction) prompt += `- ${ageInstruction} (adjust skin texture naturally).\n`;

    prompt += `
    CRITICAL: Keep pose, clothing, and background EXACTLY the same. 
    Only change hair. Photorealistic result.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
            { inlineData: { mimeType: getMimeType(image), data: cleanBase64(image) } },
            { text: prompt }
        ],
      },
    });

    const resultImage = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;

    if (!resultImage) throw new Error("Generation failed - No image returned");

    return res.status(200).json({ 
        image: `data:image/png;base64,${resultImage.data}` 
    });

  } catch (error: any) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}