export type PremiumScriptDifficulty =
  | "easy"
  | "medium"
  | "advanced";

export type PremiumScriptTier = "premium";

export type PremiumScriptStatus =
  | "draft"
  | "reviewed"
  | "published";

export type PremiumScriptFormat =
  | "short-form"
  | "long-form"
  | "carousel"
  | "live";

export type PremiumScriptSection = {
  label: string;
  text: string;
  visual?: string;
};

export type PremiumScriptABTest = {
  a: string;
  b: string;
};

export interface PremiumScript {
  id: string;
  title: string;
  category: string;
  industry: string;
  tier: PremiumScriptTier;
  score: number;
  platform: string[];
  goal: string;
  audience: string;
  tone: string;
  format: PremiumScriptFormat;
  duration: string;
  difficulty: PremiumScriptDifficulty;
  hook: string;
  sections: PremiumScriptSection[];
  cta: string;
  notes: string[];
  keywords: string[];
  abTest: PremiumScriptABTest;
  status: PremiumScriptStatus;
  version: string;
}