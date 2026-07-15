import type { PremiumCta } from "../../../types/premium-cta";

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

const allowedPurposes = new Set([
  "engagement",
  "education",
  "sales",
  "lead-generation",
  "traffic",
  "community",
]);

const allowedPlacements = new Set([
  "caption-end",
  "video-end",
  "mid-content",
  "pinned-comment",
  "bio",
]);

const allowedDifficulties = new Set([
  "easy",
  "medium",
  "advanced",
]);

const premiumCtaGroups: PremiumCta[][] = [
  beautyData as PremiumCta[],
  educationData as PremiumCta[],
  financeData as PremiumCta[],
  foodData as PremiumCta[],
  healthData as PremiumCta[],
  realEstateData as PremiumCta[],
  shoppingData as PremiumCta[],
  technologyData as PremiumCta[],
  tiktokData as PremiumCta[],
  youtubeData as PremiumCta[],
];

function validatePremiumCta(item: PremiumCta): void {
  if (!item.id || !item.title || !item.cta) {
    throw new Error(
      "Premium CTA is missing required text fields: " +
        JSON.stringify(item)
    );
  }

  if (item.tier !== "premium") {
    throw new Error(
      "Invalid Premium CTA tier: " + item.id
    );
  }

  if (!allowedPurposes.has(item.purpose)) {
    throw new Error(
      "Invalid Premium CTA purpose: " +
        item.id +
        " / " +
        item.purpose
    );
  }

  if (!allowedPlacements.has(item.placement)) {
    throw new Error(
      "Invalid Premium CTA placement: " +
        item.id +
        " / " +
        item.placement
    );
  }

  if (!allowedDifficulties.has(item.difficulty)) {
    throw new Error(
      "Invalid Premium CTA difficulty: " +
        item.id +
        " / " +
        item.difficulty
    );
  }

  if (
    !Number.isFinite(item.score) ||
    item.score < 0 ||
    item.score > 100
  ) {
    throw new Error(
      "Invalid Premium CTA score: " + item.id
    );
  }

  if (
    !Array.isArray(item.platform) ||
    item.platform.length === 0
  ) {
    throw new Error(
      "Premium CTA platform is empty: " + item.id
    );
  }

  if (
    !Array.isArray(item.notes) ||
    item.notes.length === 0
  ) {
    throw new Error(
      "Premium CTA notes are empty: " + item.id
    );
  }

  if (
    !Array.isArray(item.keywords) ||
    item.keywords.length === 0
  ) {
    throw new Error(
      "Premium CTA keywords are empty: " + item.id
    );
  }

  if (!item.abTest?.a || !item.abTest?.b) {
    throw new Error(
      "Premium CTA A/B test is incomplete: " + item.id
    );
  }

  if (item.status !== "reviewed") {
    throw new Error(
      "Premium CTA status must be reviewed: " + item.id
    );
  }
}

export const premiumCtas: PremiumCta[] =
  premiumCtaGroups.flat();

const premiumCtaIds = new Set<string>();

for (const item of premiumCtas) {
  validatePremiumCta(item);

  if (premiumCtaIds.has(item.id)) {
    throw new Error(
      "Duplicate Premium CTA id: " + item.id
    );
  }

  premiumCtaIds.add(item.id);
}

export function readPremiumCtas(): PremiumCta[] {
  return premiumCtas;
}

export function getPremiumCtasByIndustry(
  industry: string
): PremiumCta[] {
  return premiumCtas.filter(
    (item) => item.industry === industry
  );
}