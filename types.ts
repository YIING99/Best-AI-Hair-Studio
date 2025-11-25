
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNISEX = 'Unisex'
}

export interface HairStyle {
  id: string;
  name: string;
  nameZh?: string;
  description: string;
  descriptionZh?: string;
  gender: Gender;
  imageUrl: string;
  isCustom?: boolean;
}

export type PartingType = 'auto' | 'center' | 'left' | 'right' | 'none';
export type BangsType = 'auto' | 'none' | 'curtain' | 'blunt' | 'wispy' | 'side';

export interface GenerationConfig {
  hairColor: string;
  length: number; // 0 to 100 (Short to Long)
  curl: number;   // 0 to 100 (Straight to Coily)
  volume: number; // 0 to 100 (Flat to Voluminous)
  parting: PartingType;
  bangs: BangsType;
  age: number;    // 0 to 100 (Young to Old)
  beard: boolean; // Facial hair toggle
}

export interface SavedConfig {
  id: string;
  name: string;
  config: GenerationConfig;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  styleName: string;
  timestamp: number;
  config: GenerationConfig;
}

export interface AnalysisResult {
  faceShape: string;
  faceShapeZh: string;
  recommendedStyleIds: string[];
  reasoning: string;
}

export type ProcessingState = 'idle' | 'uploading' | 'analyzing' | 'generating' | 'success' | 'error';

export type Language = 'en' | 'zh';
