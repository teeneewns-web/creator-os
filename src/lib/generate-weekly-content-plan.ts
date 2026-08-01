import type {
  ContentCapability,
  DailyTime,
  PlanRequest,
  PlanType,
} from "../types/plan-request";

import type {
  ContentFormat,
  ContentGoal,
  ContentPlatform,
  PlanIntensity,
  PlatformGuidance,
  WeeklyContentDay,
  WeeklyContentPlan,
} from "../types/weekly-content-plan";

type CampaignStage =
  | "problem"
  | "value"
  | "demo"
  | "objection"
  | "trust"
  | "story"
  | "community"
  | "comparison"
  | "behind-scenes"
  | "action";

type ResolvedRequest = {
  planType: PlanType;
  productOrService: string;
  productHighlights: string[];
  audience: string;
  customerConcerns: string[];
  promotionDetails: string;
  prohibitedClaims: string[];

  goal: ContentGoal;
  platform: ContentPlatform;
  intensity: PlanIntensity;
  capabilities: ContentCapability[];
  createdAt: string;
};

type StageContent = Pick<
  WeeklyContentDay,
  | "stage"
  | "title"
  | "objective"
  | "marketingPrinciple"
  | "topic"
  | "hook"
  | "script"
  | "shotList"
  | "onScreenTexts"
  | "caption"
  | "cta"
  | "afterPosting"
  | "replyExamples"
  | "metrics"
>;

const GOAL_LABELS: Record<ContentGoal, string> = {
  sell: "ขายสินค้า",
  grow: "เพิ่มผู้ติดตาม",
  engagement: "เพิ่มความคิดเห็นและการมีส่วนร่วม",
  trust: "สร้างความน่าเชื่อถือ",
  promote: "โปรโมตร้านหรือบริการ",
};

const PLATFORM_LABELS: Record<ContentPlatform, string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  "facebook-and-tiktok": "Facebook และ TikTok",
};

const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  product: "สินค้า / Affiliate",
  service: "บริการ / โปรโมตร้าน",
  creator: "เพจ / ครีเอเตอร์",
};

const INTENSITY_LABELS: Record<PlanIntensity, string> = {
  light: "แผนเบา ใช้เวลาน้อย",
  standard: "แผนมาตรฐาน",
  growth: "แผนเร่งการเติบโต",
};

type PlanDefaults = {
  subject: string;
  highlight: string;
  audience: string;
  concern: string;
};

function resolvePlanType(
  value: PlanRequest["planType"]
): PlanType {
  if (
    value === "service" ||
    value === "creator"
  ) {
    return value;
  }

  return "product";
}

function getPlanDefaults(
  planType: PlanType
): PlanDefaults {
  if (planType === "service") {
    return {
      subject: "บริการของคุณ",
      highlight: "มีขั้นตอนหรือจุดเด่นที่ช่วยแก้ปัญหาให้ลูกค้า",
      audience: "กลุ่มลูกค้าที่กำลังมองหาบริการนี้",
      concern: "ยังไม่แน่ใจเรื่องราคา ขั้นตอน หรือความเหมาะสมของบริการ",
    };
  }

  if (planType === "creator") {
    return {
      subject: "หัวข้อคอนเทนต์ของคุณ",
      highlight: "มีประสบการณ์หรือมุมมองที่เป็นประโยชน์ต่อผู้ชม",
      audience: "กลุ่มผู้ชมที่สนใจหัวข้อนี้",
      concern: "ยังไม่แน่ใจว่าเนื้อหานี้จะช่วยแก้ปัญหาหรือตอบคำถามของตนได้อย่างไร",
    };
  }

  return {
    subject: "สินค้าของคุณ",
    highlight: "มีจุดเด่นที่เหมาะกับการใช้งานของกลุ่มลูกค้า",
    audience: "กลุ่มลูกค้าที่สนใจสินค้านี้",
    concern: "ยังไม่แน่ใจว่าสินค้านี้เหมาะกับความต้องการของตัวเองหรือไม่",
  };
}

const STAGE_SEQUENCES: Record<
  ContentGoal,
  CampaignStage[]
> = {
  sell: [
    "problem",
    "demo",
    "value",
    "objection",
    "trust",
    "story",
    "action",
  ],

  grow: [
    "problem",
    "value",
    "community",
    "story",
    "trust",
    "comparison",
    "action",
  ],

  engagement: [
    "problem",
    "community",
    "value",
    "comparison",
    "story",
    "community",
    "action",
  ],

  trust: [
    "problem",
    "value",
    "behind-scenes",
    "objection",
    "trust",
    "story",
    "action",
  ],

  promote: [
    "problem",
    "value",
    "demo",
    "objection",
    "trust",
    "community",
    "action",
  ],
};

const FACEBOOK_TIMES = [
  "18:30–20:00 น. (เวลาเริ่มต้นทดลอง)",
  "11:30–13:00 น. (เวลาเริ่มต้นทดลอง)",
  "18:30–20:00 น. (เวลาเริ่มต้นทดลอง)",
  "11:30–13:00 น. (เวลาเริ่มต้นทดลอง)",
  "18:30–20:00 น. (เวลาเริ่มต้นทดลอง)",
  "10:00–12:00 น. (เวลาเริ่มต้นทดลอง)",
  "18:30–20:00 น. (เวลาเริ่มต้นทดลอง)",
];

const TIKTOK_TIMES = [
  "18:30–21:00 น. (เวลาเริ่มต้นทดลอง)",
  "11:30–13:30 น. (เวลาเริ่มต้นทดลอง)",
  "18:30–21:00 น. (เวลาเริ่มต้นทดลอง)",
  "18:30–21:00 น. (เวลาเริ่มต้นทดลอง)",
  "11:30–13:30 น. (เวลาเริ่มต้นทดลอง)",
  "10:00–12:00 น. (เวลาเริ่มต้นทดลอง)",
  "18:30–21:00 น. (เวลาเริ่มต้นทดลอง)",
];

