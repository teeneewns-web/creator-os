import beautyIdeas from "./beauty.json";
import educationIdeas from "./education.json";
import financeIdeas from "./finance.json";
import foodIdeas from "./food.json";
import healthIdeas from "./health.json";
import realEstateIdeas from "./real-estate.json";
import shoppingIdeas from "./shopping.json";
import technologyIdeas from "./technology.json";
import tiktokIdeas from "./tiktok.json";
import youtubeIdeas from "./youtube.json";

import type { PremiumIdea } from "../../../types/premium-idea";

export const premiumIdeas: PremiumIdea[] = [
  ...(beautyIdeas as PremiumIdea[]),
  ...(educationIdeas as PremiumIdea[]),
  ...(financeIdeas as PremiumIdea[]),
  ...(foodIdeas as PremiumIdea[]),
  ...(healthIdeas as PremiumIdea[]),
  ...(realEstateIdeas as PremiumIdea[]),
  ...(shoppingIdeas as PremiumIdea[]),
  ...(technologyIdeas as PremiumIdea[]),
  ...(tiktokIdeas as PremiumIdea[]),
  ...(youtubeIdeas as PremiumIdea[]),
];