import type {
  AudienceStage,
  AudienceValue,
  ContentDirection,
  ContentGoal,
  ContentTone,
  DesiredAction,
  PlanType,
  SupportNeed,
} from "../types/plan-request";

export type IntentOption<T extends string> = {
  value: T;
  title: string;
  description: string;
};

export const AUDIENCE_STAGE_OPTIONS: IntentOption<AudienceStage>[] = [
  {
    value: "new",
    title: "ยังไม่รู้จักคุณหรือเพจ",
    description:
      "ต้องหยุดสายตาและทำให้เข้าใจว่าคุณทำอะไรภายในเวลาไม่นาน",
  },
  {
    value: "aware",
    title: "เคยเห็นหรือรู้จักอยู่บ้าง",
    description:
      "ต้องทำให้จำแนวทาง จุดเด่น และเหตุผลที่ควรติดตามต่อ",
  },
  {
    value: "considering",
    title: "สนใจแล้ว แต่ยังลังเล",
    description:
      "ต้องลดข้อสงสัย แสดงหลักฐาน หรือช่วยให้ตัดสินใจง่ายขึ้น",
  },
  {
    value: "existing",
    title: "ติดตามหรือเคยซื้อแล้ว",
    description:
      "เน้นรักษาความสัมพันธ์ สร้างตอนต่อ และชวนกลับมามีส่วนร่วม",
  },
];

const AUDIENCE_VALUE_OPTIONS: IntentOption<AudienceValue>[] = [
  {
    value: "entertain",
    title: "ความบันเทิงและอารมณ์",
    description:
      "ต้องการให้คนดูสนุก ขำ ลุ้น ซึ้ง หรืออยากดูจนจบ",
  },
  {
    value: "learn",
    title: "ความรู้ที่เข้าใจง่าย",
    description:
      "ต้องการให้คนดูเข้าใจเรื่องหนึ่งและนำไปใช้ต่อได้",
  },
  {
    value: "solve",
    title: "วิธีแก้ปัญหาที่ทำตามได้",
    description:
      "ต้องการให้คนดูเห็นขั้นตอนหรือทางออกที่ชัดเจน",
  },
  {
    value: "compare",
    title: "ข้อมูลช่วยเปรียบเทียบและตัดสินใจ",
    description:
      "ต้องการให้คนดูเห็นความแตกต่าง ข้อดี ข้อจำกัด และความเหมาะสม",
  },
  {
    value: "inspire",
    title: "แรงบันดาลใจหรือมุมมองใหม่",
    description:
      "ต้องการให้คนดูรู้สึกเชื่อมโยง เห็นความเป็นไปได้ หรืออยากลองทำ",
  },
  {
    value: "trust",
    title: "ความมั่นใจและความน่าเชื่อถือ",
    description:
      "ต้องการให้คนดูเห็นข้อมูลจริง กระบวนการ หลักฐาน หรือความโปร่งใส",
  },
  {
    value: "participate",
    title: "การมีส่วนร่วมกับเพจหรือเรื่องราว",
    description:
      "ต้องการให้คนดูโหวต แสดงความคิดเห็น หรือช่วยกำหนดเนื้อหาต่อไป",
  },
];

export const DESIRED_ACTION_OPTIONS: IntentOption<DesiredAction>[] = [
  {
    value: "follow",
    title: "กดติดตาม",
    description:
      "เหมาะเมื่อเป้าหมายคือให้คนรอดูผลงานหรือเนื้อหาต่อไป",
  },
  {
    value: "comment",
    title: "แสดงความคิดเห็น",
    description:
      "เหมาะกับคำถาม โหวต ความเห็น หรือการเก็บข้อมูลจากผู้ชม",
  },
  {
    value: "save",
    title: "บันทึกโพสต์",
    description:
      "เหมาะกับข้อมูล ขั้นตอน เช็กลิสต์ หรือสิ่งที่ควรกลับมาดูซ้ำ",
  },
  {
    value: "share",
    title: "แชร์ให้คนอื่น",
    description:
      "เหมาะกับเนื้อหาที่มีประโยชน์ สนุก หรือสะท้อนประสบการณ์ร่วม",
  },
  {
    value: "message",
    title: "ส่งข้อความสอบถาม",
    description:
      "เหมาะกับสินค้าและบริการที่ต้องคุยรายละเอียดก่อนตัดสินใจ",
  },
  {
    value: "click",
    title: "กดดูรายละเอียดหรือลิงก์",
    description:
      "เหมาะเมื่อมีหน้าสินค้า ตะกร้า เว็บไซต์ หรือข้อมูลต่อเนื่อง",
  },
  {
    value: "order",
    title: "สั่งซื้อ",
    description:
      "เหมาะเมื่อข้อมูล ราคา และช่องทางซื้อพร้อมแล้ว",
  },
  {
    value: "book",
    title: "จองคิวหรือใช้บริการ",
    description:
      "เหมาะกับร้าน บริการ ฟรีแลนซ์ และธุรกิจที่มีรอบนัดหมาย",
  },
];

