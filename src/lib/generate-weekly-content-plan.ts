import type {
  AudienceStage,
  AudienceValue,
  ContentCapability,
  ContentDirection,
  ContentTone,
  DailyTime,
  DesiredAction,
  PlanRequest,
  PlanType,
  SupportNeed,
} from "../types/plan-request";
import {
  AUDIENCE_STAGE_LABELS,
  AUDIENCE_VALUE_LABELS,
  DESIRED_ACTION_LABELS,
  SUPPORT_NEED_LABELS,
  TONE_LABELS,
} from "../data/plan-intent-options";

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
  contentDirection: ContentDirection;
  productOrService: string;
  productHighlights: string[];
  audience: string;
  customerConcerns: string[];
  creatorChallenge: string;

  audienceStage: AudienceStage;
  audienceValue: AudienceValue;
  desiredAction: DesiredAction;
  supportNeeds: SupportNeed[];
  tone: ContentTone;
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

export type WeeklyPlanGenerationOptions = {
  round?: number;
  variationIndex?: number;
};

type ContentAngle = {
  id: string;
  titlePrefix: string;
  hookPrefix: string;
  scriptLead: string;
  captionHeading: string;
  shotDirection: string;
  onScreenText: string;
};

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

const CONTENT_DIRECTION_LABELS: Record<
  ContentDirection,
  string
