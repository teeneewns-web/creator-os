import type { PlanRequest } from "./plan-request";
import type { WeeklyContentPlan } from "./weekly-content-plan";

export type CreatorOrderStatus =
  | "pending"
  | "payment-submitted"
  | "approved";

export type CreatorPaymentProof = {
  imageDataUrl?: string;
  originalFileName?: string;
  transferName?: string;
  submittedAt: string;
  verifiedAt?: string;
};

export type CreatorPlanProductStandard =
  | "ready-to-execute-v1"
  | "ready-to-execute-v2";

export type CreatorPlanQualityCheck = {
  id: string;
  label: string;
  passed: boolean;
  critical: boolean;
  score: number;
  maxScore: number;
  message: string;
};

export type CreatorPlanQualityReport = {
  version: number;
  score: number;
  threshold: number;
  passed: boolean;
  checks: CreatorPlanQualityCheck[];
  blockingIssues: string[];
  auditedAt: string;
  regenerationAttempts: number;
};

export type CreatorPlanSnapshot = {
  plan: WeeklyContentPlan;
  round: number;
  version: number;
  productStandard: CreatorPlanProductStandard;
  customerProfileKey: string;
  contentClusterKey?: string;
  variationKey: string;
  variationIndex?: number;
  uniquenessAttempt?: number;
  duplicateFingerprintsAvoided?: number;
  qualityRejectedPlans?: number;
  qualityReport?: CreatorPlanQualityReport;
  contentFingerprints: string[];
  createdAt: string;
};

export type CreatorOrder = {
  orderId: string;
  accessKey: string;
  status: CreatorOrderStatus;
  amount: number;
  request: PlanRequest;
  customerKey?: string;
  createdAt: string;
  approvedAt?: string;
  paymentProof?: CreatorPaymentProof;

  previousOrderId?: string;
  rootOrderId?: string;
  planSnapshot?: CreatorPlanSnapshot;
};
