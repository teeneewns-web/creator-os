import "server-only";

import { createHash } from "node:crypto";

import { generateWeeklyContentPlan } from "./generate-weekly-content-plan";
import { auditPlanQuality } from "./plan-quality";
import type { PlanRequest } from "../types/plan-request";
import type {
  CreatorPlanSnapshot,
} from "../types/creator-order";
import type {
  WeeklyContentDay,
  WeeklyContentPlan,
} from "../types/weekly-content-plan";

export const CURRENT_PLAN_VERSION = 5;
export const CURRENT_PRODUCT_STANDARD =
  "ready-to-execute-v2" as const;

type CreatePlanSnapshotOptions = {
  round?: number;
  variationIndex?: number;
  uniquenessAttempt?: number;
  duplicateFingerprintsAvoided?: number;
  qualityRejectedPlans?: number;
  regenerationAttempts?: number;
};

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("th-TH")
    .replace(/\s+/g, " ");
}

function normalizeClusterText(value: string) {
  return normalizeText(value)
    .replace(
      /\b(สินค้า|บริการ|ร้าน|เพจ|คอนเทนต์|ขาย|สำหรับ|กลุ่ม|ลูกค้า|ผู้ชม|ของ|และ|หรือ)\b/gu,
      " "
    )
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .slice(0, 120);
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

export function createContentClusterKey(
  request: PlanRequest
) {
  return hashValue(
    JSON.stringify({
      planType: request.planType,
      subject: normalizeClusterText(
        request.productOrService
      ),
      audience: normalizeClusterText(
        request.audience
      ).slice(0, 80),
      goal: request.goal,
      platform: request.platform,
    })
  );
}

export function createPlanVariationKey(
  orderId: string,
  round: number,
  customerProfileKey: string,
  variationIndex: number
) {
  return hashValue(
    [
      orderId.trim().toUpperCase(),
      round,
      customerProfileKey,
      variationIndex,
    ].join("|")
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
  variationIndex: number,
  createdAt: string
) {
  const generated = generateWeeklyContentPlan(
    request,
    {
      round,
      variationIndex,
    }
  );

  return {
    ...generated,
    id: `weekly-plan-${orderId.toLowerCase()}-r${round}-v${variationIndex}`,
    createdAt,
  };
}

export function createPlanSnapshot(
  orderId: string,
  request: PlanRequest,
  options: CreatePlanSnapshotOptions = {}
): CreatorPlanSnapshot {
  const safeRound = Math.max(
    1,
    Math.floor(options.round || 1)
  );
  const variationIndex = Math.max(
    0,
    Math.floor(options.variationIndex || 0)
  );
  const uniquenessAttempt = Math.max(
    0,
    Math.floor(options.uniquenessAttempt || 0)
  );
  const duplicateFingerprintsAvoided = Math.max(
    0,
    Math.floor(
      options.duplicateFingerprintsAvoided || 0
    )
  );
  const qualityRejectedPlans = Math.max(
    0,
    Math.floor(options.qualityRejectedPlans || 0)
  );
  const regenerationAttempts = Math.max(
    0,
    Math.floor(options.regenerationAttempts || 0)
  );
  const createdAt = new Date().toISOString();
  const customerProfileKey =
    createCustomerProfileKey(request);
  const contentClusterKey =
    createContentClusterKey(request);
  const variationKey = createPlanVariationKey(
    orderId,
    safeRound,
    customerProfileKey,
    variationIndex
  );
  const plan = createStoredPlan(
    orderId,
    request,
    safeRound,
    variationIndex,
    createdAt
  );
  const qualityReport = auditPlanQuality(
    plan,
    request,
    { regenerationAttempts }
  );

  return {
    plan,
    round: safeRound,
    version: CURRENT_PLAN_VERSION,
    productStandard: CURRENT_PRODUCT_STANDARD,
    customerProfileKey,
    contentClusterKey,
    variationKey,
    variationIndex,
    uniquenessAttempt,
    duplicateFingerprintsAvoided,
    qualityRejectedPlans,
    qualityReport,
    contentFingerprints:
      createContentFingerprints(plan),
    createdAt,
  };
}
