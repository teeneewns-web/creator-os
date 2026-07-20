import beautyIdeas from "./beauty.json";
import type { PremiumIdea } from "../../../types/premium-idea";

export const premiumIdeas: PremiumIdea[] = [
  ...(beautyIdeas as PremiumIdea[]),
];