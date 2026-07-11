import type { PremiumHook } from "../../../types/premium";

import beautyData from "./beauty.json";
import educationData from "./education.json";
import financeData from "./finance.json";
import foodData from "./food.json";
import healthData from "./health.json";
import realEstateData from "./real-estate.json";
import shoppingData from "./shopping.json";
import technologyData from "./technology.json";
import tiktokData from "./tiktok.json";
import youtubeData from "./youtube.json";

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

function isPremiumHook(value: unknown): value is PremiumHook {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<PremiumHook>;

  const hasValidAbTest =
    typeof item.abTest === "object" &&
    item.abTest !== null &&
    typeof item.abTest.a === "string" &&
    typeof item.abTest.b === "string";

  const hasValidDifficulty =
    item.difficulty === "easy" ||
    item.difficulty === "medium" ||
    item.difficulty === "advanced";

  const hasValidStatus =
    item.status === "draft" ||
    item.status === "reviewed" ||
    item.status === "published";

  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.hook === "string" &&
    typeof item.category === "string" &&
    typeof item.industry === "string" &&
    item.tier === "premium" &&
    typeof item.score === "number" &&
    isStringArray(item.platform) &&
    typeof item.goal === "string" &&
    typeof item.emotion === "string" &&
    hasValidDifficulty &&
    typeof item.why === "string" &&
    typeof item.script === "string" &&
    typeof item.cta === "string" &&
    isStringArray(item.keywords) &&
    hasValidAbTest &&
    hasValidStatus &&
    typeof item.version === "string"
  );
}

function readPremiumHooks(data: unknown): PremiumHook[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter(isPremiumHook);
}

export const premiumHooks: PremiumHook[] = [
  ...readPremiumHooks(beautyData),
  ...readPremiumHooks(educationData),
  ...readPremiumHooks(financeData),
  ...readPremiumHooks(foodData),
  ...readPremiumHooks(healthData),
  ...readPremiumHooks(realEstateData),
  ...readPremiumHooks(shoppingData),
  ...readPremiumHooks(technologyData),
  ...readPremiumHooks(tiktokData),
  ...readPremiumHooks(youtubeData),
];