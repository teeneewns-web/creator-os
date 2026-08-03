import "server-only";

import { createHash } from "node:crypto";

import { generateWeeklyContentPlan } from "./generate-weekly-content-plan";
import type { PlanRequest } from "../types/plan-request";
import type {
  CreatorPlanSnapshot,
} from "../types/creator-order";
import type {
  WeeklyContentDay,
  WeeklyContentPlan,
} from "../types/weekly-content-plan";

export const CURRENT_PLAN_VERSION = 1;
export const CURRENT_PRODUCT_STANDARD =
  "ready-to-execute-v1" as const;

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("th-TH")
    .replace(/\s+/g, " ");
}

function hashValue(value: string) {
  return createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

function stableRequestPayload(request: PlanRequest) {
  return JSON.stringify({
    planType: request.planType,
    productOrService: normalizeText(
      request.productOrService
    ),
    productHighlights: normalizeText(
      request.productHighlights
    ),
    audience: normalizeText(request.audience),
    customerConcerns: normalizeText(
      request.customerConcerns
    ),
    promotionDetails: normalizeText(
      request.promotionDetails
    ),
    prohibitedClaims: normalizeText(
      request.prohibitedClaims
    ),
    goal: request.goal,
    platform: request.platform,
    dailyTime: request.dailyTime,
    capabilities: [...request.capabilities].sort(),
  });
}

export function createCustomerProfileKey(
  request: PlanRequest
) {
  return hashValue(stableRequestPayload(request));
}

export function createPlanVariationKey(
  orderId: string,
  round: number,
  customerProfileKey: string
) {
  return hashValue(
    `${orderId.trim().toUpperCase()}|${round}|${customerProfileKey}`
  );
}

function getDayFingerprintPayload(
  day: WeeklyContentDay
) {
  return JSON.stringify({
    stage: normalizeText(day.stage),
    format: day.format,
    topic: normalizeText(day.topic),
    hook: normalizeText(day.hook),
    script: normalizeText(day.script),
    caption: normalizeText(day.caption),
    cta: normalizeText(day.cta),
    shotList: day.shotList.map(normalizeText),
    onScreenTexts: day.onScreenTexts.map(normalizeText),
  });
}

export function createContentFingerprints(
  plan: WeeklyContentPlan
) {
  return plan.days.map((day) =>
    hashValue(getDayFingerprintPayload(day))
  );
}

function createStoredPlan(
  orderId: string,
  request: PlanRequest,
  round: number,
  createdAt: string
) {
  const generated = generateWeeklyContentPlan(request);

  return {
    ...generated,
    id: `weekly-plan-${orderId.toLowerCase()}-r${round}`,
    createdAt,
  };
}

export function createPlanSnapshot(
  orderId: string,
  request: PlanRequest,
  round = 1
): CreatorPlanSnapshot {
  const safeRound = Math.max(1, Math.floor(round));
  const createdAt = new Date().toISOString();
  const customerProfileKey =
    createCustomerProfileKey(request);
  const variationKey = createPlanVariationKey(
    orderId,
    safeRound,
    customerProfileKey
  );
  const plan = createStoredPlan(
    orderId,
    request,
    safeRound,
    createdAt
  );

  return {
    plan,
    round: safeRound,
    version: CURRENT_PLAN_VERSION,
    productStandard: CURRENT_PRODUCT_STANDARD,
    customerProfileKey,
    variationKey,
    contentFingerprints:
      createContentFingerprints(plan),
    createdAt,
  };
}
