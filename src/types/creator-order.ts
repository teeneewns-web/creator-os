import type { PlanRequest } from "./plan-request";

export type CreatorOrderStatus =
  | "pending"
  | "approved";

export type CreatorOrder = {
  orderId: string;
  accessKey: string;
  status: CreatorOrderStatus;
  amount: number;
  request: PlanRequest;
  createdAt: string;
  approvedAt?: string;
};