> = {
  "product-demo": "สาธิตและใช้งานจริง",
  "product-review": "รีวิวและเปรียบเทียบ",
  "product-lifestyle": "ไลฟ์สไตล์ / UGC",
  "product-problem-solution": "แก้ปัญหาและตอบข้อสงสัย",
  "product-offer": "โปรโมชั่นและปิดการขาย",
  "product-brand-story": "เรื่องราวแบรนด์และเบื้องหลัง",
  "service-results": "ผลงานและผลลัพธ์ที่ตรวจสอบได้",
  "service-process": "ขั้นตอนและเบื้องหลังบริการ",
  "service-expert": "ให้ความรู้และสร้างความเชื่อใจ",
  "service-case-study": "รีวิวลูกค้าและกรณีศึกษา",
  "service-local": "โปรโมตร้านและพื้นที่ให้บริการ",
  "service-booking": "ข้อเสนอและเพิ่มการจอง",
  "creator-short-film": "หนังสั้น / ละครสั้น",
  "creator-comedy": "ตลก / สเก็ตช์ / มุกสถานการณ์",
  "creator-education": "ให้ความรู้ / สอน / อธิบาย",
  "creator-review": "รีวิว / วิเคราะห์ / แสดงความคิดเห็น",
  "creator-story": "เล่าเรื่อง / ประสบการณ์ / สร้างตัวตน",
  "creator-gaming": "เกม / ไฮไลต์ / ชาเลนจ์ / ไลฟ์",
  "creator-art": "ศิลปะ / เพลง / การแสดง / ผลงานสร้างสรรค์",
  "creator-lifestyle": "ไลฟ์สไตล์ / ชุมชน / ชีวิตประจำวัน",
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

function resolveContentDirection(
  value: PlanRequest["contentDirection"],
  planType: PlanType
): ContentDirection {
  if (value) return value;

  if (planType === "creator") {
    return "creator-education";
  }

  if (planType === "service") {
    return "service-expert";
  }

  return "product-problem-solution";
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

const STAGE_SEQUENCE_VARIANTS: Record<
  ContentGoal,
  CampaignStage[][]
> = {
  sell: [
    ["problem", "demo", "value", "objection", "trust", "story", "action"],
    ["problem", "comparison", "demo", "trust", "objection", "value", "action"],
    ["story", "problem", "value", "demo", "behind-scenes", "objection", "action"],
    ["problem", "value", "community", "demo", "trust", "comparison", "action"],
  ],
  grow: [
    ["problem", "value", "community", "story", "trust", "comparison", "action"],
    ["story", "value", "problem", "community", "behind-scenes", "trust", "action"],
    ["comparison", "problem", "value", "story", "community", "trust", "action"],
    ["problem", "behind-scenes", "value", "community", "story", "comparison", "action"],
  ],
  engagement: [
    ["problem", "community", "value", "comparison", "story", "community", "action"],
    ["community", "problem", "story", "value", "comparison", "trust", "action"],
    ["story", "community", "problem", "comparison", "value", "community", "action"],
    ["problem", "comparison", "community", "story", "value", "trust", "action"],
  ],
  trust: [
    ["problem", "value", "behind-scenes", "objection", "trust", "story", "action"],
    ["behind-scenes", "problem", "value", "comparison", "objection", "trust", "action"],
    ["story", "problem", "behind-scenes", "value", "trust", "objection", "action"],
    ["problem", "comparison", "value", "behind-scenes", "story", "trust", "action"],
  ],
  promote: [
    ["problem", "value", "demo", "objection", "trust", "community", "action"],
    ["story", "problem", "demo", "value", "comparison", "trust", "action"],
    ["problem", "behind-scenes", "value", "demo", "objection", "community", "action"],
    ["comparison", "problem", "value", "trust", "demo", "community", "action"],
  ],
};

const DIRECTION_STAGE_SEQUENCES: Partial<
  Record<ContentDirection, CampaignStage[]>
> = {
  "product-demo": [
    "demo",
    "value",
    "problem",
    "comparison",
    "trust",
    "objection",
    "action",
  ],
  "product-review": [
    "comparison",
    "demo",
    "objection",
    "trust",
    "problem",
    "value",
    "action",
  ],
  "product-lifestyle": [
    "story",
    "demo",
    "behind-scenes",
    "community",
    "value",
    "trust",
    "action",
  ],
  "product-problem-solution": [
    "problem",
    "value",
    "demo",
    "objection",
    "trust",
    "comparison",
    "action",
  ],
  "product-offer": [
    "problem",
    "value",
    "demo",
    "objection",
    "comparison",
    "trust",
    "action",
  ],
  "product-brand-story": [
    "story",
    "behind-scenes",
    "value",
    "trust",
    "community",
    "demo",
    "action",
  ],
  "service-results": [
    "story",
    "demo",
    "comparison",
    "trust",
    "objection",
    "community",
    "action",
  ],
  "service-process": [
    "behind-scenes",
    "problem",
    "demo",
    "value",
    "trust",
    "objection",
    "action",
  ],
  "service-expert": [
    "problem",
    "value",
    "community",
    "comparison",
    "trust",
    "story",
    "action",
  ],
  "service-case-study": [
    "story",
    "problem",
    "demo",
    "trust",
    "comparison",
    "community",
    "action",
  ],
  "service-local": [
    "story",
    "behind-scenes",
    "demo",
    "community",
    "trust",
    "value",
    "action",
  ],
  "service-booking": [
    "problem",
    "value",
    "demo",
    "objection",
    "trust",
    "community",
    "action",
  ],
  "creator-short-film": [
    "problem",
    "story",
    "community",
    "demo",
    "behind-scenes",
    "comparison",
    "action",
  ],
  "creator-comedy": [
    "problem",
    "story",
    "community",
    "demo",
    "behind-scenes",
    "comparison",
    "action",
  ],
  "creator-review": [
    "problem",
    "demo",
    "comparison",
    "objection",
    "trust",
    "community",
    "action",
  ],
  "creator-story": [
    "story",
    "problem",
    "behind-scenes",
    "community",
    "value",
    "trust",
    "action",
  ],
  "creator-gaming": [
    "problem",
    "demo",
    "community",
    "comparison",
    "behind-scenes",
    "story",
    "action",
  ],
  "creator-art": [
    "story",
    "demo",
    "behind-scenes",
    "community",
    "comparison",
    "trust",
    "action",
  ],
  "creator-lifestyle": [
    "story",
    "problem",
    "community",
    "behind-scenes",
    "value",
    "trust",
    "action",
  ],
};

function prioritizeSequenceForAudienceStage(
  sequence: CampaignStage[],
  audienceStage: AudienceStage
): CampaignStage[] {
  const priorities: Record<
    AudienceStage,
    CampaignStage[]
  > = {
    new: [
      "problem",
      "story",
      "value",
      "demo",
      "trust",
      "community",
      "action",
    ],
    aware: [
      "value",
      "demo",
      "story",
      "behind-scenes",
      "trust",
      "community",
      "action",
    ],
    considering: [
      "objection",
      "trust",
      "demo",
      "comparison",
      "value",
      "community",
      "action",
    ],
    existing: [
      "community",
      "story",
      "behind-scenes",
      "demo",
      "value",
      "trust",
      "action",
    ],
  };

  const rank = new Map(
    priorities[audienceStage].map(
      (stage, index) => [stage, index]
    )
  );

  return [...sequence].sort((left, right) => {
    const leftRank =
      rank.get(left) ?? priorities[audienceStage].length;
    const rightRank =
      rank.get(right) ?? priorities[audienceStage].length;

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return sequence.indexOf(left) - sequence.indexOf(right);
  });
}

function getStageSequence(
  request: ResolvedRequest,
  round: number,
  variationIndex: number
): CampaignStage[] {
  const directionSequence =
    DIRECTION_STAGE_SEQUENCES[
      request.contentDirection
    ];

  if (directionSequence) {
    return prioritizeSequenceForAudienceStage(
      directionSequence,
      request.audienceStage
    );
  }

  const sequenceOptions =
    STAGE_SEQUENCE_VARIANTS[request.goal];

  const sequenceIndex = positiveModulo(
    variationIndex + round - 1,
    sequenceOptions.length
  );

  return prioritizeSequenceForAudienceStage(
    sequenceOptions[sequenceIndex],
    request.audienceStage
  );
}

const CONTENT_ANGLES: ContentAngle[] = [
  {
    id: "checklist",
    titlePrefix: "เช็กลิสต์",
    hookPrefix: "เช็กเรื่องนี้ให้ครบก่อน:",
    scriptLead: "รอบนี้เราจะไล่ดูแบบเช็กลิสต์สั้น ๆ เพื่อให้ทำตามได้ทันที",
    captionHeading: "เช็กลิสต์ที่ควรดูให้ครบ",
    shotDirection: "เปิดด้วยภาพเช็กลิสต์หรือเลขลำดับที่อ่านจบได้ในหนึ่งวินาที",
    onScreenText: "เช็กทีละข้อ",
  },
  {
    id: "mistake",
    titlePrefix: "จุดที่มักพลาด",
    hookPrefix: "จุดที่หลายคนมักพลาดคือ:",
    scriptLead: "เริ่มจากข้อผิดพลาดที่เกิดขึ้นบ่อย แล้วค่อยอธิบายวิธีทำที่ชัดกว่า",
    captionHeading: "อย่าข้ามจุดนี้",
    shotDirection: "เปิดด้วยภาพหรือข้อความแสดงข้อผิดพลาดที่คนดูจำได้ทันที",
    onScreenText: "อย่าพลาดข้อนี้",
  },
  {
    id: "question",
    titlePrefix: "คำถามก่อนเริ่ม",
    hookPrefix: "ลองตอบคำถามนี้ก่อน:",
    scriptLead: "ใช้คำถามนำเพื่อให้ผู้ชมเปรียบเทียบกับสถานการณ์ของตัวเอง",
    captionHeading: "คำถามที่ช่วยตัดสินใจ",
    shotDirection: "เปิดด้วยคำถามตัวใหญ่หนึ่งประโยค แล้วเว้นจังหวะให้คนดูคิด",
    onScreenText: "คุณตอบข้อนี้ได้ไหม",
  },
  {
    id: "scenario",
    titlePrefix: "สถานการณ์จริง",
    hookPrefix: "ลองนึกภาพว่าสถานการณ์นี้เกิดกับคุณ:",
    scriptLead: "เล่าจากสถานการณ์ที่กลุ่มเป้าหมายพบได้จริง แล้วพาไปสู่ขั้นตอนแก้ไข",
    captionHeading: "เมื่อเจอสถานการณ์นี้",
    shotDirection: "เปิดด้วยภาพจำลองสถานการณ์จริงก่อนแสดงคำอธิบาย",
    onScreenText: "ถ้าเจอแบบนี้",
  },
  {
    id: "compare",
    titlePrefix: "เปรียบเทียบก่อนเลือก",
    hookPrefix: "ก่อนเลือก ลองเทียบจากเกณฑ์นี้:",
    scriptLead: "อธิบายความต่างด้วยเกณฑ์ที่ตรวจสอบได้ โดยไม่โจมตีหรือกล่าวอ้างเกินจริง",
    captionHeading: "เทียบให้ชัดก่อนเลือก",
    shotDirection: "เปิดด้วยภาพแบ่งซ้ายและขวา หรือหัวข้อเปรียบเทียบสองด้าน",
    onScreenText: "ต่างกันตรงไหน",
  },
  {
    id: "quick-win",
    titlePrefix: "ทำได้ทันที",
    hookPrefix: "ใช้เวลาไม่นาน ลองทำข้อนี้ก่อน:",
    scriptLead: "ให้ผู้ชมได้ขั้นตอนเล็ก ๆ ที่นำไปใช้ได้ทันที ก่อนอธิบายรายละเอียดเพิ่ม",
    captionHeading: "เริ่มจากขั้นตอนสั้น ๆ",
    shotDirection: "เปิดด้วยผลลัพธ์หรือขั้นตอนแรกที่ทำตามได้ทันที",
    onScreenText: "เริ่มได้เลย",
  },
  {
    id: "faq",
    titlePrefix: "คำถามที่พบบ่อย",
    hookPrefix: "คำถามที่ควรถามก่อนคือ:",
    scriptLead: "ตอบคำถามแบบตรงประเด็น ใช้ภาษาง่าย และแยกสิ่งที่รู้จริงออกจากสิ่งที่ต้องตรวจเพิ่ม",
    captionHeading: "ตอบคำถามแบบตรงไปตรงมา",
    shotDirection: "เปิดด้วยกล่องคำถามหรือข้อความคำถามหนึ่งประโยค",
    onScreenText: "คำถามที่คนถามบ่อย",
  },
  {
    id: "behind-scenes",
    titlePrefix: "เบื้องหลัง",
    hookPrefix: "เบื้องหลังที่หลายคนไม่ทันสังเกตคือ:",
    scriptLead: "พาไปดูขั้นตอนหรือเหตุผลเบื้องหลัง เพื่อเพิ่มความเข้าใจและความน่าเชื่อถือ",
    captionHeading: "เบื้องหลังที่ควรรู้",
    shotDirection: "เปิดด้วยภาพขั้นตอนจริง อุปกรณ์ หรือหน้าจอการทำงาน",
    onScreenText: "เบื้องหลังจริง",
  },
  {
    id: "myth-fact",
    titlePrefix: "แยกความเข้าใจผิด",
    hookPrefix: "ความเข้าใจผิดที่ควรแยกให้ชัด:",
    scriptLead: "เริ่มจากสิ่งที่คนมักเข้าใจผิด แล้วอธิบายข้อเท็จจริงเท่าที่ข้อมูลรองรับ",
    captionHeading: "เข้าใจให้ถูกก่อนทำ",
    shotDirection: "เปิดด้วยข้อความ “เข้าใจผิด / ข้อเท็จจริง” สองบรรทัด",
    onScreenText: "จริงหรือเข้าใจผิด",
  },
  {
    id: "step-by-step",
    titlePrefix: "ทำทีละขั้น",
    hookPrefix: "ทำตามทีละขั้นจากจุดนี้:",
    scriptLead: "แบ่งเรื่องยากให้เหลือขั้นตอนสั้น ๆ และบอกลำดับที่ควรทำก่อนหลัง",
    captionHeading: "ขั้นตอนพร้อมทำตาม",
    shotDirection: "เปิดด้วยเลข 1 แล้วค่อยเปลี่ยนภาพตามแต่ละขั้น",
    onScreenText: "ทำตามทีละขั้น",
  },
  {
    id: "evidence",
    titlePrefix: "ตรวจจากข้อมูลจริง",
    hookPrefix: "อย่าเพิ่งเชื่อคำโฆษณา ให้ตรวจจากสิ่งนี้:",
    scriptLead: "ชี้ให้ผู้ชมตรวจรายละเอียด ขั้นตอน หรือหลักฐานที่มีจริงก่อนตัดสินใจ",
    captionHeading: "ตรวจข้อมูลก่อนเชื่อ",
    shotDirection: "เปิดด้วยภาพรายละเอียดจริง ฉลาก ขั้นตอน หรือข้อมูลที่ตรวจสอบได้",
    onScreenText: "ดูข้อมูลจริง",
  },
  {
    id: "audience-specific",
    titlePrefix: "สำหรับกลุ่มนี้โดยเฉพาะ",
    hookPrefix: "เนื้อหานี้เหมาะกับคนที่กำลังเจอเรื่องนี้:",
    scriptLead: "ระบุกลุ่มผู้ชมให้ชัด แล้วอธิบายเฉพาะสิ่งที่เกี่ยวข้องกับสถานการณ์ของกลุ่มนั้น",
    captionHeading: "เหมาะกับใคร",
    shotDirection: "เปิดด้วยข้อความระบุกลุ่มผู้ชมที่ชัดเจนหนึ่งบรรทัด",
    onScreenText: "เหมาะกับคุณไหม",
  },
];

const VARIANT_FOLLOW_UP_PROMPTS = [
  "หลังดูจบ ให้เลือกหนึ่งข้อที่ตรงกับสถานการณ์จริงของคุณมากที่สุด",
  "ก่อนทำต่อ ให้จดหนึ่งคำถามที่ยังต้องตรวจข้อมูลเพิ่ม",
  "ลองนำขั้นตอนนี้ไปเทียบกับสิ่งที่คุณกำลังทำอยู่ แล้วเลือกจุดที่ควรปรับก่อน",
  "บันทึกผลที่เกิดขึ้นจริงหนึ่งอย่าง เพื่อใช้ตัดสินใจในขั้นตอนถัดไป",
  "อย่าพยายามทำทุกข้อพร้อมกัน เลือกหนึ่งข้อที่สำคัญที่สุดในวันนี้",
  "ลองอธิบายเรื่องนี้ด้วยภาษาของตัวเองหนึ่งประโยค เพื่อเช็กว่าเข้าใจตรงกัน",
  "เก็บคำถามจากผู้ชมหรือลูกค้าไว้ เพราะคำถามนั้นใช้เป็นหัวข้อคอนเทนต์ถัดไปได้",
  "เปรียบเทียบก่อนและหลังลงมือทำจากตัวเลขหรือเหตุการณ์ที่สังเกตได้จริง",
  "เลือกหลักฐานหรือรายละเอียดที่ตรวจสอบได้หนึ่งชิ้นมาใช้ประกอบการตัดสินใจ",
  "หลังโพสต์ ให้ดูว่าคนหยุดอ่าน ดูต่อ หรือถามเรื่องใดมากที่สุด",
  "นำข้อที่ทำได้ง่ายที่สุดไปเริ่มก่อน แล้วค่อยเพิ่มความยากเมื่อมีผลจริง",
];

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

function resolveAudienceStage(
  value: PlanRequest["audienceStage"]
): AudienceStage {
  if (
    value === "aware" ||
    value === "considering" ||
    value === "existing"
  ) {
    return value;
  }

  return "new";
}

function resolveAudienceValue(
  value: PlanRequest["audienceValue"],
  planType: PlanType,
  direction: ContentDirection
): AudienceValue {
  if (
    value === "entertain" ||
    value === "learn" ||
    value === "solve" ||
    value === "compare" ||
    value === "inspire" ||
    value === "trust" ||
    value === "participate"
  ) {
    return value;
  }

  if (
    direction === "creator-short-film" ||
    direction === "creator-comedy" ||
    direction === "creator-gaming"
  ) {
    return "entertain";
  }

  if (planType === "creator") {
    return "inspire";
  }

  return planType === "service" ? "trust" : "solve";
}

function resolveDesiredAction(
  value: PlanRequest["desiredAction"],
  planType: PlanType,
  goal: ContentGoal
): DesiredAction {
  if (
    value === "follow" ||
    value === "comment" ||
    value === "save" ||
    value === "share" ||
    value === "message" ||
    value === "click" ||
    value === "order" ||
    value === "book"
  ) {
    return value;
  }

  if (planType === "creator") {
    return goal === "engagement" ? "comment" : "follow";
  }

  if (planType === "service") {
    return goal === "sell" ? "book" : "message";
  }

  return goal === "sell" ? "order" : "click";
}

function resolveSupportNeeds(
  value: PlanRequest["supportNeeds"],
  planType: PlanType
): SupportNeed[] {
  const allowed: SupportNeed[] = [
    "ideas",
    "full-script",
    "shot-list",
    "caption-cta",
    "editing",
    "schedule",
    "sales-angle",
    "consistency",
  ];

  const selected = Array.isArray(value)
    ? value.filter(
        (item): item is SupportNeed =>
          allowed.includes(item as SupportNeed)
      )
    : [];

  if (selected.length > 0) {
    return selected.slice(0, 3);
  }

  return planType === "creator"
    ? ["ideas", "full-script", "shot-list"]
    : ["full-script", "caption-cta", "schedule"];
}

function resolveTone(
  value: PlanRequest["tone"]
): ContentTone {
  if (
    value === "expert" ||
    value === "fun" ||
    value === "emotional" ||
    value === "premium" ||
    value === "direct"
  ) {
    return value;
  }

  return "friendly";
}

function resolveRequest(
  request: PlanRequest
): ResolvedRequest {
  const planType = resolvePlanType(
    request.planType
  );

  const contentDirection =
    resolveContentDirection(
      request.contentDirection,
      planType
    );

  const goal = resolveGoal(request.goal);

  const defaults = getPlanDefaults(planType);

  const productHighlights =
    splitUserLines(request.productHighlights);

  const customerConcerns =
    splitUserLines(request.customerConcerns);

  const prohibitedClaims =
    splitUserLines(request.prohibitedClaims);

  return {
    planType,
    contentDirection,

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

    creatorChallenge:
      request.creatorChallenge?.trim() || "",

    audienceStage:
      resolveAudienceStage(request.audienceStage),

    audienceValue:
      resolveAudienceValue(
        request.audienceValue,
        planType,
        contentDirection
      ),

    desiredAction:
      resolveDesiredAction(
        request.desiredAction,
        planType,
        goal
      ),

    supportNeeds:
      resolveSupportNeeds(
        request.supportNeeds,
        planType
      ),

    tone:
      resolveTone(request.tone),

    promotionDetails:
      request.promotionDetails.trim(),

    prohibitedClaims,

    goal,
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
  request: ResolvedRequest
): ContentFormat[] {
  const platform = request.platform;
  const intensity = request.intensity;
  const isNarrativeCreator =
    request.contentDirection === "creator-short-film" ||
    request.contentDirection === "creator-comedy";

  if (isNarrativeCreator) {
    if (intensity === "light") {
      return [
        "text",
        "reel",
        "image",
        "text",
        "reel",
        "story",
        "carousel",
      ];
    }

    if (intensity === "growth") {
      return [
        "reel",
        "reel",
        "image",
        "reel",
        "story",
        "reel",
        "reel",
      ];
    }

    return [
      "reel",
      "image",
      "reel",
      "story",
      "image",
      "reel",
      "carousel",
    ];
  }

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
  const formats = getBaseFormats(request);

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
  if (intensity === "light") {
    if (format === "text") return 10;
    if (format === "image") return 15;
    return 20;
  }

  if (intensity === "standard") {
    if (format === "text") return 25;
    if (format === "image") return 30;
    if (format === "carousel") return 35;
    return 45;
  }

  if (format === "text") return 45;
  if (format === "image") return 55;
  if (format === "carousel") return 65;
  return 80;
}

function getPrimaryAction(
  request: ResolvedRequest
) {
  const subject = request.productOrService;

  if (request.desiredAction === "follow") {
    return "กดติดตามไว้เพื่อดูผลงานหรือเนื้อหาต่อไป";
  }

  if (request.desiredAction === "comment") {
    return "พิมพ์ความคิดเห็นหรือคำตอบของคุณไว้ใต้โพสต์";
  }

  if (request.desiredAction === "save") {
    return "บันทึกโพสต์นี้ไว้กลับมาดูหรือทำตามภายหลัง";
  }

  if (request.desiredAction === "share") {
    return "แชร์โพสต์นี้ให้คนที่น่าจะสนใจหรือเคยเจอสถานการณ์คล้ายกัน";
  }

  if (request.desiredAction === "message") {
    return `ส่งข้อความสอบถามรายละเอียดของ ${subject} เมื่อพร้อม`;
  }

  if (request.desiredAction === "click") {
    return `กดดูรายละเอียดของ ${subject} ต่อจากลิงก์หรือช่องทางที่ระบุ`;
  }

  if (request.desiredAction === "order") {
    return `ตรวจรายละเอียดของ ${subject} ให้ครบ แล้วสั่งซื้อผ่านช่องทางที่ระบุ`;
  }

  return `ตรวจรายละเอียดของ ${subject} ให้ครบ แล้วจองคิวผ่านช่องทางที่ระบุ`;
}

function getWeeklyObjective(
  request: ResolvedRequest
) {
  if (request.planType === "creator") {
    const directionLabel =
      CONTENT_DIRECTION_LABELS[
        request.contentDirection
      ];

    if (
      request.contentDirection === "creator-short-film" ||
      request.contentDirection === "creator-comedy"
    ) {
      return `ผลิตผลงาน ${directionLabel} ให้ ${request.audience} ได้รับ “${AUDIENCE_VALUE_LABELS[request.audienceValue]}” และพาไปสู่การ “${DESIRED_ACTION_LABELS[request.desiredAction]}” โดยระบบเน้น ${request.supportNeeds.map((need) => SUPPORT_NEED_LABELS[need]).join(", ")} ภายในเวลาที่มี`;
    }

    if (request.contentDirection !== "creator-education") {
      return `สร้างผลงานแนว ${directionLabel} เกี่ยวกับ ${request.productOrService} ให้ ${request.audience} ได้รับ “${AUDIENCE_VALUE_LABELS[request.audienceValue]}” ด้วยน้ำเสียง “${TONE_LABELS[request.tone]}” และทำให้ทิศทางเพจชัดเจนตลอด 7 วัน`;
    }

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

  const directionLabel =
    CONTENT_DIRECTION_LABELS[
      request.contentDirection
    ];

  const directionStrategy =
    request.planType === "creator"
      ? `ระบบยึดทิศทาง “${directionLabel}” เป็นแกนหลัก และแยกสิ่งที่ผู้สร้างต้องการให้ช่วยออกจากสิ่งที่ผู้ชมสนใจ เพื่อไม่ให้ปัญหาของผู้สร้างถูกนำไปเขียนเป็นปัญหาของผู้ชม`
      : `ระบบยึดทิศทาง “${directionLabel}” เป็นแกนหลัก เพื่อเลือกมุม เนื้อหา และคำชวนที่ตรงกับรูปแบบการขายหรือบริการ`;

  return [
    `แผนประเภท ${PLAN_TYPE_LABELS[request.planType]} ออกแบบสำหรับ ${platformLabel} โดยมีเป้าหมายหลักคือ ${goalLabel}`,
    directionStrategy,
    `ผู้ชมหลักอยู่ในระดับ “${AUDIENCE_STAGE_LABELS[request.audienceStage]}” และคอนเทนต์ต้องส่งมอบ “${AUDIENCE_VALUE_LABELS[request.audienceValue]}”`,
    `คำชวนหลักของแผนคือ “${DESIRED_ACTION_LABELS[request.desiredAction]}” โดยใช้น้ำเสียง “${TONE_LABELS[request.tone]}”`,
    `ระบบให้น้ำหนักกับ ${request.supportNeeds.map((need) => SUPPORT_NEED_LABELS[need]).join(", ")}`,
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

function createEducationalCreatorStageContent(
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


type CreatorDirectionProfile = {
  stageLabel: string;
  mainVerb: string;
  outputLabel: string;
  proofLabel: string;
  audiencePrompt: string;
};

const CREATOR_DIRECTION_PROFILES: Partial<
  Record<ContentDirection, CreatorDirectionProfile>
> = {
  "creator-review": {
    stageLabel: "รีวิวและวิเคราะห์",
    mainVerb: "รีวิว",
    outputLabel: "ข้อสรุปที่มีเหตุผล",
    proofLabel: "เกณฑ์ที่ใช้ตัดสิน",
    audiencePrompt: "คุณให้ความสำคัญกับเกณฑ์ไหนมากที่สุด?",
  },
  "creator-story": {
    stageLabel: "เล่าเรื่องและสร้างตัวตน",
    mainVerb: "เล่าเรื่อง",
    outputLabel: "เรื่องเล่าที่มีจุดเริ่มและบทเรียน",
    proofLabel: "เหตุการณ์หรือประสบการณ์จริง",
    audiencePrompt: "คุณเคยเจอสถานการณ์คล้ายกันไหม?",
  },
  "creator-gaming": {
    stageLabel: "เกมและชาเลนจ์",
    mainVerb: "สร้างไฮไลต์",
    outputLabel: "ช่วงเล่นเกมที่มีเป้าหมายชัด",
    proofLabel: "ภาพการเล่นหรือผลลัพธ์ในเกม",
    audiencePrompt: "รอบต่อไปควรรับภารกิจอะไร?",
  },
  "creator-art": {
    stageLabel: "แสดงผลงานสร้างสรรค์",
    mainVerb: "นำเสนอผลงาน",
    outputLabel: "ผลงานหรือการแสดงที่ดูจบได้",
    proofLabel: "กระบวนการและผลงานจริง",
    audiencePrompt: "อยากเห็นขั้นตอนไหนหรือผลงานแบบไหนต่อ?",
  },
  "creator-lifestyle": {
    stageLabel: "ไลฟ์สไตล์และชุมชน",
    mainVerb: "เล่าชีวิตจริง",
    outputLabel: "ช่วงชีวิตหรือกิจวัตรที่มีเรื่องราว",
    proofLabel: "ภาพจากสถานการณ์จริง",
    audiencePrompt: "ชีวิตประจำวันของคุณต่างจากนี้ตรงไหน?",
  },
};

function getNarrativeProductionRule(
  request: ResolvedRequest
) {
  if (request.intensity === "light") {
    return {
      duration: "15–25 วินาที",
      cast: "นักแสดง 1 คน",
      location: "สถานที่เดียว",
      shots: "ไม่เกิน 3–4 ช็อต",
      edit: "ตัดต่อแบบคัตตรงและใส่ข้อความเท่าที่จำเป็น",
    };
  }

  if (request.intensity === "growth") {
    return {
      duration: "45–75 วินาที",
      cast: "นักแสดง 1–3 คน",
      location: "1–2 สถานที่",
      shots: "ประมาณ 6–8 ช็อต",
      edit: "เพิ่มเสียง บรรยากาศ และจังหวะตัดต่อได้",
    };
  }

  return {
    duration: "30–45 วินาที",
    cast: "นักแสดง 1–2 คน",
    location: "สถานที่เดียว",
    shots: "ประมาณ 4–6 ช็อต",
    edit: "ตัดต่อไม่ซับซ้อนและเน้นจังหวะเรื่อง",
  };
}

function createNarrativeCreatorStageContent(
  stage: CampaignStage,
  request: ResolvedRequest
): StageContent {
  const isComedy =
    request.contentDirection === "creator-comedy";
  const subject = request.productOrService;
  const audience = request.audience;
  const audienceShort = shortAudience(audience);
  const viewerExpectation =
    AUDIENCE_VALUE_LABELS[request.audienceValue] +
    (request.customerConcerns[0]
      ? ` โดยเฉพาะ ${request.customerConcerns[0]}`
      : "");
  const firstHighlight =
    request.productHighlights[0] ||
    "ถ่ายด้วยอุปกรณ์ที่มี";
  const action = getPrimaryAction(request);
  const rule = getNarrativeProductionRule(request);

  const common = {
    afterPosting: [
      "ตอบความคิดเห็นที่พูดถึงตัวละคร เหตุการณ์ หรือตอนจบก่อน",
      "จดว่าคนดูหยุดดูหรือแสดงความคิดเห็นตรงฉากใด",
      "เก็บคำถามและข้อเสนอเรื่องตอนต่อไปไว้ใช้ในแผนรอบหน้า",
      "ตรวจยอดดูจนจบ การแชร์ และการเข้าชมโปรไฟล์",
    ],
    replyExamples: [
      "ขอบคุณที่ดูจนจบครับ คุณจับจุดสำคัญของเรื่องได้ตรงไหน?",
      "ตอนต่อไปอยากให้ตัวละครเลือกทางไหน ระหว่าง A กับ B?",
      "มุมนี้น่าสนใจครับ จะเก็บไว้เป็นทางเลือกสำหรับตอนต่อไป",
    ],
    metrics: adaptListToPlanType(
      getMetrics(request.goal),
      request
    ),
  };

  if (stage === "behind-scenes" || stage === "trust") {
    return {
      stage: "เบื้องหลังการสร้างผลงาน",
      title: `เบื้องหลัง ${subject}: จากไอเดียหนึ่งบรรทัดสู่ฉากพร้อมถ่าย`,
      objective:
        "สร้างความผูกพันด้วยการให้ผู้ชมเห็นกระบวนการทำผลงานจริง โดยไม่เปลี่ยนเพจให้กลายเป็นเพจสอน",
      marketingPrinciple: {
        title: "เบื้องหลังช่วยให้ผู้ชมรู้สึกใกล้ชิดกับผลงาน",
        explanation:
          "ผู้ชมที่ชอบผลงานมักสนใจที่มา ตัวละคร และการถ่ายทำ แต่เนื้อหาหลักยังต้องอยู่ในโลกของผลงาน",
      },
      topic: `เบื้องหลังหนึ่งฉากของ ${subject}`,
      hook: "ฉากสั้น ๆ นี้เริ่มจากไอเดียเพียงหนึ่งประโยค",
      script:
        `เปิดด้วยภาพฉากสำเร็จ 1 วินาที แล้วตัดกลับไปที่โน้ตไอเดียสั้น ๆ จากนั้นให้เห็นการจัดฉากตามข้อจำกัด “${firstHighlight}” และปิดด้วยภาพก่อน–หลังตัดต่อ ไม่ต้องอธิบายเป็นบทเรียนยาว ให้ผู้ชมเห็นว่าผลงานเกิดขึ้นจริงอย่างไร`,
      shotList: [
        "เปิดด้วยฉากสำเร็จที่น่าสนใจที่สุด",
        "ถ่ายโน้ตหรือภาพร่างของเรื่อง",
        "ถ่ายการจัดตำแหน่งตัวละครหรือกล้อง",
        "แสดงภาพก่อนและหลังตัดต่อ",
        "ปิดด้วยตัวอย่างตอนต่อไป 1–2 วินาที",
      ],
      onScreenTexts: [
        "จากหนึ่งประโยค",
        "จัดฉากด้วยของที่มี",
        "ก่อนตัด / หลังตัด",
        "ตอนต่อไปอยากดูไหม?",
      ],
      caption:
        `เบื้องหลังฉากสั้นจาก ${subject}\n\nข้อจำกัดรอบนี้คือ ${firstHighlight} จึงออกแบบให้ถ่ายง่ายและยังเล่าเรื่องรู้เรื่อง\n\nคุณอยากเห็นเบื้องหลังฉากไหนต่อ?`,
      cta: "พิมพ์ฉากที่อยากเห็นเบื้องหลัง หรือกดติดตามเพื่อดูตอนต่อไป",
      ...common,
    };
  }

  if (stage === "community") {
    return {
      stage: "ให้ผู้ชมเลือกทางของเรื่อง",
      title: isComedy
        ? "เลือกมุกจบ: A เข้าใจผิด หรือ B พูดความจริง"
        : "เลือกตอนจบ: A เปิดประตู หรือ B โทรกลับ",
      objective:
        "ชวนผู้ชมมีส่วนร่วมกับโลกของเรื่อง โดยไม่เปลี่ยนไปทำคอนเทนต์สอน",
      marketingPrinciple: {
        title: "ตัวเลือกในเรื่องช่วยให้คนตอบได้ง่าย",
        explanation:
          "เมื่อคำถามเกี่ยวข้องกับตัวละครและเหตุการณ์โดยตรง ผู้ชมจะรู้สึกว่าตนเองมีส่วนกับตอนต่อไป",
      },
      topic: `โหวตทางเลือกของตัวละครใน ${subject}`,
      hook: "ถ้าคุณเป็นตัวละครนี้ จะเลือก A หรือ B?",
      script:
        isComedy
          ? `ตัวละครได้รับข้อความว่า “ของมาถึงแล้ว” จึงรีบเปิดประตูพร้อมพูดว่า “ในที่สุดก็มา!” แต่คนหน้าประตูกลับเป็นเพื่อนที่ยืมของไปเมื่อวาน ให้หยุดภาพก่อนเฉลย แล้วขึ้นตัวเลือก A แกล้งทำเป็นจำไม่ได้ หรือ B ทวงของตรง ๆ ปิดด้วยสีหน้าตัวละครและรอผลโหวต`
          : `ตัวละครได้ยินเสียงเคาะประตูหลังอ่านข้อความว่า “อย่าเปิดประตู” ให้ถ่ายมือที่กำลังจับลูกบิด แล้วหยุดก่อนเปิด ขึ้นตัวเลือก A เปิดทันที หรือ B โทรหาคนส่งข้อความ ปิดด้วยเสียงเคาะอีกครั้งและภาพดำ`,
      shotList: [
        "เปิดด้วยเหตุการณ์ที่ต้องตัดสินใจทันที",
        "แสดงสีหน้าหรือมือของตัวละคร",
        "หยุดภาพก่อนการตัดสินใจ",
        "ขึ้นตัวเลือก A และ B ตัวใหญ่",
        "ปิดด้วยเสียงหรือภาพค้าง 2 วินาที",
      ],
      onScreenTexts: [
        "ถ้าเป็นคุณจะเลือกอะไร?",
        "A",
        "B",
        "ตอนต่อไปใช้ผลโหวตจริง",
      ],
      caption:
        `ถึงจุดที่ตัวละครต้องเลือกแล้ว\n\nA หรือ B?\n\nพิมพ์คำตอบพร้อมเหตุผลสั้น ๆ แล้วตอนต่อไปจะใช้ตัวเลือกที่คนโหวตมากที่สุด`,
      cta: "พิมพ์ A หรือ B และติดตามไว้ดูผลของการเลือก",
      ...common,
    };
  }

  if (stage === "comparison") {
    return {
      stage: "ทดลองสองเวอร์ชันของเรื่อง",
      title: isComedy
        ? "ฉากเดียว สองมุกจบ: แบบเงียบกับแบบสวนกลับ"
        : "ฉากเดียว สองตอนจบ: เปิดประตูกับไม่เปิด",
      objective:
        "ทดลองรูปแบบการเล่าเรื่องสองเวอร์ชัน เพื่อดูว่าผู้ชมตอบสนองกับจังหวะและตอนจบแบบใดมากกว่า",
      marketingPrinciple: {
        title: "A/B Test ต้องยังเป็นผลงาน ไม่ใช่คลิปสอน",
        explanation:
          "ทั้งสองเวอร์ชันควรเป็นฉากหนังที่ดูจบได้จริง ต่างกันเฉพาะจังหวะหรือทางเลือกของตอนจบ",
      },
      topic: isComedy
        ? "ทดลองมุกจบสองแบบจากสถานการณ์เดียวกัน"
        : "ทดลองตอนจบสองทางจากเหตุการณ์เดียวกัน",
      hook: isComedy
        ? "ประโยคเดียวกัน แต่เว้นจังหวะคนละแบบ ทำให้มุกเปลี่ยนไปเลย"
        : "ถ้าเขาเปิดประตู เรื่องจะจบแบบหนึ่ง แต่ถ้าไม่เปิด จะเจออีกความจริง",
      script: isComedy
        ? `เวอร์ชัน A: ตัวละครเปิดประตู รับถุงขยะ แล้วเงียบมองกล้อง 2 วินาที ก่อนพูดว่า “อย่างน้อยก็มาถูกห้อง”
เวอร์ชัน B: ตัวละครรับถุงขยะ แล้วยื่นคืนพร้อมพูดว่า “ของผมยังไม่มา แต่ของคุณกลับไปได้แล้ว”
ถ่ายฉากตั้งต้นครั้งเดียว แล้วเปลี่ยนเฉพาะจังหวะและประโยคจบ เพื่อดูว่าผู้ชมชอบมุกแบบเงียบหรือแบบสวนกลับ`
        : `เวอร์ชัน A: ตัวละครเปิดประตู พบทางเดินว่าง แต่โทรศัพท์ในมือขึ้นข้อความว่า “ช้าไปแล้ว”
เวอร์ชัน B: ตัวละครไม่เปิดประตู แล้วได้ยินเสียงตัวเองพูดจากอีกฝั่งว่า “ตัดสินใจถูกแล้ว”
ถ่ายฉากตั้งต้นเหมือนกัน แล้วเปลี่ยนเฉพาะตอนจบ ให้ผู้ชมเลือกว่าทางไหนควรเป็นเรื่องหลัก`,
      shotList: [
        "ถ่ายฉากตั้งต้นร่วมกันหนึ่งครั้ง",
        "ถ่ายตอนจบเวอร์ชัน A",
        "ถ่ายตอนจบเวอร์ชัน B",
        "ใช้ข้อความกำกับ A/B ให้เห็นชัด",
        "ปิดด้วยภาพค้างและคำถามหนึ่งข้อ",
      ],
      onScreenTexts: [
        "ตอนจบ A",
        "ตอนจบ B",
        "คุณเลือกแบบไหน?",
      ],
      caption: isComedy
        ? "ฉากเดียวกัน ลองจบสองแบบ 😂\n\nA มุกเงียบ หรือ B มุกสวนกลับ?\n\nพิมพ์ตัวเลือกที่ทำให้คุณอยากดูต่อมากกว่า"
        : "เรื่องเดียวกัน แต่มีสองทางจบ\n\nA เปิดประตู หรือ B ไม่เปิด?\n\nเลือกทางที่คุณอยากให้กลายเป็นตอนจริง",
      cta: "พิมพ์ A หรือ B พร้อมเหตุผลสั้น ๆ แล้วติดตามไว้ดูเวอร์ชันที่ถูกเลือก",
      ...common,
    };
  }

  if (stage === "action") {
    return {
      stage: "ตอนจบและพาไปตอนต่อไป",
      title: isComedy
        ? "เฉลยมุกและทิ้งปมสำหรับตอนต่อไป"
        : "เฉลยตอนจบหักมุมแบบถ่ายง่าย",
      objective:
        "ส่งมอบผลงานที่ดูจบได้ พร้อมสร้างเหตุผลให้ผู้ชมติดตามตอนต่อไป",
      marketingPrinciple: {
        title: "จบอารมณ์ให้ครบก่อนขอการติดตาม",
        explanation:
          "การค้างฉากสำคัญ 2–3 วินาทีและให้ผู้ชมรับตอนจบก่อนขึ้นคำชวน ช่วยรักษาอารมณ์ของเรื่อง",
      },
      topic: `ตอนจบของเรื่องสั้นใน ${subject}`,
      hook: isComedy
        ? "เขาทำทุกอย่างเพื่อซ่อนความจริง แต่คนที่รู้ดันยืนอยู่ข้างหลัง"
        : "ข้อความที่เตือนว่าอย่าเปิดประตู มาจากโทรศัพท์ที่อยู่ในห้อง",
      script:
        isComedy
          ? `ฉาก 1: ตัวละครพูดกับกล้องว่า “ทุกอย่างเรียบร้อย ไม่มีใครรู้แน่นอน”\nฉาก 2: กล้องค่อย ๆ เลื่อนไปเห็นเพื่อนยืนด้านหลังถือของที่ถูกซ่อนไว้\nเพื่อน: “พูดต่อสิ กำลังฟังอยู่”\nฉาก 3: ตัวละครยิ้มแห้งและค่อย ๆ ปิดประตู\nตอนจบ: ค้างสีหน้า 2 วินาที เสียงค่อย ๆ เบาลง แล้วค่อยขึ้นคำว่า “ตอนต่อไปจะเอาตัวรอดยังไง?”`
          : `ฉาก 1: ตัวละครอ่านข้อความ “อย่าเปิดประตู” แล้วเงยหน้ามองประตู\nฉาก 2: เสียงเคาะดังขึ้น ตัวละครถอยหนึ่งก้าว\nฉาก 3: โทรศัพท์อีกเครื่องบนโต๊ะสว่างขึ้น และชื่อผู้ส่งคือชื่อของตัวละครเอง\nตัวละคร: “แล้วใครเป็นคนส่ง?”\nตอนจบ: กล้องซูมช้าไปที่โทรศัพท์ ค้าง 2–3 วินาที เสียงเคาะเบาลง แล้วจึงขึ้นข้อความ “มีตอนต่อ”`,
      shotList: [
        `กำหนดคลิปประมาณ ${rule.duration}`,
        `ใช้ ${rule.cast} และ ${rule.location}`,
        "ถ่ายฉากตั้งต้นให้เข้าใจใน 3 วินาทีแรก",
        "ถ่ายจังหวะเฉลยแยกเป็นช็อตชัดเจน",
        "ค้างฉากสำคัญ 2–3 วินาทีก่อนขึ้น CTA",
      ],
      onScreenTexts: [
        isComedy ? "ไม่มีใครรู้แน่นอน..." : "อย่าเปิดประตู",
        isComedy ? "พูดต่อสิ" : "ผู้ส่ง: ตัวคุณเอง",
        "มีตอนต่อ",
      ],
      caption:
        isComedy
          ? "คิดว่าตัวละครจะเอาตัวรอดจากสถานการณ์นี้ยังไงในตอนต่อไป?\n\nดูจนจบแล้วพิมพ์ทางออกที่คิดว่าเนียนที่สุด"
          : "ถ้าข้อความเตือนมาจากโทรศัพท์ของตัวเอง คุณจะทำอะไรต่อ?\n\nพิมพ์คำตอบไว้ แล้วติดตามตอนต่อไป",
      cta: action,
      ...common,
    };
  }

  if (stage === "story") {
    return {
      stage: "ผลงานหลักตอนที่ 1 พร้อมถ่าย",
      title: isComedy
        ? "บทสั้นตอนที่ 1: คนส่งของผิดห้อง"
        : "บทสั้นตอนที่ 1: ข้อความจากตัวเอง",
      objective:
        "ส่งมอบบทเรื่องแรกที่ถ่ายได้จริง โดยใช้ข้อจำกัดของผู้สร้างเป็นกรอบการออกแบบ",
      marketingPrinciple: {
        title: "ผลงานต้นฉบับต้องเป็นแกนหลักของเพจบันเทิง",
        explanation:
          "ผู้ชมติดตามเพราะต้องการดูเรื่อง ตัวละคร อารมณ์ และตอนจบ ไม่ใช่เพราะต้องการเรียนวิธีทำหนังทุกวัน",
      },
      topic: isComedy
        ? "มุกเข้าใจผิดจากข้อความสั้น ๆ"
        : "เรื่องลึกลับจากข้อความเตือนที่ไม่รู้ผู้ส่ง",
      hook: isComedy
        ? "เขารอของสำคัญมาทั้งวัน แต่คนที่มาถึงไม่ใช่คนส่งของ"
        : "เขาได้รับข้อความว่า “อย่าเปิดประตู” ตอนที่มือกำลังจับลูกบิด",
      script: isComedy
        ? `ฉาก 1 (0–5 วิ): ตัวละครมองโทรศัพท์ เห็นข้อความ “ถึงหน้าห้องแล้ว” แล้วรีบจัดท่าต้อนรับ
ตัวละคร: “มาแล้วสินะ!”
ฉาก 2 (5–15 วิ): เปิดประตู พบเพื่อนถือถุงขยะ
เพื่อน: “ฝากทิ้งให้หน่อย”
ตัวละคร: “แล้วของฉันล่ะ?”
ฉาก 3 (15–25 วิ): เสียงแจ้งเตือนดังขึ้น ข้อความใหม่เขียนว่า “ส่งผิดห้องครับ”
ตอนจบ: เพื่อนยื่นถุงขยะให้แล้วพูด “แต่อันนี้ถูกห้อง” ค้างสีหน้า 2 วินาที`
        : `ฉาก 1 (0–7 วิ): มือกำลังจับลูกบิด โทรศัพท์ดังขึ้น ข้อความเขียนว่า “อย่าเปิดประตู”
ตัวละคร: “ใครส่งมา?”
ฉาก 2 (7–20 วิ): เสียงเคาะดังสามครั้ง ตัวละครถอยและโทรกลับ แต่ได้ยินเสียงริงโทนจากในห้อง
ฉาก 3 (20–35 วิ): กล้องค่อย ๆ หันไปเห็นโทรศัพท์อีกเครื่องใต้หมอน หน้าจอแสดงชื่อผู้ส่งเป็นชื่อตัวละคร
ตัวละครกระซิบ: “แต่นั่นไม่ใช่เครื่องของฉัน...”
ตอนจบ: ไฟดับ เสียงเคาะหยุด ค้างภาพดำ 2 วินาที แล้วขึ้นคำว่า “ตอนที่ 2”`,
      shotList: [
        `ความยาวเป้าหมาย ${rule.duration}`,
        `${rule.cast} · ${rule.location}`,
        "ช็อตเปิดต้องทำให้เข้าใจเหตุการณ์ใน 3 วินาที",
        isComedy
          ? "ช็อตกลางเน้นสีหน้าและจังหวะเว้นก่อนมุก"
          : "ช็อตกลางเน้นเสียงเคาะและแหล่งเสียงโทรศัพท์",
        "ช็อตจบค้างอารมณ์ 2–3 วินาทีก่อนขึ้นข้อความ",
      ],
      onScreenTexts: [
        isComedy ? "ถึงหน้าห้องแล้ว" : "อย่าเปิดประตู",
        isComedy ? "ส่งผิดห้องครับ" : "ผู้ส่ง: ตัวคุณเอง",
        isComedy ? "แต่อันนี้ถูกห้อง" : "ตอนที่ 2",
      ],
      caption: isComedy
        ? `รอของสำคัญทั้งวัน แต่สิ่งที่มาถึงกลับเป็นถุงขยะ 😂\n\nเคยเจอข้อความหรือของส่งผิดแบบนี้ไหม?`
        : `ถ้ามีโทรศัพท์อีกเครื่องในห้อง และผู้ส่งใช้ชื่อของคุณเอง คุณจะเปิดประตูไหม?\n\nพิมพ์ A เปิด หรือ B ไม่เปิด`,
      cta: action,
      ...common,
    };
  }

  if (stage === "demo" || stage === "value") {
    return {
      stage: "ผลงานหลักตอนที่ 2 พร้อมถ่าย",
      title: isComedy
        ? "บทสั้นตอนที่ 2: เสียงเรียกจากตู้เย็น"
        : "บทสั้นตอนที่ 2: เสียงเรียกจากห้องว่าง",
      objective:
        "ส่งมอบบทอีกเรื่องที่มีเหตุการณ์ ตัวละคร และตอนจบต่างจากตอนแรก เพื่อให้แผน 7 วันมีผลงานจริงมากกว่าหนึ่งชิ้น",
      marketingPrinciple: {
        title: "สร้างความคาดหวังด้วยตอนที่แตกต่างแต่ยังอยู่ในแนวเดียวกัน",
        explanation:
          "ผู้ชมควรจำแนวของเพจได้ แต่ไม่ควรรู้สึกว่าเรื่องและมุกถูกทำซ้ำ",
      },
      topic: isComedy
        ? "มุกเสียงลึกลับที่มีต้นเหตุธรรมดาเกินคาด"
        : "เสียงจากห้องว่างที่รู้ข้อมูลของตัวละคร",
      hook: isComedy
        ? "ทุกคืนตู้เย็นจะเรียกชื่อเขา จนคืนนี้เขาตัดสินใจตอบกลับ"
        : "ห้องข้าง ๆ ว่างมาสามเดือน แต่เมื่อคืนมีเสียงเรียกชื่อเขา",
      script: isComedy
        ? `ฉาก 1: ตัวละครได้ยินเสียงเบา ๆ จากตู้เย็นว่า “มานี่...” จึงถือไม้กวาดเดินเข้าไป
ฉาก 2: เปิดตู้เย็นช้า ๆ พบโทรศัพท์ที่เปิดคลิปเสียงค้างอยู่
ตัวละคร: “ใครเอาโทรศัพท์มาไว้ตรงนี้?”
ฉาก 3: เพื่อนเดินเข้ามาหยิบน้ำแล้วตอบ “ก็เธอบอกให้เตือนว่าอย่าลืมกินของในตู้”
ตอนจบ: ตัวละครมองอาหารหมดอายุแล้วพูด “เตือนช้าไปสามวัน” ค้าง 2 วินาที`
        : `ฉาก 1: ตัวละครเดินผ่านห้องว่างและได้ยินเสียงเรียกชื่อจากด้านใน
ฉาก 2: เขาเปิดกล้องโทรศัพท์ส่องลอดช่องประตู เห็นห้องว่าง แต่ในจอโทรศัพท์มีเงาคนยืนด้านหลัง
ตัวละครหันกลับ ไม่มีใคร
ฉาก 3: เสียงในห้องพูดว่า “อย่าหันมาอีกครั้ง”
ตอนจบ: กล้องค้างที่มือซึ่งกำลังเอื้อมจับลูกบิด แล้วตัดดำ`,
      shotList: [
        `กำหนดคลิปประมาณ ${rule.duration}`,
        `ใช้ ${rule.cast} และ ${rule.location}`,
        "แยกแหล่งเสียงให้ผู้ชมเข้าใจทิศทาง",
        "ถ่ายปฏิกิริยาตัวละครเป็นช็อตใกล้",
        "จบด้วยภาพหรือประโยคที่ไม่ซ้ำกับตอนแรก",
      ],
      onScreenTexts: [
        isComedy ? "ใครเรียก?" : "ห้องนี้ว่าง",
        isComedy ? "เตือนช้าไปสามวัน" : "อย่าหันมาอีกครั้ง",
        "เรื่องสั้นตอนใหม่",
      ],
      caption: isComedy
        ? "ถ้าได้ยินเสียงเรียกจากตู้เย็น คุณจะเปิดไหม? 😂\n\nตอนจบธรรมดากว่าที่คิด แต่ปัญหาจริงคือของหมดอายุ"
        : "ถ้ากล้องเห็นบางอย่างที่ตาเปล่าไม่เห็น คุณจะเชื่อกล้องหรือเชื่อตัวเอง?\n\nติดตามไว้ดูเรื่องสั้นตอนต่อไป",
      cta: "พิมพ์สิ่งที่คุณคิดว่าอยู่ในห้อง แล้วติดตามไว้ดูเรื่องสั้นตอนใหม่",
      ...common,
    };
  }

  return {
    stage: "เปิดโลกและตัวละคร",
    title: isComedy
      ? `แนะนำตัวละครที่มักเข้าใจทุกอย่างผิดใน ${subject}`
      : `เปิดปมของเพจ ${subject} ด้วยเหตุการณ์หนึ่งประโยค`,
    objective:
      "ทำให้ผู้ชมรู้จักแนวผลงาน ตัวละคร และอารมณ์ของเพจโดยใช้คอนเทนต์ที่อยู่ในโลกของเรื่อง",
    marketingPrinciple: {
      title: "เริ่มจากผลงาน ไม่เริ่มจากการอธิบายตัวเอง",
      explanation:
        "ตัวอย่างเรื่องสั้นช่วยให้ผู้ชมเข้าใจแนวเพจได้เร็วกว่าการบอกเพียงว่าเพจทำอะไร",
    },
    topic: `ตัวอย่างโลกของเรื่องสำหรับ ${audienceShort}`,
    hook: isComedy
      ? "คนนี้ไม่ได้ซวย เขาแค่ตีความทุกอย่างเร็วเกินไป"
      : "ทุกคืนเวลาเดิม โทรศัพท์ที่ไม่มีซิมจะดังขึ้นหนึ่งครั้ง",
    script:
      isComedy
        ? `ถ่ายตัวละครอ่านข้อความสั้น ๆ แล้วรีบตอบสนองผิดสถานการณ์สามครั้งติดกัน ปิดด้วยประโยค “ครั้งนี้มั่นใจว่าเข้าใจถูก” ก่อนเปิดประตูไปเจอเหตุการณ์ตรงข้าม ค้างสีหน้าแล้วขึ้นชื่อซีรีส์`
        : `ถ่ายโทรศัพท์เก่าวางอยู่บนโต๊ะ เวลา 23:59 หน้าจอสว่างและขึ้นสายเรียกเข้าจาก “พรุ่งนี้” ตัวละครไม่รับสาย แต่มีข้อความตามมาว่า “คืนนี้อย่านอน” ปิดด้วยตัวละครมองนาฬิกาที่หยุดเดิน`,
    shotList: [
      `ยึดข้อจำกัด ${firstHighlight}`,
      `ใช้ ${rule.shots}`,
      "เปิดด้วยวัตถุหรือเหตุการณ์ที่จำได้ทันที",
      "แสดงปฏิกิริยาตัวละครให้ชัด",
      "จบด้วยคำถามหรือปมที่พาไปตอนถัดไป",
    ],
    onScreenTexts: [
      CONTENT_DIRECTION_LABELS[request.contentDirection],
      viewerExpectation,
      "ติดตามตอนต่อไป",
    ],
    caption:
      `นี่คือตัวอย่างแนว ${CONTENT_DIRECTION_LABELS[request.contentDirection]} ของเพจ ${subject}\n\nตั้งใจให้ ${viewerExpectation}\n\nถ้าอยากดูเรื่องนี้ต่อ กดติดตามไว้ได้เลย`,
    cta: action,
    ...common,
  };
}

function createFocusedCreatorStageContent(
  stage: CampaignStage,
  request: ResolvedRequest
): StageContent {
  const profile =
    CREATOR_DIRECTION_PROFILES[
      request.contentDirection
    ] || CREATOR_DIRECTION_PROFILES["creator-lifestyle"]!;
  const subject = request.productOrService;
  const audience = request.audience;
  const firstHighlight =
    request.productHighlights[0];
  const secondHighlight =
    request.productHighlights[1] ||
    "มุมที่แตกต่างจากเนื้อหาทั่วไป";
  const expectation =
    request.customerConcerns[0] ||
    AUDIENCE_VALUE_LABELS[request.audienceValue];
  const action = getPrimaryAction(request);

  const common = {
    afterPosting: [
      "ตอบความคิดเห็นที่พูดถึงเนื้อหาหรือผลงานจริงก่อน",
      "จดคำถามและหัวข้อที่ผู้ชมอยากเห็นต่อ",
      "ดูยอดดูจนจบ การบันทึก แชร์ และการเข้าชมโปรไฟล์",
      "นำภาษาที่ผู้ชมใช้จริงไปปรับหัวข้อวันถัดไป",
    ],
    replyExamples: [
      `ขอบคุณครับ มุมนี้เกี่ยวกับ ${subject} โดยตรงเลย`,
      profile.audiencePrompt,
      "จะเก็บข้อเสนอนี้ไว้เป็นหนึ่งในหัวข้อต่อไปครับ",
    ],
    metrics: adaptListToPlanType(
      getMetrics(request.goal),
      request
    ),
  };

  if (stage === "community") {
    return {
      stage: "ชวนชุมชนมีส่วนร่วม",
      title: `${profile.audiencePrompt}`,
      objective:
        "ใช้คำถามที่อยู่ในทิศทางของเพจเพื่อเก็บความต้องการจริงของผู้ชม",
      marketingPrinciple: {
        title: "คำถามต้องต่อยอดผลงาน ไม่เปลี่ยนทิศทางเพจ",
        explanation:
          "คำตอบของผู้ชมควรช่วยเลือกหัวข้อ รีวิว เกม ผลงาน หรือเรื่องต่อไปได้ทันที",
      },
      topic: `คำถามชุมชนเกี่ยวกับ ${subject}`,
      hook: profile.audiencePrompt,
      script:
        `เปิดด้วยตัวอย่างสั้นจาก ${subject} แล้วให้ตัวเลือก A ${firstHighlight} หรือ B ${secondHighlight} จากนั้นถามผู้ชมว่าต้องการเห็นทางไหนต่อ พร้อมบอกว่าจะนำคำตอบไปใช้ในผลงานรอบถัดไปจริง`,
      shotList: [
        "เปิดด้วยตัวอย่างผลงานหรือเหตุการณ์ 1–2 วินาที",
        `ขึ้นตัวเลือก A: ${firstHighlight}`,
        `ขึ้นตัวเลือก B: ${secondHighlight}`,
        "เว้นจังหวะให้ผู้ชมเลือก",
        "ปิดด้วยคำยืนยันว่าจะใช้ผลโหวตต่อยอด",
      ],
      onScreenTexts: [
        "เลือก A หรือ B",
        firstHighlight,
        secondHighlight,
      ],
      caption:
        `${profile.audiencePrompt}\n\nA. ${firstHighlight}\nB. ${secondHighlight}\n\nพิมพ์ตัวเลือกพร้อมเหตุผลได้เลย`,
      cta: "พิมพ์ A หรือ B และติดตามไว้ดูผลงานที่เลือก",
      ...common,
    };
  }

  if (stage === "behind-scenes" || stage === "trust") {
    return {
      stage: "แสดงกระบวนการและความน่าเชื่อถือ",
      title: `เบื้องหลัง ${profile.mainVerb} เรื่อง ${subject}`,
      objective:
        `ทำให้ผู้ชมเห็น ${profile.proofLabel} และเข้าใจคุณภาพของผลงาน`,
      marketingPrinciple: {
        title: "แสดงสิ่งที่ตรวจสอบได้",
        explanation:
          `ความน่าเชื่อถือของทิศทางนี้มาจาก ${profile.proofLabel} ไม่ใช่คำกล่าวอ้างลอย ๆ`,
      },
      topic: `กระบวนการสร้าง ${profile.outputLabel}`,
      hook: `ก่อนเห็นผลงานสุดท้าย นี่คือสิ่งที่ต้องเตรียมจริง`,
      script:
        `เริ่มจากโจทย์ ${subject} เลือกจุดเด่น ${firstHighlight} แล้วแสดงขั้นตอนหรือหลักฐานจริงทีละส่วน ปิดด้วยผลลัพธ์หรือผลงานที่ผู้ชมตรวจสอบได้ โดยไม่พูดเกินข้อมูลที่มี`,
      shotList: [
        "แสดงโจทย์หรือภาพก่อนเริ่ม",
        `แสดงขั้นตอนที่เกี่ยวกับ ${firstHighlight}`,
        `แสดง ${profile.proofLabel}`,
        "แสดงผลงานหรือข้อสรุป",
        "ปิดด้วยคำถามสำหรับผลงานต่อไป",
      ],
      onScreenTexts: [
        "ก่อนเริ่ม",
        firstHighlight,
        profile.proofLabel,
        "ผลงานสุดท้าย",
      ],
      caption:
        `เบื้องหลัง ${profile.mainVerb} เรื่อง ${subject}\n\nจุดที่ให้ความสำคัญคือ ${firstHighlight}\n\n${profile.audiencePrompt}`,
      cta: action,
      ...common,
    };
  }

  if (stage === "comparison" || stage === "objection") {
    return {
      stage: "เปรียบเทียบและตอบข้อสงสัย",
      title: `${firstHighlight} กับ ${secondHighlight} ต่างกันอย่างไร?`,
      objective:
        "ช่วยให้ผู้ชมเข้าใจความแตกต่างด้วยเกณฑ์ที่ชัดและสอดคล้องกับทิศทางเพจ",
      marketingPrinciple: {
        title: "เปรียบเทียบจากเกณฑ์ ไม่ตัดสินแบบลอย ๆ",
        explanation:
          `เนื้อหา ${profile.stageLabel} ควรบอกทั้งเหตุผล ข้อดี และข้อจำกัด`,
      },
      topic: `เปรียบเทียบสองมุมของ ${subject}`,
      hook: `สองแบบนี้ดูคล้ายกัน แต่ให้ประสบการณ์ต่างกันตรงนี้`,
      script:
        `กำหนดเกณฑ์หนึ่งคือ ${firstHighlight} และอีกเกณฑ์คือ ${secondHighlight} แสดงตัวอย่างของแต่ละแบบ แล้วสรุปว่าแบบใดเหมาะกับสถานการณ์ใด โดยไม่บอกว่ามีคำตอบเดียวสำหรับทุกคน`,
      shotList: [
        "ขึ้นเกณฑ์เปรียบเทียบให้ชัด",
        `ตัวอย่างฝั่ง A: ${firstHighlight}`,
        `ตัวอย่างฝั่ง B: ${secondHighlight}`,
        "สรุปข้อดีและข้อจำกัด",
        "ถามผู้ชมว่าตรงกับแบบใด",
      ],
      onScreenTexts: [
        "ต่างกันตรงไหน?",
        firstHighlight,
        secondHighlight,
        "เลือกตามสิ่งที่ต้องการ",
      ],
      caption:
        `${firstHighlight} กับ ${secondHighlight} ให้ผลต่างกันตามเป้าหมาย\n\nคุณเลือกแบบไหน และเพราะอะไร?`,
      cta: "พิมพ์ตัวเลือกและเหตุผลของคุณ",
      ...common,
    };
  }

  if (stage === "action") {
    return {
      stage: "สรุปผลงานและพาไปต่อ",
      title: `สรุป 7 วันของ ${subject} และผลงานต่อไป`,
      objective:
        "รวมสิ่งที่ผู้ชมได้เห็น แล้วบอกชัดว่าควรติดตามหรือมีส่วนร่วมอย่างไร",
      marketingPrinciple: {
        title: "ขอการติดตามหลังส่งมอบคุณค่า",
        explanation:
          "ผู้ชมควรเห็นผลงานและทิศทางชัดก่อน จึงค่อยเชิญให้ติดตามตอนหรือผลงานต่อไป",
      },
      topic: `ผลงานเด่นและหัวข้อต่อไปของ ${subject}`,
      hook: `ถ้าชอบผลงานแบบนี้ เรื่องต่อไปกำลังต่อยอดจากคำตอบของคุณ`,
      script:
        `รวบรวมช่วงเด่น 3 ช่วงจากสัปดาห์นี้ ได้แก่ ${firstHighlight}, ${secondHighlight} และคำตอบของผู้ชม จากนั้นประกาศหัวข้อหรือผลงานต่อไป พร้อมวันหรือเงื่อนไขที่ตรวจสอบได้`,
      shotList: [
        "ตัดช่วงเด่นที่หนึ่ง",
        "ตัดช่วงเด่นที่สอง",
        "แสดงความคิดเห็นหรือผลโหวต",
        "เปิดชื่อผลงานหรือหัวข้อต่อไป",
        "ปิดด้วยคำชวนเดียวที่ชัดเจน",
      ],
      onScreenTexts: [
        "สรุป 7 วัน",
        firstHighlight,
        secondHighlight,
        "ผลงานต่อไป",
      ],
      caption:
        `สัปดาห์นี้ได้ลอง ${profile.mainVerb} เรื่อง ${subject} หลายมุม\n\nผลงานต่อไปจะต่อยอดจากคำตอบของผู้ชม\n\nกดติดตามไว้เพื่อไม่พลาดตอนหรือผลงานใหม่`,
      cta: action,
      ...common,
    };
  }

  return {
    stage: profile.stageLabel,
    title: `${profile.mainVerb}: ${subject} ผ่านมุม ${firstHighlight}`,
    objective:
      `ส่งมอบ ${profile.outputLabel} ที่ผู้ชมดูแล้วเข้าใจทิศทางเพจทันที`,
    marketingPrinciple: {
      title: "ทิศทางคอนเทนต์ต้องคงเส้นคงวา",
      explanation:
        `ทุกส่วนต้องสนับสนุนการ ${profile.mainVerb} ไม่เปลี่ยนไปเป็นคลิปสอนหรือขายแบบอื่นโดยไม่มีเหตุผล`,
    },
    topic: `${profile.mainVerb} เรื่อง ${subject}`,
    hook: `ถ้าสนใจ ${subject} จุดนี้คือส่วนที่ไม่ควรมองข้าม`,
    script:
      `เปิดด้วยตัวอย่างหรือเหตุการณ์จริง แล้ว ${profile.mainVerb} โดยยึด ${firstHighlight} เป็นแกนหลัก เพิ่ม ${secondHighlight} เป็นมุมรอง และปิดด้วยข้อสรุปที่ตรงกับสิ่งที่ผู้ชมคาดหวังเรื่อง ${expectation}`,
    shotList: [
      "เปิดด้วยผลงานหรือเหตุการณ์จริง",
      `แสดงแกนหลัก: ${firstHighlight}`,
      `แสดงมุมเสริม: ${secondHighlight}`,
      `แสดง ${profile.proofLabel}`,
      "ปิดด้วยข้อสรุปและคำถามหนึ่งข้อ",
    ],
    onScreenTexts: [
      CONTENT_DIRECTION_LABELS[request.contentDirection],
      firstHighlight,
      secondHighlight,
      profile.audiencePrompt,
    ],
    caption:
      `${profile.mainVerb} เรื่อง ${subject}\n\nแกนหลัก: ${firstHighlight}\nมุมเสริม: ${secondHighlight}\n\n${profile.audiencePrompt}`,
    cta: action,
    ...common,
  };
}

function createCreatorStageContent(
  stage: CampaignStage,
  request: ResolvedRequest
): StageContent {
  if (
    request.contentDirection === "creator-short-film" ||
    request.contentDirection === "creator-comedy"
  ) {
    return createNarrativeCreatorStageContent(
      stage,
      request
    );
  }

  if (request.contentDirection === "creator-education") {
    return createEducationalCreatorStageContent(
      stage,
      request
    );
  }

  return createFocusedCreatorStageContent(
    stage,
    request
  );
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

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function resolveGenerationNumber(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value as number));
}

function getContentAngle(
  dayNumber: number,
  round: number,
  variationIndex: number
) {
  const index = positiveModulo(
    variationIndex * 5 + round * 3 + dayNumber * 7,
    CONTENT_ANGLES.length
  );

  return CONTENT_ANGLES[index];
}

const CTA_NEXT_ACTIONS = [
  "เลือกหนึ่งข้อที่ตรงกับสถานการณ์ของคุณมากที่สุด",
  "จดหนึ่งคำถามที่ยังต้องการข้อมูลเพิ่ม",
  "ลองทำขั้นตอนแรกแล้วบันทึกผลที่เกิดขึ้น",
  "เปรียบเทียบทางเลือกจากเกณฑ์ในโพสต์หนึ่งจุด",
  "เก็บรายละเอียดที่ต้องตรวจเพิ่มไว้ก่อนตัดสินใจ",
  "ส่งต่อให้คนที่กำลังเจอสถานการณ์ใกล้เคียงกัน",
  "สรุปหนึ่งสิ่งที่จะนำไปทำต่อหลังจบโพสต์นี้",
];

function getVariantCta(
  request: ResolvedRequest,
  originalCta: string,
  round: number,
  variationIndex: number,
  dayNumber: number
) {
  const goalOptions: Record<ContentGoal, string[]> = {
    sell: [
      "ตรวจรายละเอียดให้ครบ แล้วส่งข้อความถามเฉพาะจุดที่ยังไม่แน่ใจ",
      "บันทึกโพสต์นี้ไว้ เปรียบเทียบกับความต้องการของคุณ แล้วค่อยตัดสินใจ",
      "พิมพ์คำว่า “รายละเอียด” หากต้องการดูข้อมูลที่จำเป็นก่อนตัดสินใจ",
      "เปิดดูเงื่อนไข ราคา และวิธีสั่งซื้อให้ครบก่อนดำเนินการ",
    ],
    grow: [
      "ติดตามไว้เพื่อรับหัวข้อถัดไปที่ต่อยอดจากเรื่องนี้",
      "บันทึกโพสต์นี้ไว้ แล้วติดตามเพื่อทำตามแผนตอนต่อไป",
      "ส่งหัวข้อนี้ให้คนที่กำลังเริ่ม และติดตามไว้ดูตัวอย่างเพิ่ม",
      "ติดตามเพจไว้ แล้วเลือกหนึ่งขั้นตอนไปลองทำวันนี้",
    ],
    engagement: [
      "พิมพ์คำตอบของคุณไว้หนึ่งข้อ เพื่อให้เรานำไปต่อยอดเป็นโพสต์ถัดไป",
      "เล่าประสบการณ์สั้น ๆ ว่าคุณเคยเจอกรณีไหน",
      "เลือกข้อที่ตรงกับคุณที่สุด แล้วพิมพ์หมายเลขไว้ใต้โพสต์",
      "ส่งคำถามที่ยังสงสัยไว้ แล้วนำคำถามที่พบบ่อยไปทำเนื้อหาต่อ",
    ],
    trust: [
      "บันทึกโพสต์นี้ไว้ แล้วตรวจข้อมูลตามรายการก่อนตัดสินใจ",
      "ส่งข้อความถามได้เฉพาะจุดที่ต้องการข้อมูลเพิ่ม",
      "ลองใช้เกณฑ์นี้ตรวจด้วยตัวเอง แล้วค่อยเลือกทางที่เหมาะกับคุณ",
      "ติดตามไว้เพื่อดูขั้นตอนและตัวอย่างจริงในโพสต์ถัดไป",
    ],
    promote: [
      "ดูรายละเอียดให้ครบ แล้วส่งข้อความสอบถามเวลาหรือเงื่อนไขที่เหมาะกับคุณ",
      "บันทึกโพสต์นี้ไว้ แล้วติดต่อเมื่อพร้อมดำเนินการ",
      "พิมพ์คำว่า “สนใจ” เพื่อขอรายละเอียดที่จำเป็น",
      "เปิดดูช่องทางติดต่อและเงื่อนไขก่อนจองหรือสอบถาม",
    ],
  };

  const options = goalOptions[request.goal];
  const index = positiveModulo(
    variationIndex + round + dayNumber,
    options.length + 1
  );

  const selectedCta =
    index === options.length
      ? originalCta
      : options[index];
  const nextActionIndex = positiveModulo(
    variationIndex + round + dayNumber - 1,
    CTA_NEXT_ACTIONS.length
  );

  return `${selectedCta}\nขั้นต่อไป: ${CTA_NEXT_ACTIONS[nextActionIndex]}`;
}

function getVariantFollowUpPrompt(
  dayNumber: number,
  round: number,
  variationIndex: number
) {
  const variationGroup = Math.floor(
    variationIndex / CONTENT_ANGLES.length
  );
  const index = positiveModulo(
    variationGroup * 3 + round + dayNumber * 5,
    VARIANT_FOLLOW_UP_PROMPTS.length
  );

  return VARIANT_FOLLOW_UP_PROMPTS[index];
}

function applyContentAngle(
  content: StageContent,
  request: ResolvedRequest,
  dayNumber: number,
  round: number,
  variationIndex: number
): StageContent {
  const angle = getContentAngle(
    dayNumber,
    round,
    variationIndex
  );
  const followUpPrompt = getVariantFollowUpPrompt(
    dayNumber,
    round,
    variationIndex
  );

  return {
    ...content,
    title: `${angle.titlePrefix}: ${content.title}`,
    topic: `${angle.titlePrefix} — ${content.topic}`,
    hook: `${angle.hookPrefix} ${content.hook}`,
    script:
      `${angle.scriptLead}\n\n${content.script}` +
      `\n\n${followUpPrompt}`,
    shotList: [
      angle.shotDirection,
      ...content.shotList,
    ],
    onScreenTexts: [
      angle.onScreenText,
      ...content.onScreenTexts,
    ].slice(0, 6),
    caption:
      `${angle.captionHeading}\n\n${content.caption}` +
      `\n\nสิ่งที่ควรทำต่อ: ${followUpPrompt}`,
    cta: getVariantCta(
      request,
      content.cta,
      round,
      variationIndex,
      dayNumber
    ),
  };
}

const CREATOR_DIRECTION_ANGLES = [
  {
    title: "เปิดมุมหลัก",
    hook: "เริ่มจากสิ่งที่ผู้ชมเห็นแล้วเข้าใจแนวเพจทันที:",
    followUp: "ปิดด้วยคำถามหนึ่งข้อที่ต่อยอดผลงานหรือหัวข้อถัดไป",
  },
  {
    title: "เจาะรายละเอียด",
    hook: "รายละเอียดเล็ก ๆ นี้ทำให้ผลงานต่างจากแบบทั่วไป:",
    followUp: "ชี้ให้เห็นรายละเอียดที่ผู้ชมควรสังเกต โดยยังคงอยู่ในทิศทางของเพจ",
  },
  {
    title: "ให้ผู้ชมเลือก",
    hook: "ถ้าให้เลือกจากสองทางนี้ คุณจะเลือกแบบไหน?",
    followUp: "ให้ตัวเลือกที่ตอบง่ายและนำผลไปใช้กับผลงานต่อไปจริง",
  },
  {
    title: "ทดลองอีกเวอร์ชัน",
    hook: "ลองเปลี่ยนมุมเดียว แล้วประสบการณ์ของผู้ชมจะต่างออกไป:",
    followUp: "แสดงอีกเวอร์ชันที่ยังอยู่ในแนวเดียวกัน แต่ไม่ซ้ำกับผลงานก่อนหน้า",
  },
  {
    title: "เปิดเบื้องหลัง",
    hook: "ก่อนเห็นผลงานสุดท้าย นี่คือสิ่งที่เกิดขึ้นจริง:",
    followUp: "ให้เห็นกระบวนการหรือหลักฐานจริงแบบกระชับ โดยไม่เปลี่ยนเป็นบทเรียนยาว",
  },
  {
    title: "เปรียบเทียบให้ชัด",
    hook: "สองแบบนี้ดูคล้ายกัน แต่ต่างกันตรงจุดสำคัญนี้:",
    followUp: "เปรียบเทียบจากเกณฑ์ที่ตรวจสอบได้และบอกข้อจำกัดของแต่ละแบบ",
  },
  {
    title: "สรุปและพาไปต่อ",
    hook: "จากสิ่งที่ผู้ชมตอบมาตลอดสัปดาห์ นี่คือผลงานหรือหัวข้อต่อไป:",
    followUp: "สรุปสิ่งที่ส่งมอบแล้วจึงค่อยชวนติดตามผลงานต่อไป",
  },
] as const;

function applyCreatorDirectionAngle(
  content: StageContent,
  request: ResolvedRequest,
  dayNumber: number,
  round: number,
  variationIndex: number
): StageContent {
  const angle =
    CREATOR_DIRECTION_ANGLES[
      (dayNumber - 1) % CREATOR_DIRECTION_ANGLES.length
    ];

  return {
    ...content,
    title: `${angle.title}: ${content.title}`,
    topic: `${angle.title} — ${content.topic}`,
    hook: `${angle.hook} ${content.hook}`,
    script: `${content.script}\n\n${angle.followUp}`,
    caption: `${content.caption}\n\nมุมของวันนี้: ${angle.title}`,
    cta: getVariantCta(
      request,
      content.cta,
      round,
      variationIndex,
      dayNumber
    ),
  };
}

function getToneExecutionNote(
  tone: ContentTone
) {
  const notes: Record<ContentTone, string> = {
    friendly:
      "ใช้น้ำเสียงเป็นกันเอง ประโยคสั้น และคำที่คนทั่วไปเข้าใจได้ทันที",
    expert:
      "ใช้น้ำเสียงน่าเชื่อถือ อธิบายเหตุผล และแยกข้อเท็จจริงออกจากความคิดเห็น",
    fun:
      "ใช้น้ำเสียงสนุก มีจังหวะ แต่ห้ามทำให้สารหลักหรือเหตุการณ์ของเรื่องสับสน",
    emotional:
      "เว้นจังหวะให้อารมณ์ทำงาน และอย่ารีบขึ้นคำชวนก่อนฉากสำคัญจบ",
    premium:
      "ใช้ภาษากระชับ เรียบ และหลีกเลี่ยงข้อความบนจอที่มากเกินไป",
    direct:
      "เข้าประเด็นเร็ว ตัดคำเกริ่นที่ไม่จำเป็น และบอกสิ่งที่ต้องทำให้ชัด",
  };

  return `ควบคุมน้ำเสียง: ${notes[tone]}`;
}

function getSupportFocusNote(
  supportNeeds: SupportNeed[]
) {
  return `จุดที่ระบบต้องช่วยเป็นพิเศษ: ${supportNeeds
    .map((need) => SUPPORT_NEED_LABELS[need])
    .join(", ")}`;
}

function createDay(
  dayNumber: number,
  stage: CampaignStage,
  request: ResolvedRequest,
  round: number,
  variationIndex: number
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

  const planTypeContent =
    request.planType === "service"
      ? adaptStageContentToPlanType(
          rawContent,
          request
        )
      : rawContent;

  const isNarrativeCreator =
    request.planType === "creator" &&
    (request.contentDirection === "creator-short-film" ||
      request.contentDirection === "creator-comedy");

  const content = isNarrativeCreator
    ? {
        ...planTypeContent,
        cta: getVariantCta(
          request,
          planTypeContent.cta,
          round,
          variationIndex,
          dayNumber
        ),
      }
    : request.planType === "creator" &&
        request.contentDirection !== "creator-education"
      ? applyCreatorDirectionAngle(
          planTypeContent,
          request,
          dayNumber,
          round,
          variationIndex
        )
      : applyContentAngle(
          planTypeContent,
          request,
          dayNumber,
          round,
          variationIndex
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

    hashtags: adaptListToPlanType(
      buildHashtags(request, stage),
      request
    ),

    preparation: [
      ...adaptListToPlanType(
        buildPreparation(request, format),
        request
      ),
      getToneExecutionNote(request.tone),
      getSupportFocusNote(request.supportNeeds),
    ],

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
  request: PlanRequest,
  options: WeeklyPlanGenerationOptions = {}
): WeeklyContentPlan {
  const resolved = resolveRequest(request);
  const round = Math.max(
    1,
    resolveGenerationNumber(options.round, 1)
  );
  const variationIndex = resolveGenerationNumber(
    options.variationIndex,
    0
  );
  const stages = getStageSequence(
    resolved,
    round,
    variationIndex
  );

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
      `แนว ${CONTENT_DIRECTION_LABELS[resolved.contentDirection]} ` +
      `สำหรับ “${resolved.productOrService}”`,

    planType: resolved.planType,
    contentDirection: resolved.contentDirection,

    productOrService:
      resolved.productOrService,

    productHighlights:
      resolved.productHighlights,

    audience:
      resolved.audience,

    audienceStage:
      resolved.audienceStage,

    audienceValue:
      resolved.audienceValue,

    desiredAction:
      resolved.desiredAction,

    supportNeeds:
      resolved.supportNeeds,

    tone:
      resolved.tone,

    platform:
      resolved.platform,

    goal:
      resolved.goal,

    intensity:
      resolved.intensity,

    weeklyObjective:
      `${adaptTextToPlanType(
        getWeeklyObjective(resolved),
        resolved
      )} คุณค่าหลักที่ต้องส่งมอบคือ “${AUDIENCE_VALUE_LABELS[resolved.audienceValue]}” และคำชวนหลักคือ “${DESIRED_ACTION_LABELS[resolved.desiredAction]}”`,

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
      createDay(
        index + 1,
        stage,
        resolved,
        round,
        variationIndex
      )
    ),
  };
}