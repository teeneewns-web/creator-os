import type {
  AudienceStage,
  AudienceValue,
  ContentDirection,
  ContentTone,
  DesiredAction,
  PlanType,
  SupportNeed,
} from "./plan-request";

export type ContentPlatform =
  | "facebook"
  | "tiktok"
  | "facebook-and-tiktok";

export type ContentGoal =
  | "sell"
  | "grow"
  | "engagement"
  | "trust"
  | "promote";

export type PlanIntensity =
  | "light"
  | "standard"
  | "growth";

export type ContentFormat =
  | "video"
  | "reel"
  | "image"
  | "carousel"
  | "text"
  | "story"
  | "live";

export type ContentTaskStatus =
  | "not-started"
  | "preparing"
  | "ready-to-film"
  | "filmed"
  | "editing"
  | "ready-to-post"
  | "posted";

export type MarketingPrinciple = {
  title: string;
  explanation: string;
};

export type FallbackContent = {
  format: ContentFormat;
  title: string;
  instructions: string[];
  caption?: string;
};

export type WeeklyContentDay = {
  day: number;

  stage: string;
  title: string;
  objective: string;

  marketingPrinciple: MarketingPrinciple;

  format: ContentFormat;
  publishTime: string;
  estimatedMinutes: number;

  topic: string;
  hook: string;
  script: string;

  shotList: string[];
  onScreenTexts: string[];

  caption: string;
  cta: string;
  hashtags: string[];

  preparation: string[];

  fallback: FallbackContent;

  afterPosting: string[];
  replyExamples: string[];
  metrics: string[];

  status: ContentTaskStatus;
};


export type PlatformGuidance = {
  title: string;
  explanation: string;
  actions: string[];
  measurements: string[];
  caution: string;
};

export type WeeklyContentPlan = {
  id: string;
  title: string;

  planType: PlanType;
  contentDirection: ContentDirection;

  productOrService: string;
  productHighlights: string[];
  audience: string;

  audienceStage: AudienceStage;
  audienceValue: AudienceValue;
  desiredAction: DesiredAction;
  supportNeeds: SupportNeed[];
  tone: ContentTone;

  platform: ContentPlatform;
  goal: ContentGoal;
  intensity: PlanIntensity;

  weeklyObjective: string;
  strategyExplanation: string;

  platformGuidance: PlatformGuidance;

  createdAt: string;
  days: WeeklyContentDay[];
};