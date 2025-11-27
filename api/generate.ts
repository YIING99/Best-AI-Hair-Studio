import { GoogleGenAI } from "@google/genai";

// Default runtime is Node.js, which is recommended for the full SDK.
// Removed 'runtime: edge' to prevent compatibility issues.

// Helper to remove data:image prefix
const cleanBase64 = (str: string) => str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
const getMimeType = (str: string) => {
  const match = str.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
};

const mapRangeToDesc = (value: number, descriptors: string[]) => {
  const index = Math.min(Math.floor((value / 101) * descriptors.length), descriptors.length - 1);
  return descriptors[index];
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { image, style, config } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Server configuration error: API Key missing" }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Logic moved from client to server
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

    return new Response(JSON.stringify({ 
        image: `data:image/png;base64,${resultImage.data}` 
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Server Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}