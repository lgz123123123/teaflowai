export type Language = 'en' | 'jp' | 'cn';

export enum TeaType {
  SENCHA = 'Sencha',
  GYOKURO = 'Gyokuro',
  AI_MASTER = 'AI_Master' // New type for AI
}

export enum Grade {
  STANDARD = 'Standard',
  HIGH = 'High',
  IMPERIAL = 'Imperial',
  AI_CUSTOM = 'AI_Custom' // New grade for AI results
}

export interface Steep {
  duration: number; // in seconds
  temperature: number; // Celsius (New field for Master brewing)
  note: Record<Language, string> | string; // Relaxed type to allow simple string from AI
  flavor?: Record<Language, string> | string;
}

export interface TeaParameters {
  waterTemperature: number; // Initial/Base Celsius
  leafAmount: number; // Grams
  waterAmount: number; // Milliliters
}

export interface TeaGradeProfile {
  grade: Grade;
  description: Record<Language, string> | string; // Relaxed for AI
  parameters: TeaParameters;
  steeps: Steep[];
}

export interface TeaDefinition {
  id: string;
  name: Record<Language, string>;
  tagline: Record<Language, string>;
  profiles: {
    [key in Grade]?: TeaGradeProfile;
  };
}

// Specific Interface for AI Response to match JSON Schema
export interface AIBrewingPlan {
  tea_type: string;
  grade: string;
  description: string;
  parameters: {
    water_temperature: number;
    leaf_amount: number;
    water_amount: number;
  };
  steeps: {
    duration: number;
    note: string;
  }[];
}