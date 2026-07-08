export type PremiumDifficulty = "easy" | "medium" | "advanced";
export type PremiumTier = "premium";
export type PremiumStatus = "draft" | "reviewed" | "published";

export interface PremiumHook {
  id: string;
  title: string;
  hook: string;

  category: string;
  industry: string;
  tier: PremiumTier;

  score: number;
  platform: string[];
  goal: string;
  emotion: string;
  difficulty: PremiumDifficulty;

  why: string;
  script: string;
  cta: string;

  keywords: string[];

  abTest: {
    a: string;
    b: string;
  };

  status: PremiumStatus;
  version: string;
}