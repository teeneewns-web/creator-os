import type { PlanRequest } from "./plan-request";
import type { WeeklyContentPlan } from "./weekly-content-plan";

export type CreatorOrderStatus =
  | "pending"
  | "approved";

export type CreatorPlanProductStandard =
  | "ready-to-execute-v1";

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

  previousOrderId?: string;
  rootOrderId?: string;
  planSnapshot?: CreatorPlanSnapshot;
};
