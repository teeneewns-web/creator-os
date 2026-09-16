export type PremiumCtaDifficulty =
  | "easy"
  | "medium"
  | "advanced";

export type PremiumCtaTier = "premium";

export type PremiumCtaStatus =
  | "draft"
  | "reviewed"
  | "published";

export type PremiumCtaPurpose =
  | "engagement"
  | "sales"
  | "lead-generation"
  | "traffic"
  | "community";

export type PremiumCtaPlacement =
  | "caption-end"
  | "video-end"
  | "mid-content"
  | "pinned-comment"
  | "bio";

export type PremiumCtaABTest = {
  a: string;
  b: string;
};

export interface PremiumCta {
  id: string;
  title: string;
  category: string;
  industry: string;
  tier: PremiumCtaTier;
  score: number;
  platform: string[];
  goal: string;
  audience: string;
  tone: string;
  purpose: PremiumCtaPurpose;
  placement: PremiumCtaPlacement;
  difficulty: PremiumCtaDifficulty;
  cta: string;
  context: string;
  notes: string[];
  keywords: string[];
  abTest: PremiumCtaABTest;
  status: PremiumCtaStatus;
  version: string;
}