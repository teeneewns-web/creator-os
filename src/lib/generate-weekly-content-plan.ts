import type {
  ContentCapability,
  DailyTime,
  PlanRequest,
} from "../types/plan-request";

import type {
  ContentFormat,
  ContentGoal,
  ContentPlatform,
  PlanIntensity,
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
  const productHighlights =
    splitUserLines(request.productHighlights);

  const customerConcerns =
    splitUserLines(request.customerConcerns);

  const prohibitedClaims =
    splitUserLines(request.prohibitedClaims);

  return {
    productOrService:
      request.productOrService.trim() ||
      "สินค้า บริการ หรือหัวข้อของคุณ",

    productHighlights:
      productHighlights.length > 0
        ? productHighlights
        : ["มีจุดเด่นที่เหมาะกับการใช้งานของกลุ่มลูกค้า"],

    audience:
      request.audience.trim() ||
      "กลุ่มลูกค้าที่สนใจเรื่องนี้",

    customerConcerns:
      customerConcerns.length > 0
        ? customerConcerns
        : [
            "ยังไม่แน่ใจว่าสิ่งนี้เหมาะกับความต้องการของตัวเองหรือไม่",
          ],

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
  goal: ContentGoal,
  productOrService: string
) {
  if (goal === "sell") {
    return `ดูรายละเอียดของ ${productOrService} ให้ครบก่อนตัดสินใจ`;
  }

  if (goal === "grow") {
    return "ติดตามไว้เพื่อดูหัวข้อและตัวอย่างต่อไป";
  }

  if (goal === "engagement") {
    return "พิมพ์ความคิดเห็นหรือประสบการณ์ของคุณไว้ใต้โพสต์";
  }

  if (goal === "trust") {
    return "บันทึกโพสต์นี้ไว้ และถามข้อมูลเพิ่มเติมในจุดที่ยังไม่แน่ใจ";
  }

  return `ดูรายละเอียดของ ${productOrService} หรือสอบถามข้อมูลเพิ่มเติม`;
}

function getWeeklyObjective(
  request: ResolvedRequest
) {
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
  const goalLabel =
    GOAL_LABELS[request.goal];

  const platformLabel =
    PLATFORM_LABELS[request.platform];

  return [
    `แผนนี้ออกแบบสำหรับ ${platformLabel} โดยมีเป้าหมายหลักคือ ${goalLabel}`,
    `ระบบเรียงเนื้อหาจากการทำให้ผู้ชมรู้สึกเกี่ยวข้อง ให้ข้อมูล แสดงตัวอย่าง ตอบข้อสงสัย และพาไปสู่การกระทำที่เหมาะสม`,
    `จำนวนและรูปแบบงานถูกปรับเป็นระดับ ${request.intensity} ตามเวลาที่ผู้ใช้เลือก`,
    `เวลาที่แนะนำเป็นช่วงเริ่มต้นสำหรับทดลอง ควรปรับตามข้อมูลผู้ชมจริงเมื่อมีผลการใช้งาน`,
  ].join(" ");
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

  const action = getPrimaryAction(
    request.goal,
    product
  );

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

  const content = createStageContent(
    stage,
    request
  );

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

    hashtags: buildHashtags(
      request,
      stage
    ),

    preparation: buildPreparation(
      request,
      format
    ),

    fallback: buildFallback(
      request,
      format,
      content.title,
      content.caption
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
      `สำหรับ ${resolved.productOrService}`,

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
      getWeeklyObjective(resolved),

    strategyExplanation:
      getStrategyExplanation(resolved),

    createdAt:
      resolved.createdAt,

    days: stages.map((stage, index) =>
      createDay(index + 1, stage, resolved)
    ),
  };
}