export const SUPPORT_NEED_OPTIONS: IntentOption<SupportNeed>[] = [
  {
    value: "ideas",
    title: "คิดหัวข้อและแนวเรื่อง",
    description:
      "ช่วยหาแกนเรื่อง มุมเล่า หรือไอเดียที่ไม่ซ้ำกันตลอด 7 วัน",
  },
  {
    value: "full-script",
    title: "บทเต็มพร้อมใช้",
    description:
      "ช่วยเขียนเนื้อเรื่อง บทพูด หรือสคริปต์ที่นำไปถ่ายและโพสต์ได้",
  },
  {
    value: "shot-list",
    title: "ลำดับภาพและสิ่งที่ต้องถ่าย",
    description:
      "ช่วยแบ่งช็อต มุมกล้อง การกระทำ และสิ่งที่ต้องเตรียม",
  },
  {
    value: "caption-cta",
    title: "แคปชันและคำชวน",
    description:
      "ช่วยเขียนแคปชัน CTA และตัวอย่างตอบความคิดเห็นให้ตรงเป้าหมาย",
  },
  {
    value: "editing",
    title: "ทำให้งานถ่ายและตัดต่อง่ายขึ้น",
    description:
      "ช่วยลดจำนวนฉาก อุปกรณ์ นักแสดง และขั้นตอนให้เหมาะกับเวลาที่มี",
  },
  {
    value: "schedule",
    title: "จัดลำดับงานและเวลาโพสต์",
    description:
      "ช่วยแบ่งว่าแต่ละวันต้องเตรียม ถ่าย ตัดต่อ หรือโพสต์อะไร",
  },
  {
    value: "sales-angle",
    title: "มุมขายและลดความลังเล",
    description:
      "ช่วยเลือกจุดขาย ข้อกังวล หลักฐาน และคำชวนที่ไม่กล่าวอ้างเกินจริง",
  },
  {
    value: "consistency",
    title: "ทำให้แนวเพจชัดและไม่หลุดทิศทาง",
    description:
      "ช่วยควบคุมธีม น้ำเสียง และความต่อเนื่องของคอนเทนต์ทั้งสัปดาห์",
  },
];

export const TONE_OPTIONS: IntentOption<ContentTone>[] = [
  {
    value: "friendly",
    title: "เป็นกันเอง เข้าใจง่าย",
    description:
      "ใช้ภาษาธรรมชาติ อ่านหรือฟังง่าย และไม่เป็นทางการเกินไป",
  },
  {
    value: "expert",
    title: "น่าเชื่อถือและมีเหตุผล",
    description:
      "เน้นข้อมูล ขั้นตอน เกณฑ์ และคำอธิบายที่ตรวจสอบได้",
  },
  {
    value: "fun",
    title: "สนุกและมีพลัง",
    description:
      "จังหวะไว มีมุกหรือความสดใส แต่ยังคงเข้าใจง่าย",
  },
  {
    value: "emotional",
    title: "อบอุ่นหรือมีอารมณ์ร่วม",
    description:
      "เน้นเรื่องราว ความรู้สึก ความสัมพันธ์ และช่วงพักอารมณ์",
  },
  {
    value: "premium",
    title: "เรียบ ดูดี และพรีเมียม",
    description:
      "ใช้ภาษากระชับ สุภาพ และให้ภาพลักษณ์มีคุณภาพ",
  },
  {
    value: "direct",
    title: "ตรงประเด็นและชัดเจน",
    description:
      "ลดคำเกริ่น เน้นสิ่งสำคัญ วิธีทำ และคำชวนที่เข้าใจทันที",
  },
];

export const AUDIENCE_STAGE_LABELS: Record<AudienceStage, string> =
  Object.fromEntries(
    AUDIENCE_STAGE_OPTIONS.map((option) => [
      option.value,
      option.title,
    ])
  ) as Record<AudienceStage, string>;

export const AUDIENCE_VALUE_LABELS: Record<AudienceValue, string> =
  Object.fromEntries(
    AUDIENCE_VALUE_OPTIONS.map((option) => [
      option.value,
      option.title,
    ])
  ) as Record<AudienceValue, string>;

