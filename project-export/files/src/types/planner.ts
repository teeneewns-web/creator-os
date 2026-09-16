export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';
export type Goal = 'followers' | 'authority' | 'leads' | 'sales';

export interface PlannerFormData {
  goal: Goal;
  role: string;
  platform: Platform;
  niche: string;
  audience: string;
  offer?: string;
  tone: 'bold' | 'relatable' | 'authoritative';
  format: 'short_video' | 'carousel' | 'text_post';
}

export interface DayContent {
  dayNumber: number;
  theme: string;
  objective: string;
  formatSpecs: string;
  hook: string;
  scriptBody: string;
  visualDirection: string;
  caption: string;
  cta: string;
  isLocked: boolean;
}