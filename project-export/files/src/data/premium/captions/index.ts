import type { PremiumCaption } from "../../../types/premium-caption";

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

const VALID_DIFFICULTIES = [
  "easy",
  "medium",
  "advanced",
] as const;

const VALID_LENGTHS = [
  "short",
  "medium",
  "long",
] as const;

const VALID_PURPOSES = [
  "engagement",
  "education",
  "sales",
  "storytelling",
  "community",
] as const;

const VALID_STATUSES = [
  "draft",
  "reviewed",
  "published",
] as const;

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0
    )
  );
}

function isPremiumCaption(
  value: unknown
): value is PremiumCaption {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  if (
    typeof item.id !== "string" ||
    item.id.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.title !== "string" ||
    item.title.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.category !== "string" ||
    item.category.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.industry !== "string" ||
    item.industry.trim().length === 0
  ) {
    return false;
  }

  if (item.tier !== "premium") {
    return false;
  }

  if (
    typeof item.score !== "number" ||
    !Number.isFinite(item.score) ||
    item.score < 0 ||
    item.score > 100
  ) {
    return false;
  }

  if (!isStringArray(item.platform)) {
    return false;
  }

  if (
    typeof item.goal !== "string" ||
    item.goal.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.audience !== "string" ||
    item.audience.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.tone !== "string" ||
    item.tone.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.purpose !== "string" ||
    !VALID_PURPOSES.includes(
      item.purpose as (typeof VALID_PURPOSES)[number]
    )
  ) {
    return false;
  }

  if (
    typeof item.length !== "string" ||
    !VALID_LENGTHS.includes(
      item.length as (typeof VALID_LENGTHS)[number]
    )
  ) {
    return false;
  }

  if (
    typeof item.difficulty !== "string" ||
    !VALID_DIFFICULTIES.includes(
      item.difficulty as (typeof VALID_DIFFICULTIES)[number]
    )
  ) {
    return false;
  }

  if (
    typeof item.opening !== "string" ||
    item.opening.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.caption !== "string" ||
    item.caption.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.cta !== "string" ||
    item.cta.trim().length === 0
  ) {
    return false;
  }

  if (!isStringArray(item.hashtags)) {
    return false;
  }

  if (!isStringArray(item.keywords)) {
    return false;
  }

  if (!isStringArray(item.notes)) {
    return false;
  }

  if (
    typeof item.abTest !== "object" ||
    item.abTest === null ||
    Array.isArray(item.abTest)
  ) {
    return false;
  }

  const abTest = item.abTest as Record<string, unknown>;

  if (
    typeof abTest.a !== "string" ||
    abTest.a.trim().length === 0 ||
    typeof abTest.b !== "string" ||
    abTest.b.trim().length === 0
  ) {
    return false;
  }

  if (
    typeof item.status !== "string" ||
    !VALID_STATUSES.includes(
      item.status as (typeof VALID_STATUSES)[number]
    )
  ) {
    return false;
  }

  if (
    typeof item.version !== "string" ||
    item.version.trim().length === 0
  ) {
    return false;
  }

  return true;
}

function validateCaptionCollection(
  sourceName: string,
  sourceData: unknown
): PremiumCaption[] {
  if (!Array.isArray(sourceData)) {
    throw new Error(
      "Premium captions source must be an array: " +
        sourceName
    );
  }

  const invalidIndex = sourceData.findIndex(
    (item) => !isPremiumCaption(item)
  );

  if (invalidIndex !== -1) {
    throw new Error(
      "Invalid Premium Caption in " +
        sourceName +
        " at index " +
        String(invalidIndex)
    );
  }

  return sourceData as PremiumCaption[];
}

const beautyCaptions = validateCaptionCollection(
  "beauty.json",
  beautyData
);

const educationCaptions = validateCaptionCollection(
  "education.json",
  educationData
);

const financeCaptions = validateCaptionCollection(
  "finance.json",
  financeData
);

const foodCaptions = validateCaptionCollection(
  "food.json",
  foodData
);

const healthCaptions = validateCaptionCollection(
  "health.json",
  healthData
);

const realEstateCaptions = validateCaptionCollection(
  "real-estate.json",
  realEstateData
);

const shoppingCaptions = validateCaptionCollection(
  "shopping.json",
  shoppingData
);

const technologyCaptions = validateCaptionCollection(
  "technology.json",
  technologyData
);

const tiktokCaptions = validateCaptionCollection(
  "tiktok.json",
  tiktokData
);

const youtubeCaptions = validateCaptionCollection(
  "youtube.json",
  youtubeData
);

export const premiumCaptions: PremiumCaption[] = [
  ...beautyCaptions,
  ...educationCaptions,
  ...financeCaptions,
  ...foodCaptions,
  ...healthCaptions,
  ...realEstateCaptions,
  ...shoppingCaptions,
  ...technologyCaptions,
  ...tiktokCaptions,
  ...youtubeCaptions,
];

export function readPremiumCaptions(): PremiumCaption[] {
  return premiumCaptions;
}

export function getPremiumCaptionsByIndustry(
  industry: string
): PremiumCaption[] {
  return premiumCaptions.filter(
    (item) => item.industry === industry
  );
}