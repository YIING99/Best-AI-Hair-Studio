
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, HairStyle, AnalysisResult } from "../types";

// Helper to remove data:image/...;base64, prefix
const cleanBase64 = (base64Str: string) => {
  return base64Str.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (base64Str: string) => {
  const match = base64Str.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
};

// Helper to map slider values to descriptive adjectives
const mapRangeToDesc = (value: number, descriptors: string[]) => {
  const index = Math.min(Math.floor((value / 101) * descriptors.length), descriptors.length - 1);
  return descriptors[index];
};

export const generateHairstyle = async (
  originalImageBase64: string,
  styleDescription: string,
  config: GenerationConfig
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Parameter mappings
    const lengthDesc = mapRangeToDesc(config.length, ['very short', 'short', 'medium length', 'long', 'very long']);
    const curlDesc = mapRangeToDesc(config.curl, ['bone straight', 'straight', 'wavy', 'curly', 'very curly/coily']);
    const volumeDesc = mapRangeToDesc(config.volume, ['sleek and flat', 'natural volume', 'voluminous', 'high volume']);
    
    // Detailed Age mapping for smoother gradient
    let ageInstruction = "";
    if (config.age !== undefined) {
        if (config.age < 20) {
            ageInstruction = "Make the person appear like a teenager (approx 18-20 years old).";
        } else if (config.age < 40) {
            ageInstruction = "Make the person appear as a young adult (20s to early 30s).";
        } else if (config.age < 60) {
            ageInstruction = "Make the person appear middle-aged (40s to 50s).";
        } else if (config.age < 80) {
            ageInstruction = "Make the person appear mature/senior (60s).";
        } else {
            ageInstruction = "Make the person appear elderly (70+ years old).";
        }
    }

    // Construct a detailed prompt
    let prompt = `Edit this image to change the person's hairstyle.
    
    Base Style Goal: ${styleDescription}.
    
    Specific Details to Apply:
    - Hair Length: ${lengthDesc}
    - Texture: ${curlDesc}
    - Volume: ${volumeDesc}
    `;

    if (config.hairColor) {
      prompt += `- Hair Color: ${config.hairColor} (apply this color naturally to the hair).\n`;
    }

    if (config.parting !== 'auto') {
        prompt += `- Parting: ${config.parting} part.\n`;
    }

    if (config.bangs !== 'auto') {
        prompt += `- Bangs/Fringe: ${config.bangs === 'none' ? 'no bangs, forehead visible' : config.bangs + ' style bangs'}.\n`;
    }

    if (config.beard) {
        prompt += `- Facial Hair: Add a well-groomed beard/facial hair suitable for the face.\n`;
    }
    
    if (ageInstruction) {
        prompt += `- Age Adjustment: ${ageInstruction}. Ensure the facial features (skin texture, wrinkles) reflect this age naturally.\n`;
    }
    
    prompt += `
    CRITICAL INSTRUCTIONS:
    1. Keep the person's pose, clothing, and background EXACTLY the same.
    2. Only change the hair on the head (and facial hair/skin age details if requested).
    3. Ensure the hair blends naturally with the scalp and forehead.
    4. The result must be photorealistic.
    `;

    const mimeType = getMimeType(originalImageBase64);
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64(originalImageBase64),
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const extractHairstyleDescription = async (imageBase64: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const mimeType = getMimeType(imageBase64);
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64(imageBase64),
      },
    };

    const prompt = "Describe the hairstyle in this image in detail (cut, length, texture, style) in one concise sentence so it can be replicated on another person. Do not describe the face or color.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
    });

    return response.text || "A stylish haircut";
  } catch (error) {
    console.error("Extraction Error:", error);
    return "A modern hairstyle";
  }
};

export const analyzeFaceAndSuggestStyles = async (
  imageBase64: string, 
  availableStyles: HairStyle[]
): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const mimeType = getMimeType(imageBase64);
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64(imageBase64),
      },
    };

    // Prepare style list for context
    const stylesContext = availableStyles.map(s => ({ id: s.id, name: s.name, gender: s.gender }));
    const stylesJson = JSON.stringify(stylesContext);

    const prompt = `Analyze the face shape of the person in the image. 
    Then, select up to 3 most suitable hairstyle IDs from the provided list that would compliment this face shape.
    
    Available Styles: ${stylesJson}

    Return JSON format:
    {
      "faceShape": "String (e.g., Oval, Round, Square, Heart) in English",
      "faceShapeZh": "String (e.g., 鹅蛋脸, 圆脸, 方脸, 心形脸) in Chinese",
      "recommendedStyleIds": ["id1", "id2"],
      "reasoning": "Short explanation of why these styles fit."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceShape: { type: Type.STRING },
            faceShapeZh: { type: Type.STRING },
            recommendedStyleIds: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      faceShape: "Unknown",
      faceShapeZh: "未知",
      recommendedStyleIds: [],
      reasoning: "Could not analyze face."
    };
  }
};
