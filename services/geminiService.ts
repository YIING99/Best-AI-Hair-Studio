import { GenerationConfig, HairStyle, AnalysisResult } from "../types";

// Client-side service that acts as a bridge to our Vercel Backend

export const generateHairstyle = async (
  originalImageBase64: string,
  styleDescription: string,
  config: GenerationConfig
): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: originalImageBase64,
        style: styleDescription,
        config: config
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Generation failed");
    }

    const data = await response.json();
    return data.image; // Expecting base64 string
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const extractHairstyleDescription = async (imageBase64: string): Promise<string> => {
  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 })
    });

    if (!response.ok) throw new Error("Extraction failed");
    
    const data = await response.json();
    return data.description;
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
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: imageBase64,
        availableStyles: availableStyles.map(s => ({ id: s.id, name: s.name, gender: s.gender })) 
      })
    });

    if (!response.ok) throw new Error("Analysis failed");

    const data = await response.json();
    return data as AnalysisResult;

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