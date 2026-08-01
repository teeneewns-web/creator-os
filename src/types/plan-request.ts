export type PlanType =
  | "product"
  | "service"
  | "creator";

export type ContentGoal =
  | "sell"
  | "grow"
  | "engagement"
  | "trust"
  | "promote";

export type ContentPlatform =
  | "facebook"
  | "tiktok"
  | "facebook-and-tiktok";

export type DailyTime =
  | "10-20"
  | "30-45"
  | "60-90"
  | "90-plus";

export type ContentCapability =
  | "film-product"
  | "face-camera"
  | "voice-over"
  | "image-only"
  | "no-face"
  | "no-media";

export type PlanRequest = {
  planType: PlanType | "";

  productOrService: string;
  productHighlights: string;
  audience: string;
  customerConcerns: string;
  promotionDetails: string;
  prohibitedClaims: string;

  goal: ContentGoal | "";
  platform: ContentPlatform | "";
  dailyTime: DailyTime | "";
  capabilities: ContentCapability[];

  createdAt: string;
};