function splitUserLines(value: string) {
  return value
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveGoal(
  value: PlanRequest["goal"]
): ContentGoal {
  return value || "sell";
}

function resolvePlatform(
  value: PlanRequest["platform"]
): ContentPlatform {
  return value || "facebook";
}

function resolveIntensity(
  dailyTime: DailyTime | ""
): PlanIntensity {
  if (dailyTime === "10-20") {
    return "light";
  }

  if (
    dailyTime === "60-90" ||
    dailyTime === "90-plus"
  ) {
    return "growth";
  }

  return "standard";
}

function resolveRequest(
  request: PlanRequest
): ResolvedRequest {
  const planType = resolvePlanType(
    request.planType
  );

  const defaults = getPlanDefaults(planType);

  const productHighlights =
    splitUserLines(request.productHighlights);

  const customerConcerns =
    splitUserLines(request.customerConcerns);

  const prohibitedClaims =
    splitUserLines(request.prohibitedClaims);

  return {
    planType,

    productOrService:
      request.productOrService.trim() ||
      defaults.subject,

    productHighlights:
      productHighlights.length > 0
        ? productHighlights
        : [defaults.highlight],

    audience:
      request.audience.trim() ||
      defaults.audience,

    customerConcerns:
      customerConcerns.length > 0
        ? customerConcerns
        : [defaults.concern],

    promotionDetails:
      request.promotionDetails.trim(),

    prohibitedClaims,

    goal: resolveGoal(request.goal),
    platform: resolvePlatform(request.platform),
    intensity: resolveIntensity(request.dailyTime),

    capabilities:
      request.capabilities.length > 0
        ? request.capabilities
        : ["no-media"],

    createdAt:
      request.createdAt ||
      new Date().toISOString(),
  };
}

function hasCapability(
  request: ResolvedRequest,
  capability: ContentCapability
) {
  return request.capabilities.includes(capability);
}

function canProduceVideo(
  request: ResolvedRequest
) {
  return (
    hasCapability(request, "film-product") ||
    hasCapability(request, "face-camera") ||
    hasCapability(request, "voice-over")
  );
}

function wantsNoFace(
  request: ResolvedRequest
) {
  return (
    hasCapability(request, "no-face") &&
    !hasCapability(request, "face-camera")
  );
}

function onlyUsesImages(
  request: ResolvedRequest
) {
  return (
    hasCapability(request, "image-only") &&
    !canProduceVideo(request)
  );
}

function hasNoMedia(
  request: ResolvedRequest
) {
  return hasCapability(request, "no-media");
}

function getBaseFormats(
  platform: ContentPlatform,
  intensity: PlanIntensity
): ContentFormat[] {
  if (platform === "facebook") {
    if (intensity === "light") {
      return [
        "image",
        "text",
        "image",
        "carousel",
        "text",
        "image",
        "carousel",
      ];
    }

    if (intensity === "growth") {
      return [
        "reel",
        "image",
        "reel",
        "carousel",
        "reel",
        "story",
        "reel",
      ];
    }

    return [
      "image",
      "reel",
      "image",
      "carousel",
      "reel",
      "image",
      "carousel",
    ];
  }

  if (intensity === "light") {
    return [
      "carousel",
      "reel",
      "carousel",
      "reel",
      "carousel",
      "reel",
      "carousel",
    ];
  }

  if (intensity === "growth") {
    return [
      "reel",
      "reel",
      "reel",
      "carousel",
      "reel",
      "reel",
      "reel",
    ];
  }

  return [
    "reel",
    "reel",
    "carousel",
    "reel",
    "reel",
    "carousel",
    "reel",
  ];
}

function adaptFormat(
  format: ContentFormat,
  request: ResolvedRequest
): ContentFormat {
  const isVideo =
    format === "reel" || format === "video";

  if (isVideo && !canProduceVideo(request)) {
    return hasNoMedia(request)
      ? "text"
      : "carousel";
  }

  if (
    onlyUsesImages(request) &&
    isVideo
  ) {
    return "carousel";
  }

  if (
    hasNoMedia(request) &&
    (format === "image" ||
      format === "carousel")
  ) {
    return request.platform === "facebook"
      ? "text"
      : "carousel";
  }

  return format;
}

function getFormatForDay(
  request: ResolvedRequest,
  dayIndex: number
) {
  const formats = getBaseFormats(
    request.platform,
    request.intensity
  );

  return adaptFormat(
    formats[dayIndex] || "image",
    request
  );
}

function getPublishTime(
  platform: ContentPlatform,
  dayIndex: number
) {
  if (platform === "facebook") {
    return FACEBOOK_TIMES[dayIndex];
  }

  if (platform === "tiktok") {
    return TIKTOK_TIMES[dayIndex];
  }

  return `${FACEBOOK_TIMES[dayIndex]} หรือ ${TIKTOK_TIMES[dayIndex]}`;
}

function getEstimatedMinutes(
  intensity: PlanIntensity,
  format: ContentFormat
) {
  let minutes = 30;

  if (intensity === "light") {
    minutes = 15;
  }

  if (intensity === "growth") {
    minutes = 50;
  }

  if (
    format === "reel" ||
    format === "video"
  ) {
    minutes += 10;
  }

  if (format === "carousel") {
    minutes += 5;
  }

  if (format === "text") {
    minutes -= 5;
  }

  return Math.max(10, minutes);
}

function getPrimaryAction(
  request: ResolvedRequest
) {
  const subject = request.productOrService;

  if (request.goal === "sell") {
    if (request.planType === "service") {
      return `ดูรายละเอียดของ ${subject} ให้ครบ แล้วติดต่อสอบถามหรือจองเมื่อพร้อม`;
    }

    if (request.planType === "creator") {
      return "ติดตามเพจ ดูรายละเอียดข้อเสนอ หรือส่งข้อความสอบถามเมื่อพร้อม";
    }

    return `ดูรายละเอียดของ ${subject} ให้ครบก่อนตัดสินใจ`;
  }

  if (request.goal === "grow") {
    return "ติดตามไว้เพื่อดูหัวข้อและตัวอย่างต่อไป";
  }

  if (request.goal === "engagement") {
    return "พิมพ์ความคิดเห็นหรือประสบการณ์ของคุณไว้ใต้โพสต์";
  }

  if (request.goal === "trust") {
    return "บันทึกโพสต์นี้ไว้ และถามข้อมูลเพิ่มเติมในจุดที่ยังไม่แน่ใจ";
  }

  if (request.planType === "creator") {
    return "ติดตามเพจ บันทึกโพสต์ หรือส่งข้อความเพื่อดูรายละเอียดเพิ่มเติม";
  }

  return `ดูรายละเอียดของ ${subject} หรือสอบถามข้อมูลเพิ่มเติม`;
}

function getWeeklyObjective(
  request: ResolvedRequest
) {
  if (request.planType === "creator") {
    if (request.goal === "sell") {
      return `ทำให้ ${request.audience} เห็นคุณค่าของคอนเทนต์เรื่อง ${request.productOrService} เชื่อใจผู้สร้าง และรู้ว่าควรติดตามหรือสอบถามข้อเสนออย่างไร`;
    }

    if (request.goal === "grow") {
      return `สร้างคอนเทนต์ที่มีประโยชน์เกี่ยวกับ ${request.productOrService} เพื่อดึงดูด ${request.audience} ให้ติดตามเพจอย่างต่อเนื่อง`;
    }

    if (request.goal === "engagement") {
      return `ชวน ${request.audience} แสดงความคิดเห็น เล่าประสบการณ์ และมีส่วนร่วมกับคอนเทนต์เรื่อง ${request.productOrService}`;
    }

    if (request.goal === "trust") {
      return `แสดงความรู้ ประสบการณ์ วิธีคิด และความโปร่งใส เพื่อสร้างความน่าเชื่อถือกับ ${request.audience}`;
    }

    return `ทำให้ ${request.audience} รู้จักเพจ เข้าใจแนวทางคอนเทนต์ และสนใจติดตามเรื่อง ${request.productOrService} มากขึ้น`;
  }

  if (request.planType === "service") {
    if (request.goal === "sell") {
      return `ทำให้ ${request.audience} เข้าใจ ${request.productOrService} เห็นขั้นตอนและประโยชน์ ลดข้อกังวล และติดต่อสอบถามหรือจองได้ง่ายขึ้น`;
    }

    if (request.goal === "grow") {
      return `สร้างคอนเทนต์ที่ช่วยแก้ปัญหาให้ ${request.audience} เพื่อเพิ่มโอกาสให้คนติดตามร้านหรือผู้ให้บริการต่อ`;
    }

    if (request.goal === "engagement") {
      return `ชวน ${request.audience} แสดงความคิดเห็น เล่าปัญหา และมีส่วนร่วมกับเนื้อหาที่เกี่ยวกับบริการ`;
    }

    if (request.goal === "trust") {
      return `แสดงขั้นตอน มาตรฐาน เหตุผล และความโปร่งใส เพื่อสร้างความมั่นใจให้ ${request.audience}`;
    }

    return `ทำให้ ${request.audience} รู้จัก เข้าใจ และสนใจ ${request.productOrService} มากขึ้น`;
  }

  if (request.goal === "sell") {
    return `ทำให้ ${request.audience} เข้าใจ ${request.productOrService} เห็นประโยชน์ ลดข้อสงสัย และตัดสินใจดูรายละเอียดได้ง่ายขึ้น`;
  }

  if (request.goal === "grow") {
    return `สร้างคอนเทนต์ที่มีประโยชน์และเกี่ยวข้องกับ ${request.audience} เพื่อเพิ่มโอกาสให้คนติดตามผลงานต่อ`;
  }

  if (request.goal === "engagement") {
    return `ชวน ${request.audience} แสดงความคิดเห็น แลกเปลี่ยนประสบการณ์ และมีส่วนร่วมกับเนื้อหาอย่างต่อเนื่อง`;
  }

  if (request.goal === "trust") {
    return `แสดงข้อมูล กระบวนการ เหตุผล และความโปร่งใส เพื่อสร้างความมั่นใจให้ ${request.audience}`;
  }

  return `ทำให้ ${request.audience} รู้จัก เข้าใจ และสนใจ ${request.productOrService} มากขึ้น`;
}

function getStrategyExplanation(
  request: ResolvedRequest
) {
  let goalLabel = GOAL_LABELS[request.goal];

  if (request.goal === "sell" && request.planType === "service") {
    goalLabel = "เพิ่มยอดสอบถามหรือยอดจอง";
  }

  if (request.goal === "sell" && request.planType === "creator") {
    goalLabel = "เปลี่ยนผู้ชมเป็นผู้ติดตามหรือลูกค้า";
  }

  if (request.goal === "promote" && request.planType === "creator") {
    goalLabel = "โปรโมตเพจ ผลงาน หรือข้อเสนอ";
  }

  const platformLabel =
    PLATFORM_LABELS[request.platform];

  return [
    `แผนประเภท ${PLAN_TYPE_LABELS[request.planType]} ออกแบบสำหรับ ${platformLabel} โดยมีเป้าหมายหลักคือ ${goalLabel}`,
    `ระบบเรียงเนื้อหาจากการทำให้ผู้ชมรู้สึกเกี่ยวข้อง ให้ข้อมูล แสดงตัวอย่าง ตอบข้อสงสัย และพาไปสู่การกระทำที่เหมาะสม`,
    `จำนวนและรูปแบบงานถูกปรับเป็น ${INTENSITY_LABELS[request.intensity]} ตามเวลาที่ผู้ใช้เลือก`,
    `เวลาที่แนะนำเป็นช่วงเริ่มต้นสำหรับทดลอง ควรปรับตามข้อมูลผู้ชมจริงเมื่อมีผลการใช้งาน`,
  ].join(" ");
}


function getPlatformGuidance(
  platform: ContentPlatform
): PlatformGuidance {
  if (platform === "facebook") {
    return {
      title: "หลักปฏิบัติสำหรับ Facebook",
      explanation:
        "Facebook เหมาะกับการใช้หลายรูปแบบร่วมกัน ทั้ง Reels ภาพ โพสต์ข้อความ และการสนทนาใต้โพสต์ แผนนี้จึงสลับรูปแบบเพื่อทดสอบว่าแบบใดตรงกับผู้ชมจริงของเพจมากที่สุด",
      actions: [
        "ใช้ภาพ วิดีโอ หรือข้อความที่คุณสร้างเองและมีสิทธิ์ใช้งาน",
        "ทดลอง Reels แนวตั้งเพื่อเข้าถึงคนใหม่ พร้อมสลับโพสต์ภาพหรือข้อความที่อธิบายรายละเอียดได้ครบ",
        "โพสต์อย่างสม่ำเสมอตามเวลาที่ทำได้จริง ไม่จำเป็นต้องเพิ่มจำนวนจนคุณภาพลดลง",
        "ตอบความคิดเห็นที่เป็นคำถามหรือมีรายละเอียด เพื่อสร้างการสนทนาที่เป็นธรรมชาติ",
        "เปิด Professional dashboard หรือ Insights หลังโพสต์ แล้วใช้ข้อมูลจริงปรับเวลาและรูปแบบวันถัดไป",
      ],
      measurements: [
        "การเข้าถึงและจำนวนผู้ชม",
        "เวลารับชมและการดูวิดีโอต่อ",
        "ความคิดเห็น การแชร์ และการบันทึก",
        "การเข้าชมโปรไฟล์ ผู้ติดตาม ข้อความสอบถาม หรือการคลิกตามเป้าหมาย",
      ],
      caution:
        "หลีกเลี่ยงการขอไลก์หรือคอมเมนต์แบบบังคับ เนื้อหาซ้ำที่ไม่ได้เพิ่มคุณค่า และคำกล่าวอ้างที่ตรวจสอบไม่ได้ ไม่มีจำนวนโพสต์หรือเวลาใดรับประกันยอดเข้าถึง",
    };
  }

  if (platform === "tiktok") {
    return {
      title: "หลักปฏิบัติสำหรับ TikTok",
      explanation:
        "TikTok แนะนำให้ลงคอนเทนต์คุณภาพอย่างสม่ำเสมอ ทำความเข้าใจผู้ชมผ่านความคิดเห็น และตรวจ Analytics แผนนี้จึงเน้นคลิปแนวตั้งที่เข้าเรื่องเร็ว พร้อมเก็บผลเพื่อนำไปปรับคลิปถัดไป",
      actions: [
        "เปิดคลิปด้วยปัญหา ผลลัพธ์ หรือภาพที่เข้าใจได้ทันทีในช่วงแรก",
        "ใช้คลิปต้นฉบับ ภาพชัด เสียงฟังรู้เรื่อง และข้อความบนหน้าจอที่อ่านง่าย",
        "ใส่คำสำคัญที่ตรงกับสิ่งที่ผู้ชมค้นหาไว้ในบทพูด ข้อความบนจอ และแคปชันอย่างเป็นธรรมชาติ",
        "ตอบความคิดเห็นและนำคำถามที่เกิดซ้ำไปทำเป็นคลิปตอนต่อไป",
        "ตรวจ TikTok Studio หรือ Analytics เพื่อดูคลิปที่คนดูต่อ มีส่วนร่วม และเข้าชมโปรไฟล์",
        "ใช้ Creator Search Insights เมื่อมีให้ใช้งาน เพื่อหาหัวข้อค้นหาหรือช่องว่างของคอนเทนต์",
      ],
      measurements: [
        "เวลาเฉลี่ยที่รับชมและอัตราดูจนจบ",
        "ยอดดู การกดถูกใจ ความคิดเห็น การแชร์ และการบันทึก",
        "การเข้าชมโปรไฟล์และผู้ติดตามใหม่",
        "การค้นพบจากคำค้น ข้อความสอบถาม หรือการคลิกตามเป้าหมาย",
      ],
      caution:
        "อย่าโพสต์ถี่จนคุณภาพลดลง และอย่ารับประกันยอดดู หากคอนเทนต์โปรโมตแบรนด์ สินค้า หรือบริการ ให้เปิดการเปิดเผยเนื้อหาเชิงพาณิชย์ตามข้อกำหนดของ TikTok",
    };
  }

  return {
    title: "หลักปฏิบัติสำหรับ Facebook และ TikTok",
    explanation:
      "ใช้แกนเนื้อหาเดียวกันได้ แต่ควรปรับรูปแบบให้เหมาะกับแต่ละแพลตฟอร์ม: TikTok เน้นคลิปที่เข้าเรื่องเร็ว ส่วน Facebook ใช้ทั้ง Reels ภาพ ข้อความ และการสนทนาเพื่อให้รายละเอียดครบ",
    actions: [
      "สร้างต้นฉบับหนึ่งชุด แล้วปรับประโยคเปิด แคปชัน และคำชวนให้เหมาะกับแต่ละแพลตฟอร์ม",
      "ใช้วิดีโอแนวตั้งที่ไม่มีลายน้ำจากแพลตฟอร์มอื่น",
      "บน TikTok ให้เข้าเรื่องเร็วและใช้คำสำคัญที่ผู้ชมค้นหา",
      "บน Facebook ให้เพิ่มบริบทในแคปชันและตอบความคิดเห็นที่มีรายละเอียด",
      "ตรวจ Analytics แยกกัน เพราะเนื้อหาเดียวกันอาจได้ผลต่างกันในแต่ละแพลตฟอร์ม",
    ],
    measurements: [
      "เวลารับชมและอัตราดูต่อของแต่ละแพลตฟอร์ม",
      "ความคิดเห็น การแชร์ การบันทึก และการเข้าชมโปรไฟล์",
      "ผู้ติดตามใหม่ ข้อความสอบถาม หรือการคลิกตามเป้าหมาย",
      "รูปแบบและหัวข้อที่ทำผลงานดีที่สุดแยก Facebook กับ TikTok",
    ],
    caution:
      "อย่าคัดลอกทุกอย่างเหมือนกันทั้งหมด และอย่าตัดสินจากยอดดูเพียงอย่างเดียว ให้เปรียบเทียบกับเป้าหมายของแผนและข้อมูลจริงของแต่ละบัญชี",
  };
}

function shortAudience(audience: string) {
  return (
    audience
      .split(/,|\n|และ/)
      .map((item) => item.trim())
      .find(Boolean) || audience
  );
}

function safeHashtag(value: string) {
  const cleaned = value
    .replace(/[^ก-๙a-zA-Z0-9]/g, "")
    .slice(0, 28);

  return cleaned ? `#${cleaned}` : "";
}

function buildHashtags(
  request: ResolvedRequest,
  stage: CampaignStage
) {
  const stageLabels: Record<
    CampaignStage,
    string
  > = {
    problem: "ปัญหาที่ลูกค้าเจอ",
    value: "เคล็ดลับก่อนตัดสินใจ",
    demo: "สาธิตการใช้งาน",
    objection: "ตอบข้อสงสัย",
    trust: "ข้อมูลก่อนตัดสินใจ",
    story: "ใช้งานจริง",
    community: "ร่วมแสดงความคิดเห็น",
    comparison: "เปรียบเทียบก่อนเลือก",
    "behind-scenes": "เบื้องหลังการทำงาน",
    action: "สรุปก่อนตัดสินใจ",
  };

  const platformTag =
    request.platform === "facebook"
      ? "#คอนเทนต์Facebook"
      : request.platform === "tiktok"
        ? "#คอนเทนต์TikTok"
        : "#คอนเทนต์ออนไลน์";

  return Array.from(
    new Set(
      [
        safeHashtag(request.productOrService),
        safeHashtag(
          shortAudience(request.audience)
        ),
        safeHashtag(stageLabels[stage]),
        platformTag,
        "#CreatorOS",
      ].filter(Boolean)
    )
  );
}

function buildPreparation(
  request: ResolvedRequest,
  format: ContentFormat
) {
  const items = [
    `ข้อมูลจริงของ ${request.productOrService}`,
    "รายการจุดเด่นที่ตรวจสอบแล้ว",
  ];

  if (
    format === "reel" ||
    format === "video"
  ) {
    items.push(
      "โทรศัพท์สำหรับถ่ายวิดีโอ",
      "แสงธรรมชาติหรือไฟที่สว่างพอ",
      "ขาตั้งโทรศัพท์หรือพื้นที่วางโทรศัพท์"
    );
  }

  if (
    format === "image" ||
    format === "carousel"
  ) {
    items.push(
      "ภาพที่เห็นรายละเอียดชัดเจน",
      "พื้นหลังเรียบหรือรูปแบบภาพที่อ่านง่าย"
    );
  }

  if (format === "text") {
    items.push(
      "ข้อมูลที่จะเขียนให้ครบ",
      "ตรวจคำและแบ่งบรรทัดให้อ่านง่าย"
    );
  }

  if (hasCapability(request, "voice-over")) {
    items.push(
      "สถานที่เงียบสำหรับอัดเสียงพากย์"
    );
  }

  if (wantsNoFace(request)) {
    items.push(
      "เตรียมถ่ายเฉพาะสินค้า มือ หรือภาพประกอบ โดยไม่ต้องเห็นใบหน้า"
    );
  }

  if (request.prohibitedClaims.length > 0) {
    items.push(
      `ตรวจไม่ให้กล่าวอ้างสิ่งต้องห้าม: ${request.prohibitedClaims.join(
        ", "
      )}`
    );
  }

  return Array.from(new Set(items));
}

function buildFallback(
  request: ResolvedRequest,
  format: ContentFormat,
  title: string,
  caption: string
): WeeklyContentDay["fallback"] {
  if (
    format === "reel" ||
    format === "video"
  ) {
    return {
      format: "carousel",
      title: `เปลี่ยนคลิป “${title}” เป็นภาพหลายหน้า`,
      instructions: [
        "ทำภาพหน้าปกที่มีหัวข้อใหญ่และอ่านง่าย",
        "แบ่งเนื้อหาหลักออกเป็น 3–5 ภาพ",
        "ใช้เฉพาะข้อมูลจริงที่ผู้ใช้ระบุ",
        "ภาพสุดท้ายใส่คำชวนให้คนทำต่อ",
      ],
      caption,
    };
  }

  if (
    format === "image" ||
    format === "carousel"
  ) {
    return {
      format: "text",
      title: `เปลี่ยน “${title}” เป็นโพสต์ข้อความ`,
      instructions: [
        "เปิดด้วยคำถามหรือปัญหาสั้น ๆ",
        "แบ่งเนื้อหาเป็นย่อหน้าหรือรายการ",
        "ยกตัวอย่างจากข้อมูลจริง",
        "ปิดด้วยคำถามหรือคำชวนให้ทำต่อ",
      ],
      caption,
    };
  }

  return {
    format: "image",
    title: `เปลี่ยนโพสต์ข้อความเป็นภาพสรุป`,
    instructions: [
      "เลือกประโยคสำคัญที่สุดหนึ่งประโยค",
      "ทำภาพพื้นหลังเรียบและตัวอักษรขนาดใหญ่",
      "ใส่รายละเอียดเพิ่มเติมไว้ในแคปชัน",
    ],
    caption,
  };
}

function getMetrics(goal: ContentGoal) {
  if (goal === "sell") {
    return [
      "จำนวนการคลิกดูรายละเอียด",
      "จำนวนข้อความสอบถาม",
      "จำนวนความคิดเห็นเกี่ยวกับสินค้า",
      "จำนวนการบันทึกหรือแชร์",
    ];
  }

  if (goal === "grow") {
    return [
      "จำนวนผู้ติดตามใหม่",
      "จำนวนการเข้าชมโปรไฟล์หรือเพจ",
      "จำนวนการแชร์",
      "จำนวนการบันทึก",
    ];
  }

  if (goal === "engagement") {
    return [
      "จำนวนความคิดเห็น",
      "จำนวนความคิดเห็นที่มีรายละเอียด",
      "จำนวนการแชร์",
      "หัวข้อที่คนพูดถึงซ้ำ",
    ];
  }

  if (goal === "trust") {
    return [
      "จำนวนการบันทึก",
      "จำนวนคำถามที่จริงจัง",
      "จำนวนการเข้าชมโปรไฟล์หรือเพจ",
      "จำนวนข้อความสอบถามข้อมูลเพิ่มเติม",
    ];
  }

  return [
    "จำนวนคนที่เห็นโพสต์",
    "จำนวนการเข้าชมโปรไฟล์หรือเพจ",
    "จำนวนข้อความสอบถาม",
    "จำนวนการแชร์หรือบันทึก",
  ];
}

function getAfterPosting(
  goal: ContentGoal,
  stage: CampaignStage
) {
  const items = [
    "ตอบความคิดเห็นแรก ๆ เมื่อสะดวก โดยเน้นคำถามที่มีรายละเอียดก่อน",
    "หลีกเลี่ยงการตอบข้อมูลที่ยังไม่ได้ตรวจสอบ",
    "จดคำถามหรือปัญหาที่ถูกพูดถึงซ้ำ",
  ];

  if (
    stage === "community" ||
    goal === "engagement"
  ) {
    items.push(
      "ถามต่อจากคำตอบของผู้ชมเพื่อให้การสนทนาดำเนินต่อ"
    );
  }

  if (
    goal === "sell" ||
    goal === "promote"
  ) {
    items.push(
      "ตอบคำถามเรื่องสินค้าอย่างตรงไปตรงมา โดยไม่เร่งรัดการตัดสินใจ"
    );
  }

  items.push(
    "นำข้อมูลที่ได้ไปใช้ปรับหัวข้อหรือเนื้อหาวันถัดไป"
  );

  return items;
}

function getReplyExamples(
  request: ResolvedRequest
) {
  const concern =
    request.customerConcerns[0];

  return [
    `ขอบคุณสำหรับคำถามครับ เรื่อง “${concern}” เป็นจุดที่ควรตรวจให้ชัดก่อนตัดสินใจจริง ๆ`,
    `ปกติคุณต้องการใช้ ${request.productOrService} ในสถานการณ์แบบไหนครับ?`,
    "ข้อมูลส่วนนี้ควรตรวจจากรายละเอียดจริงก่อนครับ หากมีข้อมูลเพิ่มเติมจะตอบให้ตรงที่สุด",
  ];
}

function createCreatorStageContent(
  stage: CampaignStage,
  request: ResolvedRequest
): StageContent {
  const subject = request.productOrService;
  const audience = request.audience;
  const audienceShort = shortAudience(audience);
  const firstHighlight = request.productHighlights[0];
  const secondHighlight =
    request.productHighlights[1] ||
    "มีตัวอย่างที่นำไปทำตามได้";
  const concern = request.customerConcerns[0];
  const action = getPrimaryAction(request);

  const common = {
    afterPosting: [
      "ตอบความคิดเห็นแรก ๆ เมื่อสะดวก โดยเริ่มจากคำถามที่มีรายละเอียด",
      "ถามต่อเพื่อให้เข้าใจปัญหาหรือความสนใจของผู้ชมมากขึ้น",
      "จดคำถามที่ถูกพูดถึงซ้ำ เพื่อนำไปทำคอนเทนต์วันต่อไป",
      "ดูว่าส่วนใดทำให้คนหยุดดู บันทึก แชร์ หรือเข้าชมโปรไฟล์",
    ],
    replyExamples: [
      `ขอบคุณที่เล่าครับ เรื่อง “${concern}” เป็นปัญหาที่หลายคนน่าจะกำลังเจอเหมือนกัน`,
      `ตอนนี้คุณอยากพัฒนาเรื่อง ${subject} ในส่วนไหนมากที่สุดครับ?`,
      "คำถามนี้ดีมากครับ จะนำไปทำเป็นหัวข้ออธิบายแบบละเอียดในโพสต์ต่อไป",
    ],
    metrics: adaptListToPlanType(
      getMetrics(request.goal),
      request
    ),
  };

  if (stage === "problem") {
    return {
      stage: "ทำให้ผู้ชมรู้สึกว่าเพจเข้าใจเขา",
      title: `คนที่สนใจ ${subject} มักติดปัญหาอะไร?`,
      objective:
        "ดึงความสนใจด้วยปัญหาจริงของผู้ชม และเก็บคำตอบไว้ใช้วางหัวข้อต่อไป",
      marketingPrinciple: {
        title: "เริ่มจากปัญหาที่ผู้ชมกำลังเจอ",
        explanation:
          "ผู้ชมมีแนวโน้มหยุดดูและตอบมากขึ้น เมื่อเนื้อหาพูดถึงปัญหาที่ตรงกับชีวิตของตนเอง",
      },
      topic: `ปัญหาที่ ${audienceShort} มักเจอเกี่ยวกับ ${subject}`,
      hook: `ตอนนี้เรื่อง ${subject} จุดไหนทำให้คุณติดมากที่สุด?`,
      script:
        `หลายคนที่เป็น ${audience} อาจกำลังเจอปัญหาเรื่อง ${concern} วันนี้อยากรู้ว่าคุณติดตรงไหนมากที่สุด ลองพิมพ์คำถามหรือปัญหาของคุณไว้ คำตอบที่ได้จะถูกนำไปทำเป็นคอนเทนต์ที่อธิบายง่ายและตรงกับสิ่งที่ผู้ชมอยากรู้จริงครับ`,
      shotList: [
        "เปิดด้วยข้อความปัญหาหลักบนหน้าจอ",
        `ยกตัวอย่างสถานการณ์ของ ${audienceShort}`,
        `พูดหรือพากย์คำถามว่า “${concern} ใช่ปัญหาของคุณไหม?”`,
        "ปิดด้วยการชวนให้พิมพ์ปัญหาของตัวเอง",
      ],
      onScreenTexts: [
        `เรื่อง ${subject} คุณติดตรงไหน?`,
        concern,
        "พิมพ์ปัญหาของคุณไว้ได้เลย",
      ],
      caption:
        `คนที่กำลังสนใจ ${subject} มักติดปัญหาตรงไหนมากที่สุด?\n\nตัวอย่างเช่น ${concern}\n\nพิมพ์คำถามหรือปัญหาของคุณไว้ได้เลย จะนำคำตอบไปทำเป็นคอนเทนต์ต่อครับ`,
      cta: "พิมพ์ปัญหาหรือคำถามของคุณไว้ใต้โพสต์",
      ...common,
    };
  }

  if (stage === "value") {
    return {
      stage: "ให้ประโยชน์ที่นำไปใช้ได้",
      title: `3 เรื่องที่ควรรู้ก่อนเริ่ม ${subject}`,
      objective:
        "ให้ผู้ชมได้ผลลัพธ์เล็ก ๆ ทันที และเห็นเหตุผลว่าทำไมควรติดตามเพจต่อ",
      marketingPrinciple: {
        title: "ให้คุณค่าก่อนขอการติดตาม",
        explanation:
          "เมื่อผู้ชมได้รับข้อมูลที่ช่วยแก้ปัญหาได้จริง เขาจะมีเหตุผลมากขึ้นในการบันทึก แชร์ และติดตาม",
      },
      topic: `พื้นฐาน 3 ข้อสำหรับเริ่มเรื่อง ${subject}`,
      hook: `กำลังเริ่ม ${subject} อยู่หรือเปล่า? จำ 3 เรื่องนี้ไว้ก่อน`,
      script:
        `ถ้าคุณกำลังเริ่มเรื่อง ${subject} ให้จำสามเรื่องครับ หนึ่ง ${firstHighlight} สอง ${secondHighlight} และสาม เริ่มจากปัญหาที่คุณต้องการแก้จริง ไม่ต้องทำทุกอย่างพร้อมกัน เลือกหนึ่งข้อไปทดลองก่อน แล้วจดว่าผลลัพธ์ดีขึ้นตรงไหนครับ`,
      shotList: [
        "ขึ้นหัวข้อ 3 เรื่องที่ควรรู้",
        `อธิบายข้อ 1: ${firstHighlight}`,
        `อธิบายข้อ 2: ${secondHighlight}`,
        "อธิบายข้อ 3: เริ่มจากปัญหาจริงหนึ่งข้อ",
        "ปิดด้วยการชวนให้บันทึกโพสต์",
      ],
      onScreenTexts: [
        `เริ่ม ${subject} ให้ดู 3 เรื่องนี้`,
        firstHighlight,
        secondHighlight,
        "เริ่มทีละหนึ่งเรื่อง",
      ],
      caption:
        `เริ่มเรื่อง ${subject} แบบไม่สับสน\n\n1. ${firstHighlight}\n2. ${secondHighlight}\n3. เลือกปัญหาจริงหนึ่งข้อแล้วทดลองทำ\n\nบันทึกโพสต์นี้ไว้ใช้ตอนลงมือทำได้เลยครับ`,
      cta: action,
      ...common,
    };
  }

  if (stage === "demo") {
    return {
      stage: "ทำให้ดูเป็นตัวอย่าง",
      title: `ตัวอย่างสั้น ๆ เรื่อง ${subject} ที่ทำตามได้`,
      objective:
        "เปลี่ยนความรู้ให้เป็นขั้นตอนที่ผู้ชมเห็นภาพและลองทำตามได้ทันที",
      marketingPrinciple: {
        title: "ตัวอย่างจริงช่วยลดความยาก",
        explanation:
          "ผู้ชมเข้าใจเร็วขึ้นเมื่อเห็นลำดับก่อนทำ ระหว่างทำ และผลลัพธ์หลังทำ",
      },
      topic: `สาธิตหนึ่งขั้นตอนเกี่ยวกับ ${subject}`,
      hook: `ดูตัวอย่างนี้จบ คุณจะรู้ว่าจะเริ่ม ${subject} จากตรงไหน`,
      script:
        `วันนี้จะทำให้ดูหนึ่งตัวอย่างเกี่ยวกับ ${subject} เริ่มจากปัญหา ${concern} จากนั้นใช้แนวทาง ${firstHighlight} แล้วตรวจผลว่าดีขึ้นตรงไหน จุดสำคัญคือไม่ต้องทำหลายอย่างพร้อมกัน ให้ทดลองหนึ่งขั้นตอนและบันทึกผลไว้ครับ`,
      shotList: [
        "เปิดด้วยภาพหรือข้อความก่อนเริ่ม",
        `แสดงปัญหา: ${concern}`,
        `ทำขั้นตอนหลักโดยใช้แนวทาง ${firstHighlight}`,
        "แสดงผลลัพธ์หรือสิ่งที่ได้เรียนรู้",
        "ปิดด้วยขั้นตอนที่ผู้ชมควรลองทำต่อ",
      ],
      onScreenTexts: [
        "ก่อนทำ",
        firstHighlight,
        "หลังทำ ได้เรียนรู้อะไร?",
      ],
      caption:
        `ตัวอย่างสั้น ๆ เรื่อง ${subject}\n\nเริ่มจากปัญหา “${concern}” แล้วทดลองใช้แนวทาง ${firstHighlight}\n\nลองทำตามหนึ่งครั้ง แล้วจดผลที่เกิดขึ้นจริงของคุณไว้ครับ`,
      cta: "ลองทำหนึ่งขั้นตอน แล้วกลับมาบอกผลลัพธ์ใต้โพสต์",
      ...common,
    };
  }

  if (stage === "objection") {
    return {
      stage: "ตอบคำถามที่ทำให้ผู้ชมลังเล",
      title: `ตอบตรง ๆ: ${concern}`,
      objective:
        "ลดความสับสนด้วยคำตอบที่ชัดเจน ไม่แต่งข้อมูล และไม่รับประกันผลลัพธ์เกินจริง",
      marketingPrinciple: {
        title: "ตอบข้อกังวลก่อนขอให้เชื่อ",
        explanation:
          "คำตอบที่ตรงไปตรงมาและบอกข้อจำกัดได้ ช่วยสร้างความน่าเชื่อถือมากกว่าการพูดแต่ข้อดี",
      },
      topic: `คำตอบสำหรับคำถามเรื่อง ${concern}`,
      hook: `มีคนถามว่า “${concern}” คำตอบตรง ๆ คือแบบนี้ครับ`,
      script:
        `คำถามที่เจอบ่อยคือ ${concern} สิ่งที่ยืนยันได้จากข้อมูลของเพจตอนนี้คือ ${firstHighlight} แต่ผลลัพธ์ของแต่ละคนอาจต่างกันตามพื้นฐาน เวลา และการลงมือทำ ดังนั้นให้ใช้ข้อมูลนี้เป็นแนวทาง ทดลองทีละขั้น และประเมินจากผลจริงของตัวเองครับ`,
      shotList: [
        "ขึ้นคำถามเต็มหน้าจอ",
        "ตอบสิ่งที่ยืนยันได้อย่างชัดเจน",
        "บอกข้อจำกัดหรือสิ่งที่ขึ้นอยู่กับแต่ละคน",
        "ให้ขั้นตอนที่ผู้ชมลองทำต่อได้",
      ],
      onScreenTexts: [
        `คำถาม: ${concern}`,
        `สิ่งที่ยืนยันได้: ${firstHighlight}`,
        "ผลลัพธ์ของแต่ละคนอาจต่างกัน",
      ],
      caption:
        `คำถาม: ${concern}\n\nสิ่งที่ยืนยันได้คือ ${firstHighlight}\n\nผลลัพธ์อาจต่างกันตามพื้นฐานและการลงมือทำ จึงควรทดลองและวัดจากผลจริงของตัวเองครับ`,
      cta: "มีคำถามเพิ่มเติม พิมพ์ไว้ได้เลย จะตอบจากข้อมูลที่ตรวจสอบได้",
      ...common,
    };
  }

  if (stage === "trust") {
    return {
      stage: "สร้างความน่าเชื่อถือ",
      title: `คอนเทนต์เรื่อง ${subject} เหมาะกับใคร และไม่เหมาะกับใคร?`,
      objective:
        "บอกขอบเขตของเพจอย่างตรงไปตรงมา เพื่อให้ผู้ชมรู้ว่าจะได้รับอะไรจากการติดตาม",
      marketingPrinciple: {
        title: "การบอกข้อจำกัดช่วยสร้างความไว้ใจ",
        explanation:
          "เพจที่ไม่พยายามเหมาะกับทุกคน จะดูจริงใจและช่วยให้ดึงดูดผู้ชมที่ตรงกลุ่มมากขึ้น",
      },
      topic: `กลุ่มผู้ชมที่เหมาะกับคอนเทนต์เรื่อง ${subject}`,
      hook: `เพจนี้อาจไม่เหมาะกับทุกคน ลองดูก่อนว่าตรงกับคุณหรือไม่`,
      script:
        `คอนเทนต์เรื่อง ${subject} เหมาะกับ ${audience} โดยเฉพาะคนที่ต้องการ ${firstHighlight} แต่อาจไม่เหมาะกับคนที่ต้องการผลลัพธ์ทันทีโดยไม่ลงมือทำ หรือกำลังมองหาเรื่องที่อยู่นอกขอบเขตของเพจ การบอกให้ชัดตั้งแต่ต้นช่วยให้ทุกคนเลือกติดตามได้ตรงความต้องการครับ`,
      shotList: [
        "ทำหน้าปกว่า เหมาะกับใคร",
        `อธิบายกลุ่มหลัก: ${audienceShort}`,
        `อธิบายสิ่งที่จะได้รับ: ${firstHighlight}`,
        "บอกกลุ่มที่อาจไม่เหมาะ",
        "ปิดด้วยการชวนให้ติดตามเมื่อเนื้อหาตรงกับเป้าหมาย",
      ],
      onScreenTexts: [
        "เพจนี้เหมาะกับใคร?",
        audienceShort,
        firstHighlight,
        "เลือกติดตามจากสิ่งที่คุณต้องการจริง",
      ],
      caption:
        `คอนเทนต์เรื่อง ${subject} เหมาะกับ ${audience}\n\nจุดที่เพจเน้นคือ ${firstHighlight}\n\nแต่อาจไม่เหมาะกับคนที่ต้องการผลลัพธ์ทันทีโดยไม่ทดลองทำ เลือกติดตามจากเป้าหมายจริงของคุณได้เลยครับ`,
      cta: action,
      ...common,
    };
  }

  if (stage === "story") {
    return {
      stage: "เล่าเรื่องให้ผู้ชมเห็นภาพ",
      title: `จากปัญหา ${concern} เริ่มแก้อย่างไร?`,
      objective:
        "ใช้สถานการณ์ใกล้ตัวเพื่อให้ผู้ชมเห็นลำดับการแก้ปัญหาและนำไปปรับใช้ได้",
      marketingPrinciple: {
        title: "เรื่องเล่าช่วยให้ข้อมูลจำง่าย",
        explanation:
          "เมื่อมีจุดเริ่ม ปัญหา การลงมือทำ และสิ่งที่ได้เรียนรู้ ผู้ชมจะเข้าใจและจดจำเนื้อหาได้ดีขึ้น",
      },
      topic: `หนึ่งสถานการณ์จริงเกี่ยวกับ ${subject}`,
      hook: `ถ้าคุณกำลังเจอปัญหา ${concern} ลองเริ่มจากขั้นตอนนี้`,
      script:
        `สมมุติว่าคุณเป็น ${audienceShort} และกำลังเจอปัญหา ${concern} ขั้นแรกอย่าเพิ่งพยายามแก้ทุกอย่าง ให้เลือกเป้าหมายหนึ่งข้อ จากนั้นใช้แนวทาง ${firstHighlight} ทดลองทำ แล้วจดว่าอะไรดีขึ้นหรือยังติดตรงไหน ข้อมูลนั้นจะบอกขั้นตอนถัดไปได้ชัดกว่าการเดาครับ`,
      shotList: [
        "เปิดด้วยสถานการณ์ก่อนแก้ปัญหา",
        `แสดงปัญหา: ${concern}`,
        "เลือกเป้าหมายหนึ่งข้อ",
        `ทดลองแนวทาง: ${firstHighlight}`,
        "สรุปสิ่งที่ได้เรียนรู้และขั้นตอนต่อไป",
      ],
      onScreenTexts: [
        "ปัญหาที่เจอ",
        concern,
        "ลองทีละหนึ่งขั้นตอน",
        "จดผลแล้วปรับต่อ",
      ],
      caption:
        `เมื่อเจอปัญหา “${concern}” ไม่จำเป็นต้องแก้ทุกอย่างพร้อมกัน\n\nเลือกหนึ่งเป้าหมาย ทดลองแนวทาง ${firstHighlight} แล้วจดผลที่เกิดขึ้นจริง\n\nขั้นตอนเล็ก ๆ ที่วัดผลได้ ช่วยให้พัฒนาต่อได้ง่ายกว่าครับ`,
      cta: "พิมพ์ขั้นตอนแรกที่คุณจะลองทำไว้ใต้โพสต์",
      ...common,
    };
  }

  if (stage === "community") {
    return {
      stage: "ชวนผู้ชมมีส่วนร่วม",
      title: `เรื่อง ${subject} คุณอยากพัฒนาส่วนไหนมากที่สุด?`,
      objective:
        "เพิ่มความคิดเห็นและค้นหาหัวข้อที่ผู้ชมต้องการจริง เพื่อใช้วางคอนเทนต์ต่อไป",
      marketingPrinciple: {
        title: "คำถามที่มีตัวเลือกช่วยให้ตอบง่าย",
        explanation:
          "ตัวเลือกสั้น ๆ ลดความยากในการเริ่มตอบ และเปิดทางให้ผู้ชมอธิบายเหตุผลเพิ่มเติม",
      },
      topic: `สำรวจความต้องการของ ${audienceShort}`,
      hook: `เลือกได้หนึ่งข้อ เรื่อง ${subject} คุณอยากพัฒนาส่วนไหนก่อน?`,
      script:
        `ถ้าเลือกได้หนึ่งข้อ ตอนนี้คุณอยากพัฒนาเรื่องไหนก่อน ระหว่าง A ${firstHighlight} B ${secondHighlight} หรือ C แก้ปัญหา ${concern} พิมพ์ A B หรือ C พร้อมเหตุผลได้เลย คำตอบจะช่วยให้เนื้อหาต่อไปตรงกับสิ่งที่ผู้ชมต้องการจริงครับ`,
      shotList: [
        "ทำหน้าปกเป็นคำถามสั้น ๆ",
        `ตัวเลือก A: ${firstHighlight}`,
        `ตัวเลือก B: ${secondHighlight}`,
        `ตัวเลือก C: ${concern}`,
        "ปิดด้วยการชวนให้พิมพ์เหตุผล",
      ],
      onScreenTexts: [
        "คุณอยากพัฒนาเรื่องไหนก่อน?",
        `A. ${firstHighlight}`,
        `B. ${secondHighlight}`,
        `C. ${concern}`,
      ],
      caption:
        `เรื่อง ${subject} คุณอยากพัฒนาส่วนไหนก่อน?\n\nA. ${firstHighlight}\nB. ${secondHighlight}\nC. ${concern}\n\nพิมพ์ตัวเลือกพร้อมเหตุผลได้เลยครับ`,
      cta: "พิมพ์ A, B หรือ C พร้อมเหตุผลของคุณ",
      ...common,
    };
  }

  if (stage === "comparison") {
    return {
      stage: "ช่วยผู้ชมแยกทางเลือก",
      title: `${firstHighlight} กับ ${secondHighlight} ควรเริ่มอะไรก่อน?`,
      objective:
        "ช่วยผู้ชมเปรียบเทียบสองแนวทาง และเลือกสิ่งที่ตรงกับปัญหาของตัวเอง",
      marketingPrinciple: {
        title: "การเปรียบเทียบช่วยลดความสับสน",
        explanation:
          "เมื่อเห็นข้อแตกต่างและสถานการณ์ที่เหมาะกับแต่ละทาง ผู้ชมจะเลือกขั้นตอนเริ่มต้นได้ง่ายขึ้น",
      },
      topic: `เปรียบเทียบสองแนวทางในเรื่อง ${subject}`,
      hook: `ถ้าต้องเริ่มอย่างเดียว ระหว่าง ${firstHighlight} กับ ${secondHighlight} คุณควรเลือกอะไร?`,
      script:
        `${firstHighlight} เหมาะเมื่อคุณต้องการเริ่มจากพื้นฐานที่ชัดเจน ส่วน ${secondHighlight} เหมาะเมื่อคุณพร้อมนำไปทดลองจริง ไม่มีข้อไหนดีที่สุดสำหรับทุกคน ให้เลือกจากปัญหาที่ต้องการแก้ตอนนี้ แล้วทดลองหนึ่งแนวทางก่อนครับ`,
      shotList: [
        "แบ่งหน้าจอเป็นสองฝั่ง",
        `ฝั่งแรก: ${firstHighlight}`,
        `ฝั่งที่สอง: ${secondHighlight}`,
        "บอกสถานการณ์ที่เหมาะกับแต่ละฝั่ง",
        "ปิดด้วยคำถามให้ผู้ชมเลือก",
      ],
      onScreenTexts: [
        "ควรเริ่มอะไรก่อน?",
        firstHighlight,
        secondHighlight,
      ],
      caption:
        `ระหว่าง “${firstHighlight}” กับ “${secondHighlight}” คุณควรเริ่มจากอะไร?\n\nเลือกจากปัญหาที่ต้องการแก้ตอนนี้ และทดลองทีละหนึ่งแนวทางครับ`,
      cta: "พิมพ์แนวทางที่คุณจะเริ่ม พร้อมเหตุผลสั้น ๆ",
      ...common,
    };
  }

  if (stage === "behind-scenes") {
    return {
      stage: "เปิดเผยเบื้องหลังการทำคอนเทนต์",
      title: `เบื้องหลังหนึ่งโพสต์เรื่อง ${subject}`,
      objective:
        "แสดงกระบวนการคิด ตรวจข้อมูล และจัดเนื้อหา เพื่อเพิ่มความโปร่งใสและความน่าเชื่อถือ",
      marketingPrinciple: {
        title: "กระบวนการที่มองเห็นได้ช่วยสร้างความเชื่อใจ",
        explanation:
          "ผู้ชมเข้าใจคุณภาพของงานได้ดีขึ้น เมื่อเห็นว่าข้อมูลถูกเลือก ตรวจ และเรียบเรียงอย่างไร",
      },
      topic: `ขั้นตอนเตรียมคอนเทนต์เรื่อง ${subject}`,
      hook: `หนึ่งโพสต์ของเพจนี้ ต้องเตรียมอะไรบ้างก่อนเผยแพร่?`,
      script:
        `เบื้องหลังคอนเทนต์เรื่อง ${subject} เริ่มจากเลือกปัญหาจริงของผู้ชม ตรวจข้อมูลที่ใช้ ออกแบบคำอธิบายให้ตรงกับจุดเด่น ${firstHighlight} แล้วตรวจอีกครั้งว่าไม่มีคำกล่าวอ้างเกินจริง ขั้นตอนเหล่านี้ช่วยให้เนื้อหาอ่านง่ายและนำไปใช้ได้มากขึ้นครับ`,
      shotList: [
        "ถ่ายรายการหัวข้อหรือโน้ตที่ใช้เตรียมงาน",
        "แสดงขั้นตอนตรวจข้อมูล",
        "แสดงการเรียง Hook เนื้อหา และ CTA",
        "ตรวจคำกล่าวอ้างและความอ่านง่าย",
        "ปิดด้วยภาพโพสต์ที่พร้อมเผยแพร่",
      ],
      onScreenTexts: [
        "เลือกปัญหาจริง",
        "ตรวจข้อมูล",
        "เรียงให้อ่านง่าย",
        "ไม่กล่าวอ้างเกินจริง",
      ],
      caption:
        `เบื้องหลังหนึ่งโพสต์เรื่อง ${subject}\n\nเลือกปัญหา → ตรวจข้อมูล → เรียงเนื้อหา → ตรวจคำกล่าวอ้าง → เผยแพร่\n\nกระบวนการที่ชัดช่วยให้คอนเทนต์น่าเชื่อถือและนำไปใช้ได้จริงมากขึ้นครับ`,
      cta: "อยากเห็นเบื้องหลังขั้นตอนไหนเพิ่มเติม พิมพ์ไว้ได้เลย",
      ...common,
    };
  }

  const promotionText = request.promotionDetails
    ? request.promotionDetails
    : "ติดตามเพจไว้เพื่อดูหัวข้อและตัวอย่างต่อไป";

  return {
    stage: "สรุปและพาไปขั้นต่อไป",
    title: "สรุป 7 วัน และเลือกหัวข้อที่ควรทำต่อ",
    objective:
      "ทบทวนสิ่งที่ผู้ชมได้เรียนรู้ และให้คำชวนที่ตรงกับเป้าหมายของเพจ",
    marketingPrinciple: {
      title: "สรุปคุณค่าก่อนขอให้ผู้ชมทำต่อ",
      explanation:
        "เมื่อผู้ชมเห็นภาพรวมและรู้ว่าตนเองได้อะไร คำชวนที่ชัดเจนจะช่วยให้ตัดสินใจติดตาม บันทึก หรือสอบถามได้ง่ายขึ้น",
    },
    topic: `สรุปสิ่งสำคัญเกี่ยวกับ ${subject}`,
    hook: `ก่อนจบสัปดาห์ ลองทบทวน 4 เรื่องนี้เกี่ยวกับ ${subject}`,
    script:
      `สัปดาห์นี้เราเริ่มจากปัญหา ${concern} ได้เรียนรู้เรื่อง ${firstHighlight} และ ${secondHighlight} จากนี้ให้เลือกหนึ่งเรื่องที่คุณจะนำไปทดลองจริง แล้วจดผลลัพธ์ไว้ ${promotionText}`,
    shotList: [
      "ทำหน้าปกสรุป 4 เรื่อง",
      `ทบทวนปัญหา: ${concern}`,
      `ทบทวนแนวทาง: ${firstHighlight}`,
      `ทบทวนแนวทาง: ${secondHighlight}`,
      "ปิดด้วยคำชวนที่ตรงกับเป้าหมายของเพจ",
    ],
    onScreenTexts: [
      "สรุป 7 วัน",
      concern,
      firstHighlight,
      "เลือกหนึ่งเรื่องแล้วลงมือทำ",
    ],
    caption:
      `สรุปสิ่งสำคัญเรื่อง ${subject}\n\n1. ปัญหาที่ต้องการแก้: ${concern}\n2. แนวทางแรก: ${firstHighlight}\n3. แนวทางต่อไป: ${secondHighlight}\n4. เลือกหนึ่งเรื่องไปทดลองและจดผล\n\n${promotionText}`,
    cta: action,
    ...common,
  };
}

function createStageContent(
  stage: CampaignStage,
  request: ResolvedRequest
): StageContent {
  const product =
    request.productOrService;

  const audience =
    request.audience;

  const audienceShort =
    shortAudience(audience);

  const firstHighlight =
    request.productHighlights[0];

  const secondHighlight =
    request.productHighlights[1] ||
    "ความเหมาะสมกับการใช้งานจริง";

  const concern =
    request.customerConcerns[0];

  const action = getPrimaryAction(request);

  const common = {
    afterPosting: getAfterPosting(
      request.goal,
      stage
    ),
    replyExamples: getReplyExamples(request),
    metrics: getMetrics(request.goal),
  };

  if (stage === "problem") {
    return {
      stage: "ทำให้ผู้ชมรู้สึกเกี่ยวข้อง",
      title: `ปัญหาอะไรทำให้คนมองหา ${product}?`,
      objective:
        "ทำให้ผู้ชมรู้สึกว่าเนื้อหาเกี่ยวข้องกับสิ่งที่ตนเองกำลังเจอ",

      marketingPrinciple: {
        title: "เริ่มจากปัญหาที่ผู้ชมคุ้นเคย",
        explanation:
          "ผู้ชมมีแนวโน้มหยุดอ่านหรือดูต่อ เมื่อเนื้อหาพูดถึงสถานการณ์ที่ใกล้ตัวและตอบได้ง่าย",
      },

      topic: `ปัญหาที่ ${audienceShort} มักเจอก่อนเลือก ${product}`,

      hook: `ก่อนเลือก ${product} ปัญหาที่คุณอยากแก้จริง ๆ คืออะไร?`,

      script:
        `หลายคนที่เป็น ${audience} อาจกำลังเจอปัญหาคล้ายกัน คือ ${concern} วันนี้จึงอยากถามว่า เวลาคุณเลือก ${product} สิ่งที่กังวลมากที่สุดคืออะไร ลองพิมพ์ความคิดเห็นไว้ได้ เพราะคำตอบของคุณจะช่วยให้เนื้อหาต่อไปตรงกับสิ่งที่คนอยากรู้จริง ๆ`,

      shotList: [
        `แสดงสถานการณ์หรือปัญหาที่เกี่ยวข้องกับ ${product}`,
        "ขึ้นคำถามหลักตั้งแต่ช่วงแรก",
        "แสดงตัวเลือกคำตอบสั้น ๆ หากเหมาะสม",
        "ปิดด้วยการชวนให้แสดงความคิดเห็น",
      ],

      onScreenTexts: [
        `ปัญหาอะไรทำให้คุณมองหา ${product}?`,
        concern,
        "พิมพ์ความคิดเห็นไว้ได้เลย",
      ],

      caption:
        `ก่อนเลือก ${product} คุณกังวลเรื่องอะไรมากที่สุด?\n\nตัวอย่างเช่น ${concern}\n\nพิมพ์ความคิดเห็นหรือประสบการณ์ของคุณไว้ได้เลยครับ`,

      cta:
        "พิมพ์ปัญหาหรือข้อสงสัยที่คุณเจอไว้ใต้โพสต์",

      ...common,
    };
  }

  if (stage === "value") {
    return {
      stage: "ให้ข้อมูลที่นำไปใช้ได้",
      title: `3 เรื่องที่ควรดูก่อนเลือก ${product}`,
      objective:
        "ให้ข้อมูลที่เป็นประโยชน์ก่อนขอให้ผู้ชมติดตามหรือซื้อ",

      marketingPrinciple: {
        title: "ให้คุณค่าก่อนขอการตอบสนอง",
        explanation:
          "เมื่อผู้ชมได้รับข้อมูลที่ช่วยตัดสินใจหรือแก้ปัญหา เขาจะมีเหตุผลมากขึ้นที่จะติดตาม บันทึก หรือสอบถามต่อ",
      },

      topic: `วิธีประเมินว่า ${product} เหมาะกับการใช้งานหรือไม่`,

      hook: `ก่อนเลือก ${product} อย่าดูเพียงอย่างเดียว ลองตรวจ 3 เรื่องนี้ก่อน`,

      script:
        `ก่อนเลือก ${product} ลองตรวจสามเรื่องครับ หนึ่ง ดูว่า ${firstHighlight} ตรงกับสิ่งที่คุณต้องการหรือไม่ สอง พิจารณา ${secondHighlight} และสาม ตรวจข้อมูลหรือเงื่อนไขให้ครบ อย่าตัดสินใจจากคำโฆษณาเพียงอย่างเดียว ควรเลือกจากการใช้งานจริงของตัวเอง`,

      shotList: [
        "เปิดด้วยข้อความว่า 3 เรื่องที่ควรตรวจ",
        `แสดงหัวข้อที่ 1: ${firstHighlight}`,
        `แสดงหัวข้อที่ 2: ${secondHighlight}`,
        "แสดงหัวข้อที่ 3: ตรวจรายละเอียดให้ครบ",
        "ปิดด้วยการชวนให้บันทึกโพสต์",
      ],

      onScreenTexts: [
        "3 เรื่องที่ควรตรวจก่อนเลือก",
        firstHighlight,
        secondHighlight,
        "ตรวจรายละเอียดให้ครบ",
      ],

      caption:
        `ก่อนเลือก ${product} ลองตรวจ 3 เรื่องนี้\n\n1. ${firstHighlight}\n2. ${secondHighlight}\n3. ตรวจรายละเอียดและเงื่อนไขให้ครบ\n\nเลือกจากการใช้งานจริง จะช่วยให้ตัดสินใจได้เหมาะกับตัวเองมากขึ้นครับ`,

      cta: action,

      ...common,
    };
  }

  if (stage === "demo") {
    return {
      stage: "แสดงให้เห็นจากการใช้งาน",
      title: `ดู “${firstHighlight}” จากตัวอย่างจริง`,
      objective:
        "ลดความไม่แน่ใจด้วยการแสดงรายละเอียดหรือการใช้งานจริง",

      marketingPrinciple: {
        title: "แสดงหลักฐานแทนการกล่าวอ้าง",
        explanation:
          "สิ่งที่ผู้ชมมองเห็นและตรวจสอบได้ช่วยสร้างความเข้าใจมากกว่าการบอกเพียงว่าสินค้าหรือบริการดี",
      },

      topic: `สาธิตจุดเด่น ${firstHighlight}`,

      hook: `อย่าเพิ่งเชื่อว่า ${product} เหมาะ จนกว่าจะเห็น “${firstHighlight}” ชัด ๆ`,

      script:
        `หลายคนอาจยังไม่แน่ใจว่า ${product} ใช้งานจริงอย่างไร วันนี้จะลองแสดงจุดเด่นเรื่อง ${firstHighlight} ให้ดูทีละขั้น เพื่อให้เห็นรายละเอียดก่อนตัดสินใจ สิ่งที่เห็นควรใช้เป็นข้อมูลประกอบ และควรตรวจข้อมูลอื่นให้ครบตามความต้องการของตัวเองด้วยครับ`,

      shotList: [
        `เปิดด้วยภาพรวมของ ${product}`,
        `ซูมหรือแสดงรายละเอียดเรื่อง ${firstHighlight}`,
        "สาธิตการใช้งานทีละขั้น",
        "ถ่ายผลลัพธ์หรือสภาพหลังใช้งาน",
        "ปิดด้วยข้อมูลที่ผู้ชมควรตรวจเพิ่มเติม",
      ],

      onScreenTexts: [
        "ดูจากการใช้งานจริง",
        firstHighlight,
        "ตรวจรายละเอียดก่อนตัดสินใจ",
      ],

      caption:
        `คลิปหรือโพสต์นี้แสดงจุดเด่นเรื่อง “${firstHighlight}” จากตัวอย่างจริง เพื่อช่วยให้เห็นรายละเอียดชัดขึ้น\n\nผลลัพธ์อาจต่างกันตามลักษณะการใช้งาน ควรตรวจข้อมูลให้ครบก่อนตัดสินใจครับ`,

      cta: action,

      ...common,
    };
  }

  if (stage === "objection") {
    return {
      stage: "ตอบข้อสงสัยก่อนตัดสินใจ",
      title: `ตอบตรง ๆ: ${concern}`,
      objective:
        "ตอบข้อกังวลสำคัญด้วยข้อมูลที่ตรวจสอบได้และไม่กล่าวอ้างเกินจริง",

      marketingPrinciple: {
        title: "ลดความลังเลด้วยคำตอบที่ตรงประเด็น",
        explanation:
          "การตอบข้อสงสัยก่อนที่ผู้ชมจะต้องถามเอง ช่วยให้เขาประเมินความเหมาะสมได้ง่ายขึ้น",
      },

      topic: `คำตอบเกี่ยวกับข้อกังวลเรื่อง ${concern}`,

      hook: `คำถามที่หลายคนน่าจะอยากรู้เกี่ยวกับ ${product}: ${concern}`,

      script:
        `คำถามสำคัญเกี่ยวกับ ${product} คือ ${concern} คำตอบควรดูจากข้อมูลจริงที่มี โดยจุดที่เรายืนยันได้ตอนนี้คือ ${firstHighlight} ส่วนข้อมูลที่ยังไม่มีผลตรวจสอบ ไม่ควรรับรองหรือให้ตัวเลขเกินจริง แนะนำให้เปรียบเทียบกับความต้องการของตัวเองก่อนครับ`,

      shotList: [
        "ขึ้นคำถามหลักให้เห็นชัด",
        `แสดงข้อมูลที่ยืนยันได้: ${firstHighlight}`,
        "แยกสิ่งที่ยืนยันได้กับสิ่งที่ยังต้องตรวจสอบ",
        "ปิดด้วยคำแนะนำให้ดูรายละเอียดครบ",
      ],

      onScreenTexts: [
        "ตอบคำถามตรง ๆ",
        concern,
        "ยืนยันเฉพาะข้อมูลที่ตรวจสอบได้",
      ],

      caption:
        `คำถาม: ${concern}\n\nข้อมูลที่ยืนยันได้ตอนนี้คือ ${firstHighlight}\n\nส่วนข้อมูลที่ยังไม่มีการตรวจสอบ ไม่ควรกล่าวอ้างเกินจริง แนะนำให้ตรวจรายละเอียดทั้งหมดก่อนตัดสินใจครับ`,

      cta:
        "มีข้อสงสัยเพิ่มเติม พิมพ์ถามโดยระบุลักษณะการใช้งานของคุณได้เลย",

      ...common,
    };
  }

  if (stage === "trust") {
    return {
      stage: "สร้างความน่าเชื่อถือ",
      title: `${product} เหมาะกับใคร และอาจไม่เหมาะกับใคร?`,
      objective:
        "สร้างความไว้วางใจด้วยการบอกทั้งจุดที่เหมาะและข้อจำกัด",

      marketingPrinciple: {
        title: "ความโปร่งใสช่วยเพิ่มความไว้วางใจ",
        explanation:
          "การไม่พยายามขายให้ทุกคน ทำให้ผู้ชมรู้สึกว่าได้รับข้อมูลเพื่อประกอบการตัดสินใจจริง",
      },

      topic: `กลุ่มที่เหมาะกับ ${product} และข้อจำกัดที่ควรรู้`,

      hook: `${product} อาจไม่ได้เหมาะกับทุกคน ลองดูก่อนว่าคุณอยู่ในกลุ่มไหน`,

      script:
        `${product} เหมาะกับ ${audience} โดยเฉพาะคนที่ต้องการ ${firstHighlight} แต่ถ้าคุณไม่ได้ต้องการจุดนี้ หรือรูปแบบการใช้งานต่างออกไป สิ่งนี้อาจไม่ใช่ตัวเลือกที่เหมาะที่สุด ควรเลือกจากความต้องการจริง ไม่ใช่เลือกเพราะคำโฆษณาเพียงอย่างเดียวครับ`,

      shotList: [
        `แสดง ${product} หรือภาพรวมของบริการ`,
        "แบ่งหัวข้อว่าเหมาะกับใคร",
        "แบ่งหัวข้อว่าอาจไม่เหมาะกับใคร",
        "สรุปว่าควรเลือกจากการใช้งานจริง",
      ],

      onScreenTexts: [
        "เหมาะกับใคร?",
        "อาจไม่เหมาะกับใคร?",
        "เลือกจากความต้องการจริง",
      ],

      caption:
        `${product} เหมาะกับ ${audience} โดยเฉพาะผู้ที่ต้องการ ${firstHighlight}\n\nแต่อาจไม่เหมาะกับคนที่ไม่ได้ต้องการจุดนี้ หรือมีรูปแบบการใช้งานต่างออกไป\n\nลองประเมินจากสิ่งที่คุณต้องใช้จริงก่อนตัดสินใจครับ`,

      cta: action,

      ...common,
    };
  }

  if (stage === "story") {
    return {
      stage: "เชื่อมโยงกับชีวิตจริง",
      title: `หนึ่งสถานการณ์จริงกับ ${product}`,
      objective:
        "ช่วยให้ผู้ชมจินตนาการว่าตนเองจะนำสินค้า บริการ หรือข้อมูลไปใช้ได้อย่างไร",

      marketingPrinciple: {
        title: "สถานการณ์จริงช่วยให้เห็นภาพ",
        explanation:
          "ผู้ชมเข้าใจประโยชน์ได้ง่ายขึ้น เมื่อเห็นบริบทและลำดับการใช้งานจริง",
      },

      topic: `การใช้ ${product} ในหนึ่งสถานการณ์ที่ใกล้ตัว`,

      hook: `${product} จะช่วยในชีวิตจริงได้อย่างไร ลองดูหนึ่งสถานการณ์นี้ครับ`,

      script:
        `สมมุติว่าคุณเป็น ${audienceShort} และกำลังเจอปัญหาเรื่อง ${concern} ขั้นแรกคือดูว่าคุณต้องการอะไรจริง จากนั้นใช้จุดเด่นเรื่อง ${firstHighlight} มาช่วยประกอบการตัดสินใจ เนื้อหานี้ไม่ได้บอกว่าสิ่งเดียวเหมาะกับทุกคน แต่ต้องการให้เห็นวิธีนำข้อมูลไปเทียบกับชีวิตจริงครับ`,

      shotList: [
        "เปิดด้วยสถานการณ์ก่อนเริ่มใช้งาน",
        `แสดงปัญหาเรื่อง ${concern}`,
        `แสดงการใช้จุดเด่น ${firstHighlight}`,
        "แสดงผลหลังจบสถานการณ์",
        "ปิดด้วยคำถามว่าผู้ชมจะใช้ในสถานการณ์ใด",
      ],

      onScreenTexts: [
        "หนึ่งสถานการณ์จริง",
        concern,
        firstHighlight,
        "เหมาะกับการใช้งานของคุณไหม?",
      ],

      caption:
        `ลองนำ ${product} มาอยู่ในสถานการณ์จริง จะช่วยให้เห็นง่ายขึ้นว่าเหมาะกับรูปแบบการใช้งานของคุณหรือไม่\n\nคุณคิดว่าจะนำไปใช้ในสถานการณ์แบบไหน พิมพ์บอกกันได้ครับ`,

      cta:
        "พิมพ์สถานการณ์ที่คุณอยากนำไปใช้ไว้ใต้โพสต์",

      ...common,
    };
  }

  if (stage === "community") {
    return {
      stage: "ชวนผู้ชมมีส่วนร่วม",
      title: `เวลาเลือก ${product} คุณให้ความสำคัญกับอะไรที่สุด?`,
      objective:
        "เพิ่มความคิดเห็นและเรียนรู้ว่าสิ่งใดสำคัญกับกลุ่มลูกค้าจริง",

      marketingPrinciple: {
        title: "คำถามที่ตอบง่ายช่วยเริ่มการสนทนา",
        explanation:
          "ตัวเลือกที่ชัดเจนช่วยลดความยากในการตอบ และเปิดโอกาสให้ผู้ชมเล่าประสบการณ์เพิ่มเติม",
      },

      topic: `สำรวจสิ่งที่ ${audienceShort} ให้ความสำคัญ`,

      hook: `เลือกได้เพียงข้อเดียว คุณให้ความสำคัญกับอะไรที่สุดเวลาเลือก ${product}?`,

      script:
        `ถ้าเลือกได้เพียงข้อเดียว เวลาเลือก ${product} คุณให้ความสำคัญกับอะไรที่สุด ระหว่างหนึ่ง ${firstHighlight} สอง ${secondHighlight} หรือสาม ความเหมาะสมกับราคา พิมพ์เลขหรือเหตุผลของคุณไว้ได้ คำตอบจะช่วยให้เราทำเนื้อหาต่อไปตรงกับสิ่งที่คนสนใจจริงมากขึ้น`,

      shotList: [
        "ทำหน้าปกเป็นคำถามสั้น ๆ",
        `ตัวเลือก A: ${firstHighlight}`,
        `ตัวเลือก B: ${secondHighlight}`,
        "ตัวเลือก C: ความเหมาะสมกับราคา",
        "ปิดด้วยการชวนให้พิมพ์เหตุผล",
      ],

      onScreenTexts: [
        "คุณเลือกข้อไหน?",
        `A. ${firstHighlight}`,
        `B. ${secondHighlight}`,
        "C. ความเหมาะสมกับราคา",
      ],

      caption:
        `เวลาเลือก ${product} คุณให้ความสำคัญกับอะไรที่สุด?\n\nA. ${firstHighlight}\nB. ${secondHighlight}\nC. ความเหมาะสมกับราคา\n\nพิมพ์ A, B หรือ C พร้อมเหตุผลได้เลยครับ`,

      cta:
        "พิมพ์ตัวเลือกและเหตุผลของคุณไว้ใต้โพสต์",

      ...common,
    };
  }

  if (stage === "comparison") {
    return {
      stage: "ช่วยให้ผู้ชมเปรียบเทียบ",
      title: `${firstHighlight} กับ ${secondHighlight} อะไรสำคัญกว่ากัน?`,
      objective:
        "ช่วยให้ผู้ชมแยกเกณฑ์การเลือกและมีส่วนร่วมกับเนื้อหา",

      marketingPrinciple: {
        title: "การเปรียบเทียบช่วยลดความซับซ้อน",
        explanation:
          "เมื่อแบ่งทางเลือกออกเป็นประเด็น ผู้ชมจะประเมินสิ่งที่เหมาะกับตนเองได้ง่ายขึ้น",
      },

      topic: `เปรียบเทียบเกณฑ์เลือก ${product}`,

      hook: `ถ้าต้องเลือกอย่างเดียว ระหว่าง ${firstHighlight} กับ ${secondHighlight} คุณเลือกอะไร?`,

      script:
        `เวลาเลือก ${product} บางคนให้ความสำคัญกับ ${firstHighlight} ขณะที่อีกกลุ่มมองว่า ${secondHighlight} สำคัญกว่า ไม่มีคำตอบเดียวสำหรับทุกคน เพราะต้องดูจากวิธีใช้งานจริงของแต่ละคน ลองพิมพ์ว่าคุณให้ความสำคัญกับข้อไหนและเพราะอะไรครับ`,

      shotList: [
        "แบ่งภาพหรือหน้าจอเป็นสองฝั่ง",
        `ฝั่งแรก: ${firstHighlight}`,
        `ฝั่งที่สอง: ${secondHighlight}`,
        "ใส่ตัวอย่างสั้น ๆ ของแต่ละฝั่ง",
        "ปิดด้วยคำถามให้ผู้ชมเลือก",
      ],

      onScreenTexts: [
        "คุณเลือกอะไร?",
        firstHighlight,
        secondHighlight,
      ],

      caption:
        `ระหว่าง “${firstHighlight}” กับ “${secondHighlight}” คุณให้ความสำคัญกับอะไรเวลาเลือก ${product}?\n\nพิมพ์คำตอบและเหตุผลไว้ได้เลยครับ`,

      cta:
        "เลือกหนึ่งข้อแล้วพิมพ์เหตุผลของคุณไว้ใต้โพสต์",

      ...common,
    };
  }

  if (stage === "behind-scenes") {
    return {
      stage: "เปิดเผยเบื้องหลัง",
      title: `เบื้องหลังการเตรียม ${product} ให้พร้อม`,
      objective:
        "แสดงกระบวนการและความใส่ใจ เพื่อเพิ่มความโปร่งใสและความน่าเชื่อถือ",

      marketingPrinciple: {
        title: "กระบวนการที่มองเห็นได้ช่วยสร้างความมั่นใจ",
        explanation:
          "ผู้ชมเข้าใจและเชื่อมั่นได้ง่ายขึ้น เมื่อเห็นว่ามีการตรวจ เตรียม หรือทำงานอย่างไรจริง",
      },

      topic: `ขั้นตอนเบื้องหลังของ ${product}`,

      hook: `ก่อนที่คุณจะเห็น ${product} พร้อมใช้งาน เบื้องหลังต้องเตรียมอะไรบ้าง?`,

      script:
        `วันนี้จะพาดูเบื้องหลังการเตรียม ${product} ตั้งแต่ตรวจข้อมูล จุดเด่นเรื่อง ${firstHighlight} ไปจนถึงการตรวจสิ่งที่ไม่ควรกล่าวอ้างเกินจริง จุดประสงค์คือทำให้ผู้ชมเห็นว่าข้อมูลที่นำเสนอควรมาจากสิ่งที่ตรวจสอบได้ ไม่ใช่เพียงคำโฆษณาครับ`,

      shotList: [
        "ถ่ายพื้นที่หรือเครื่องมือที่ใช้ทำงาน",
        "แสดงขั้นตอนเตรียมหรือตรวจข้อมูล",
        `แสดงจุดที่เกี่ยวกับ ${firstHighlight}`,
        "แสดงขั้นตอนตรวจความเรียบร้อย",
        "ปิดด้วยผลลัพธ์ที่พร้อมนำเสนอ",
      ],

      onScreenTexts: [
        "เบื้องหลังการเตรียมงาน",
        "ตรวจข้อมูลก่อนนำเสนอ",
        "ยืนยันเฉพาะสิ่งที่ตรวจสอบได้",
      ],

      caption:
        `เบื้องหลังของ ${product} ไม่ได้มีเพียงภาพสุดท้าย แต่มีทั้งการเตรียม ตรวจข้อมูล และตรวจความเหมาะสม\n\nการเปิดเผยกระบวนการช่วยให้ผู้ชมเข้าใจสิ่งที่ได้รับชัดขึ้นครับ`,

      cta:
        "มีขั้นตอนไหนที่อยากเห็นเพิ่มเติม พิมพ์บอกไว้ได้เลย",

      ...common,
    };
  }

  const promotionText =
    request.promotionDetails
      ? `รายละเอียดเพิ่มเติม: ${request.promotionDetails}`
      : "ตรวจรายละเอียดทั้งหมดให้ครบก่อนตัดสินใจ";

  return {
    stage: "สรุปและพาไปขั้นต่อไป",
    title:
      request.goal === "grow"
        ? "สรุปสิ่งที่ได้เรียนรู้ และเลือกหัวข้อถัดไป"
        : `สรุปข้อมูลสำคัญก่อนเลือก ${product}`,

    objective:
      "รวบรวมข้อมูลสำคัญจากทั้งสัปดาห์ และให้คำชวนที่ตรงกับเป้าหมาย",

    marketingPrinciple: {
      title: "สรุปข้อมูลก่อนขอให้ผู้ชมตัดสินใจ",
      explanation:
        "เมื่อผู้ชมได้รับข้อมูลครบและเห็นเหตุผลแล้ว คำชวนที่ชัดเจนจะช่วยให้รู้ว่าควรทำอะไรต่อ",
    },

    topic: `สรุปข้อมูลสำคัญเกี่ยวกับ ${product}`,

    hook: `ก่อนตัดสินใจเรื่อง ${product} ลองทบทวน 4 เรื่องนี้ก่อน`,

    script:
      `ก่อนตัดสินใจเรื่อง ${product} ลองทบทวนสี่เรื่องครับ หนึ่ง คุณต้องการแก้ปัญหาอะไร สอง จุดเด่นเรื่อง ${firstHighlight} ตรงกับความต้องการหรือไม่ สาม คุณยังมีข้อสงสัยเรื่อง ${concern} หรือไม่ และสี่ คุณได้ตรวจรายละเอียดทั้งหมดแล้วหรือยัง ${promotionText}`,

    shotList: [
      "ทำหน้าปกเป็นสรุป 4 เรื่อง",
      "ทบทวนปัญหาที่ผู้ชมต้องการแก้",
      `ทบทวนจุดเด่น ${firstHighlight}`,
      `ทบทวนข้อสงสัย ${concern}`,
      "ปิดด้วยคำชวนที่ตรงกับเป้าหมาย",
    ],

    onScreenTexts: [
      "สรุปก่อนตัดสินใจ",
      firstHighlight,
      concern,
      "ตรวจรายละเอียดให้ครบ",
    ],

    caption:
      `สรุปก่อนตัดสินใจเรื่อง ${product}\n\n1. ต้องการแก้ปัญหาอะไร\n2. ${firstHighlight} ตรงกับความต้องการหรือไม่\n3. ยังมีข้อสงสัยเรื่อง ${concern} หรือไม่\n4. ตรวจรายละเอียดให้ครบ\n\n${promotionText}`,

    cta: action,

    ...common,
  };
}

function adaptTextToPlanType(
  text: string,
  request: ResolvedRequest
) {
  if (request.planType === "product") {
    return text;
  }

  if (request.planType === "service") {
    return text
      .replaceAll("สินค้า บริการ หรือข้อมูล", "บริการหรือข้อมูล")
      .replaceAll("สินค้า บริการ หรือหัวข้อ", "บริการ")
      .replaceAll("สินค้าหรือบริการ", "บริการ")
      .replaceAll("จุดเด่นสินค้า", "จุดเด่นบริการ")
      .replaceAll("ความคิดเห็นเกี่ยวกับสินค้า", "ความคิดเห็นเกี่ยวกับบริการ")
      .replaceAll("ตอบคำถามเรื่องสินค้า", "ตอบคำถามเรื่องบริการ")
      .replaceAll("เตรียมถ่ายเฉพาะสินค้า มือ หรือภาพประกอบ", "เตรียมถ่ายเฉพาะสถานที่ ขั้นตอน ผลงาน หรือภาพประกอบ")
      .replaceAll("เตรียมถ่ายเฉพาะสินค้า", "เตรียมถ่ายเฉพาะสถานที่ ขั้นตอน หรือผลงาน")
      .replaceAll("พร้อมใช้งาน", "พร้อมให้บริการ")
      .replaceAll("ใช้งานจริงอย่างไร", "รับบริการจริงอย่างไร")
      .replaceAll("ผลหลังใช้งาน", "ผลหลังรับบริการ")
      .replaceAll("การใช้งานจริง", "การรับบริการจริง")
      .replaceAll("รูปแบบการใช้งาน", "รูปแบบบริการที่ต้องการ")
      .replaceAll("ลักษณะการใช้งาน", "รายละเอียดความต้องการ")
      .replaceAll("สาธิตการใช้งาน", "แสดงขั้นตอนบริการ")
      .replaceAll("ใช้งาน", "ใช้บริการ")
      .replaceAll("เลือกซื้อ", "เลือกใช้บริการ")
      .replaceAll("สินค้า", "บริการ");
  }

  const subject = request.productOrService;

  return text
    .replaceAll(`ก่อนเลือก ${subject}`, `ก่อนติดตามคอนเทนต์เรื่อง ${subject}`)
    .replaceAll(`เวลาคุณเลือก ${subject}`, `เวลาคุณติดตามคอนเทนต์เรื่อง ${subject}`)
    .replaceAll(`เวลาเลือก ${subject}`, `เวลาติดตามคอนเทนต์เรื่อง ${subject}`)
    .replaceAll(`การเลือก ${subject}`, `การเลือกติดตามคอนเทนต์เรื่อง ${subject}`)
    .replaceAll(`มองหา ${subject}`, `สนใจเรื่อง ${subject}`)
    .replaceAll(`${subject} ใช้งานจริงอย่างไร`, `เนื้อหาเรื่อง ${subject} นำไปใช้จริงอย่างไร`)
    .replaceAll(`การใช้ ${subject}`, `การนำเนื้อหาเรื่อง ${subject} ไปใช้`)
    .replaceAll(`นำ ${subject} มาอยู่`, `นำแนวทางเรื่อง ${subject} มาใช้`)
    .replaceAll(`${subject} เหมาะกับ`, `คอนเทนต์เรื่อง ${subject} เหมาะกับ`)
    .replaceAll("สินค้า บริการ หรือข้อมูล", "เนื้อหา แนวทาง หรือข้อมูล")
    .replaceAll("สินค้า บริการ หรือหัวข้อ", "หัวข้อคอนเทนต์")
    .replaceAll("สินค้าหรือบริการ", "เนื้อหาหรือแนวทาง")
    .replaceAll("จุดเด่นสินค้า", "จุดเด่นหรือประสบการณ์ของเพจ")
    .replaceAll("รายการจุดเด่น", "รายการจุดเด่นหรือประสบการณ์")
    .replaceAll("กลุ่มลูกค้า", "กลุ่มผู้ชม")
    .replaceAll("ลูกค้า", "ผู้ชม")
    .replaceAll("ความคิดเห็นเกี่ยวกับสินค้า", "ความคิดเห็นเกี่ยวกับเนื้อหา")
    .replaceAll("ตอบคำถามเรื่องสินค้า", "ตอบคำถามเรื่องเนื้อหา")
    .replaceAll("เตรียมถ่ายเฉพาะสินค้า มือ", "เตรียมถ่ายเฉพาะสิ่งของ หน้าจอ มือ")
    .replaceAll("พร้อมใช้งาน", "พร้อมเผยแพร่")
    .replaceAll("ใช้งานจริงอย่างไร", "นำไปใช้จริงอย่างไร")
    .replaceAll("ผลหลังใช้งาน", "ผลหลังนำไปใช้")
    .replaceAll("การใช้งานจริง", "การนำไปใช้จริง")
    .replaceAll("รูปแบบการใช้งาน", "รูปแบบที่ผู้ชมต้องการ")
    .replaceAll("ลักษณะการใช้งาน", "เป้าหมายหรือปัญหาของผู้ชม")
    .replaceAll("สาธิตการใช้งาน", "ยกตัวอย่างหรือสาธิต")
    .replaceAll("คำโฆษณา", "คำกล่าวอ้างเกินจริง")
    .replaceAll("ก่อนตัดสินใจ", "ก่อนเลือกติดตามหรือนำไปใช้")
    .replaceAll("ตัดสินใจ", "เลือกติดตามหรือนำไปใช้")
    .replaceAll("สิ่งที่คุณต้องใช้จริง", "สิ่งที่คุณอยากเรียนรู้หรือทำจริง")
    .replaceAll("ใช้งาน", "นำไปใช้")
    .replaceAll("สินค้า", "เนื้อหา");
}

function adaptListToPlanType(
  items: string[],
  request: ResolvedRequest
) {
  return items.map((item) =>
    adaptTextToPlanType(item, request)
  );
}

function adaptStageContentToPlanType(
  content: StageContent,
  request: ResolvedRequest
): StageContent {
  return {
    ...content,
    stage: adaptTextToPlanType(content.stage, request),
    title: adaptTextToPlanType(content.title, request),
    objective: adaptTextToPlanType(content.objective, request),
    marketingPrinciple: {
      title: adaptTextToPlanType(
        content.marketingPrinciple.title,
        request
      ),
      explanation: adaptTextToPlanType(
        content.marketingPrinciple.explanation,
        request
      ),
    },
    topic: adaptTextToPlanType(content.topic, request),
    hook: adaptTextToPlanType(content.hook, request),
    script: adaptTextToPlanType(content.script, request),
    shotList: adaptListToPlanType(content.shotList, request),
    onScreenTexts: adaptListToPlanType(
      content.onScreenTexts,
      request
    ),
    caption: adaptTextToPlanType(content.caption, request),
    cta: adaptTextToPlanType(content.cta, request),
    afterPosting: adaptListToPlanType(
      content.afterPosting,
      request
    ),
    replyExamples: adaptListToPlanType(
      content.replyExamples,
      request
    ),
    metrics: adaptListToPlanType(content.metrics, request),
  };
}

function adaptFallbackToPlanType(
  fallback: WeeklyContentDay["fallback"],
  request: ResolvedRequest
): WeeklyContentDay["fallback"] {
  return {
    ...fallback,
    title: adaptTextToPlanType(fallback.title, request),
    instructions: adaptListToPlanType(
      fallback.instructions,
      request
    ),
    caption: fallback.caption
      ? adaptTextToPlanType(fallback.caption, request)
      : undefined,
  };
}

function createDay(
  dayNumber: number,
  stage: CampaignStage,
  request: ResolvedRequest
): WeeklyContentDay {
  const dayIndex = dayNumber - 1;

  const format = getFormatForDay(
    request,
    dayIndex
  );

  const rawContent =
    request.planType === "creator"
      ? createCreatorStageContent(stage, request)
      : createStageContent(stage, request);

  const content =
    request.planType === "service"
      ? adaptStageContentToPlanType(
          rawContent,
          request
        )
      : rawContent;

  return {
    day: dayNumber,

    ...content,

    format,

    publishTime: getPublishTime(
      request.platform,
      dayIndex
    ),

    estimatedMinutes: getEstimatedMinutes(
      request.intensity,
      format
    ),

    hashtags: adaptListToPlanType(
      buildHashtags(request, stage),
      request
    ),

    preparation: adaptListToPlanType(
      buildPreparation(request, format),
      request
    ),

    fallback: adaptFallbackToPlanType(
      buildFallback(
        request,
        format,
        content.title,
        content.caption
      ),
      request
    ),

    status: "not-started",
  };
}

export function generateWeeklyContentPlan(
  request: PlanRequest
): WeeklyContentPlan {
  const resolved = resolveRequest(request);

  const stages =
    STAGE_SEQUENCES[resolved.goal];

  const timestamp =
    new Date(resolved.createdAt).getTime();

  const stableTimestamp =
    Number.isFinite(timestamp)
      ? timestamp
      : Date.now();

  return {
    id: `weekly-plan-${stableTimestamp}`,

    title:
      `แผนคอนเทนต์ ${PLATFORM_LABELS[resolved.platform]} 7 วัน ` +
      `สำหรับ “${resolved.productOrService}”`,

    planType: resolved.planType,

    productOrService:
      resolved.productOrService,

    productHighlights:
      resolved.productHighlights,

    audience:
      resolved.audience,

    platform:
      resolved.platform,

    goal:
      resolved.goal,

    intensity:
      resolved.intensity,

    weeklyObjective:
      adaptTextToPlanType(
        getWeeklyObjective(resolved),
        resolved
      ),

    strategyExplanation:
      adaptTextToPlanType(
        getStrategyExplanation(resolved),
        resolved
      ),

    platformGuidance:
      getPlatformGuidance(resolved.platform),

    createdAt:
      resolved.createdAt,

    days: stages.map((stage, index) =>
      createDay(index + 1, stage, resolved)
    ),
  };
}