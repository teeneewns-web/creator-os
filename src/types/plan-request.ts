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

export type ContentDirection =
  | "product-demo"
  | "product-review"
  | "product-lifestyle"
  | "product-problem-solution"
  | "product-offer"
  | "product-brand-story"
  | "service-results"
  | "service-process"
  | "service-expert"
  | "service-case-study"
  | "service-local"
  | "service-booking"
  | "creator-short-film"
  | "creator-comedy"
  | "creator-education"
  | "creator-review"
  | "creator-story"
  | "creator-gaming"
  | "creator-art"
  | "creator-lifestyle";

export type PlanRequest = {
  planType: PlanType | "";
  contentDirection: ContentDirection | "";

  productOrService: string;
  productHighlights: string;
  audience: string;
  customerConcerns: string;
  creatorChallenge: string;
  promotionDetails: string;
  prohibitedClaims: string;

  goal: ContentGoal | "";
  platform: ContentPlatform | "";
  dailyTime: DailyTime | "";
  capabilities: ContentCapability[];

  createdAt: string;
};
