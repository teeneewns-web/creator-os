export type PremiumCaptionDifficulty =
  | "easy"
  | "medium"
  | "advanced";

export type PremiumCaptionTier = "premium";

export type PremiumCaptionStatus =
  | "draft"
  | "reviewed"
  | "published";

export type PremiumCaptionLength =
  | "short"
  | "medium"
  | "long";

export type PremiumCaptionPurpose =
  | "engagement"
  | "education"
  | "sales"
  | "storytelling"
  | "community";

export type PremiumCaptionABTest = {
  a: string;
  b: string;
};

export interface PremiumCaption {
  id: string;
  title: string;

  category: string;
  industry: string;

  tier: PremiumCaptionTier;
  score: number;

  platform: string[];

  goal: string;
  audience: string;
  tone: string;

  purpose: PremiumCaptionPurpose;
  length: PremiumCaptionLength;
  difficulty: PremiumCaptionDifficulty;

  opening: string;
  caption: string;
  cta: string;

  hashtags: string[];
  keywords: string[];

  notes: string[];

  abTest: PremiumCaptionABTest;

  status: PremiumCaptionStatus;
  version: string;
}