export const DESIRED_ACTION_LABELS: Record<DesiredAction, string> =
  Object.fromEntries(
    DESIRED_ACTION_OPTIONS.map((option) => [
      option.value,
      option.title,
    ])
  ) as Record<DesiredAction, string>;

export const SUPPORT_NEED_LABELS: Record<SupportNeed, string> =
  Object.fromEntries(
    SUPPORT_NEED_OPTIONS.map((option) => [
      option.value,
      option.title,
    ])
  ) as Record<SupportNeed, string>;

export const TONE_LABELS: Record<ContentTone, string> =
  Object.fromEntries(
    TONE_OPTIONS.map((option) => [
      option.value,
      option.title,
    ])
  ) as Record<ContentTone, string>;

function pickValues<T extends string>(
  options: IntentOption<T>[],
  values: T[]
) {
  const allowed = new Set(values);
  return options.filter((option) => allowed.has(option.value));
}

export function getAudienceValueOptions(
  planType: PlanType | "",
  direction: ContentDirection | ""
): IntentOption<AudienceValue>[] {
  if (planType === "product") {
    return pickValues(AUDIENCE_VALUE_OPTIONS, [
      "solve",
      "compare",
      "trust",
      "inspire",
    ]);
  }

  if (planType === "service") {
    return pickValues(AUDIENCE_VALUE_OPTIONS, [
      "solve",
      "trust",
      "compare",
      "learn",
    ]);
  }

  if (
    direction === "creator-short-film" ||
    direction === "creator-comedy"
  ) {
    return pickValues(AUDIENCE_VALUE_OPTIONS, [
      "entertain",
      "inspire",
      "participate",
    ]);
  }

  if (direction === "creator-education") {
    return pickValues(AUDIENCE_VALUE_OPTIONS, [
      "learn",
      "solve",
      "trust",
    ]);
  }

  if (direction === "creator-review") {
    return pickValues(AUDIENCE_VALUE_OPTIONS, [
      "compare",
      "trust",
      "learn",
    ]);
  }

  if (
    direction === "creator-gaming" ||
    direction === "creator-lifestyle"
  ) {
    return pickValues(AUDIENCE_VALUE_OPTIONS, [
      "entertain",
      "participate",
      "inspire",
    ]);
  }

  return pickValues(AUDIENCE_VALUE_OPTIONS, [
    "inspire",
    "entertain",
    "participate",
    "trust",
  ]);
}

export function getDesiredActionOptions(
  planType: PlanType | "",
  goal: ContentGoal | ""
): IntentOption<DesiredAction>[] {
  if (planType === "creator") {
    const ordered: DesiredAction[] =
      goal === "engagement"
        ? ["comment", "share", "follow", "save", "click"]
        : goal === "promote"
          ? ["click", "follow", "share", "comment", "save"]
          : ["follow", "comment", "share", "save", "click"];

    return pickValues(DESIRED_ACTION_OPTIONS, ordered);
  }

  if (planType === "service") {
    const ordered: DesiredAction[] =
      goal === "sell" || goal === "promote"
        ? ["book", "message", "click", "save", "share"]
        : ["message", "save", "share", "click", "book"];

    return pickValues(DESIRED_ACTION_OPTIONS, ordered);
  }

  const ordered: DesiredAction[] =
    goal === "sell" || goal === "promote"
      ? ["order", "click", "message", "save", "share"]
      : ["save", "share", "click", "message", "order"];

  return pickValues(DESIRED_ACTION_OPTIONS, ordered);
}

export function getSupportNeedOptions(
  planType: PlanType | "",
  direction: ContentDirection | ""
): IntentOption<SupportNeed>[] {
  if (planType === "creator") {
    if (
      direction === "creator-short-film" ||
      direction === "creator-comedy"
    ) {
      return pickValues(SUPPORT_NEED_OPTIONS, [
        "ideas",
        "full-script",
        "shot-list",
        "editing",
        "caption-cta",
        "schedule",
        "consistency",
      ]);
    }

    return pickValues(SUPPORT_NEED_OPTIONS, [
      "ideas",
      "full-script",
      "shot-list",
      "caption-cta",
      "editing",
      "schedule",
      "consistency",
    ]);
  }

  return pickValues(SUPPORT_NEED_OPTIONS, [
    "ideas",
    "full-script",
    "shot-list",
    "caption-cta",
    "sales-angle",
    "editing",
    "schedule",
    "consistency",
  ]);
}
