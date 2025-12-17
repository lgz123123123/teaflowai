export type Language = 'en' | 'jp' | 'cn';

export enum TeaType {
  SENCHA = 'Sencha',
  GYOKURO = 'Gyokuro'
}

export enum Grade {
  STANDARD = 'Standard',
  HIGH = 'High',
  IMPERIAL = 'Imperial'
}

export interface Steep {
  duration: number; // in seconds
  temperature: number; // Celsius
  note: Record<Language, string>;
  flavor?: Record<Language, string>;
}

export interface TeaParameters {
  waterTemperature: number; // Initial/Base Celsius
  leafAmount: number; // Grams
  waterAmount: number; // Milliliters
}

export interface TeaGradeProfile {
  grade: Grade;
  description: Record<Language, string>;
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

export interface AIBrewingSteep {
  duration: number;
  note: string;
}

export interface AIBrewingParameters {
  water_temperature: number;
  leaf_amount: number;
  water_amount: number;
}

export interface AIBrewingPlan {
  tea_type: string;
  grade: string;
  description: string;
  parameters: AIBrewingParameters;
  steeps: AIBrewingSteep[];
}
