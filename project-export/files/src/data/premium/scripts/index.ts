import beautyScripts from "./beauty.json";
import educationScripts from "./education.json";
import financeScripts from "./finance.json";
import foodScripts from "./food.json";
import healthScripts from "./health.json";
import realEstateScripts from "./real-estate.json";
import shoppingScripts from "./shopping.json";
import technologyScripts from "./technology.json";
import tiktokScripts from "./tiktok.json";
import youtubeScripts from "./youtube.json";

import type {
  PremiumScript,
  PremiumScriptDifficulty,
  PremiumScriptFormat,
  PremiumScriptSection,
  PremiumScriptStatus,
} from "../../../types/premium-script";

const validDifficulties: PremiumScriptDifficulty[] = [
  "easy",
  "medium",
  "advanced",
];

const validFormats: PremiumScriptFormat[] = [
  "short-form",
  "long-form",
  "carousel",
  "live",
];

const validStatuses: PremiumScriptStatus[] = [
  "draft",
  "reviewed",
  "published",
];

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

function isScriptSection(
  value: unknown
): value is PremiumScriptSection {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const section = value as Record<string, unknown>;

  const validVisual =
    section.visual === undefined ||
    typeof section.visual === "string";

  return (
    typeof section.label === "string" &&
    section.label.trim().length > 0 &&
    typeof section.text === "string" &&
    section.text.trim().length > 0 &&
    validVisual
  );
}

function isPremiumScript(
  value: unknown
): value is PremiumScript {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  const abTest =
    typeof item.abTest === "object" &&
    item.abTest !== null
      ? (item.abTest as Record<string, unknown>)
      : null;

  return (
    typeof item.id === "string" &&
    item.id.trim().length > 0 &&
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    typeof item.category === "string" &&
    item.category.trim().length > 0 &&
    typeof item.industry === "string" &&
    item.industry.trim().length > 0 &&
    item.tier === "premium" &&
    typeof item.score === "number" &&
    Number.isFinite(item.score) &&
    item.score >= 0 &&
    item.score <= 100 &&
    isStringArray(item.platform) &&
    typeof item.goal === "string" &&
    item.goal.trim().length > 0 &&
    typeof item.audience === "string" &&
    item.audience.trim().length > 0 &&
    typeof item.tone === "string" &&
    item.tone.trim().length > 0 &&
    typeof item.format === "string" &&
    validFormats.includes(
      item.format as PremiumScriptFormat
    ) &&
    typeof item.duration === "string" &&
    item.duration.trim().length > 0 &&
    typeof item.difficulty === "string" &&
    validDifficulties.includes(
      item.difficulty as PremiumScriptDifficulty
    ) &&
    typeof item.hook === "string" &&
    item.hook.trim().length > 0 &&
    Array.isArray(item.sections) &&
    item.sections.length > 0 &&
    item.sections.every(isScriptSection) &&
    typeof item.cta === "string" &&
    item.cta.trim().length > 0 &&
    isStringArray(item.notes) &&
    isStringArray(item.keywords) &&
    abTest !== null &&
    typeof abTest.a === "string" &&
    abTest.a.trim().length > 0 &&
    typeof abTest.b === "string" &&
    abTest.b.trim().length > 0 &&
    typeof item.status === "string" &&
    validStatuses.includes(
      item.status as PremiumScriptStatus
    ) &&
    typeof item.version === "string" &&
    item.version.trim().length > 0
  );
}

const rawPremiumScripts: unknown[] = [
  ...beautyScripts,
  ...educationScripts,
  ...financeScripts,
  ...foodScripts,
  ...healthScripts,
  ...realEstateScripts,
  ...shoppingScripts,
  ...technologyScripts,
  ...tiktokScripts,
  ...youtubeScripts,
];

export const premiumScripts: PremiumScript[] =
  rawPremiumScripts.filter(isPremiumScript);

export function readPremiumScripts(): PremiumScript[] {
  return premiumScripts;
}

export function getPremiumScriptsByIndustry(
  industry: string
): PremiumScript[] {
  const normalizedIndustry = industry
    .trim()
    .toLocaleLowerCase("en-US");

  return premiumScripts.filter(
    (script) =>
      script.industry
        .trim()
        .toLocaleLowerCase("en-US") ===
      normalizedIndustry
  );
}