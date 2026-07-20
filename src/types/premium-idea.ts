export type PremiumIdeaDifficulty =
  | "easy"
  | "medium"
  | "advanced";

export type PremiumIdeaTier = "premium";

export type PremiumIdeaStatus =
  | "draft"
  | "reviewed"
  | "published";

export type PremiumIdeaFormat =
  | "short-video"
  | "long-video"
  | "carousel"
  | "live"
  | "post";

export type PremiumIdeaPurpose =
  | "awareness"
  | "education"
  | "engagement"
  | "sales"
  | "community"
  | "authority";

export type PremiumIdeaABTest = {
  a: string;
  b: string;
};

export interface PremiumIdea {
  id: string;
  title: string;
  category: string;
  industry: string;
  tier: PremiumIdeaTier;
  score: number;
  platform: string[];
  goal: string;
  audience: string;
  tone: string;
  format: PremiumIdeaFormat;
  purpose: PremiumIdeaPurpose;
  difficulty: PremiumIdeaDifficulty;
  idea: string;
  angle: string;
  whyItWorks: string;
  executionSteps: string[];
  contentPrompt: string;
  notes: string[];
  keywords: string[];
  abTest: PremiumIdeaABTest;
  status: PremiumIdeaStatus;
  version: string;
}