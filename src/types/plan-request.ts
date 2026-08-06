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

export type AudienceStage =
  | "new"
  | "aware"
  | "considering"
  | "existing";

export type AudienceValue =
  | "entertain"
  | "learn"
  | "solve"
  | "compare"
  | "inspire"
  | "trust"
  | "participate";

export type DesiredAction =
  | "follow"
  | "comment"
  | "save"
  | "share"
  | "message"
  | "click"
  | "order"
  | "book";

export type SupportNeed =
  | "ideas"
  | "full-script"
  | "shot-list"
  | "caption-cta"
  | "editing"
  | "schedule"
  | "sales-angle"
  | "consistency";

export type ContentTone =
  | "friendly"
  | "expert"
  | "fun"
  | "emotional"
  | "premium"
  | "direct";

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

  audienceStage: AudienceStage | "";
  audienceValue: AudienceValue | "";
  desiredAction: DesiredAction | "";
  supportNeeds: SupportNeed[];
  tone: ContentTone | "";

  goal: ContentGoal | "";
  platform: ContentPlatform | "";
  dailyTime: DailyTime | "";
  capabilities: ContentCapability[];

  createdAt: string;
};
