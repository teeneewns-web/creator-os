export type RawHookItem = {
  id?: number | string;
  text?: string;
  hook?: string;
  title?: string;
  type?: string;
  angle?: string;
  emotion?: string;
  platform?: string;
  audience?: string;
  level?: string;
  useCase?: string;
  language?: string;
};

export type HookQualityLevel =
  | "premium-ready"
  | "pro"
  | "free"
  | "needs-rewrite";

export type HookQualityAudit = {
  id: string;
  text: string;
  score: number;
  level: HookQualityLevel;
  issues: string[];
  suggestions: string[];
};

function getHookText(item: RawHookItem) {
  return item.text || item.hook || item.title || "";
}

function hasText(value: string | undefined) {
  return typeof value === "string" && value.trim() !== "";
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function getLevel(score: number): HookQualityLevel {
  if (score >= 80) return "premium-ready";
  if (score >= 60) return "pro";
  if (score >= 40) return "free";

  return "needs-rewrite";
}

export function getQualityLevelLabel(level: HookQualityLevel) {
  if (level === "premium-ready") return "Premium-ready";
  if (level === "pro") return "Pro";
  if (level === "free") return "Free";

  return "Needs rewrite";
}

export function auditHookQuality(
  item: RawHookItem,
  fallbackId: number
): HookQualityAudit {
  const text = getHookText(item).trim();
  const issues: string[] = [];
  const suggestions: string[] = [];

  let score = 0;

  if (text.length >= 35 && text.length <= 130) {
    score += 25;
  } else if (text.length >= 20) {
    score += 15;
    issues.push("ความยาวยังไม่พอดีสำหรับใช้ขาย");
    suggestions.push("ปรับให้ชัดขึ้นใน 1 ประโยค ไม่สั้นหรือยาวเกินไป");
  } else {
    issues.push("ข้อความสั้นหรือบางเกินไป");
    suggestions.push("เพิ่มปัญหา กลุ่มเป้าหมาย หรือผลลัพธ์ที่คนดูจะได้รับ");
  }

  const strongAngleWords = [
    "หลายคน",
    "ถ้าคุณ",
    "ก่อน",
    "อย่า",
    "ทำไม",
    "วิธี",
    "ปัญหา",
    "ผิด",
    "พลาด",
    "ลอง",
    "จริง ๆ",
    "ไม่ใช่",
    "แต่",
  ];

  if (includesAny(text, strongAngleWords)) {
    score += 20;
  } else {
    issues.push("มุมเปิดยังไม่คมพอ");
    suggestions.push("เพิ่มมุม เช่น เตือนข้อผิดพลาด สร้างความสงสัย หรือเจาะปัญหาคนดู");
  }

  if (text.includes("คุณ") || text.includes("คนที่") || text.includes("มือใหม่")) {
    score += 10;
  } else {
    issues.push("ยังไม่ชัดว่าพูดกับใคร");
    suggestions.push("เพิ่มกลุ่มเป้าหมาย เช่น มือใหม่ เจ้าของร้าน Creator หรือคนทำเพจ");
  }

  if (hasText(item.type)) score += 8;
  if (hasText(item.emotion)) score += 8;
  if (hasText(item.platform)) score += 8;
  if (hasText(item.language)) score += 6;
  if (hasText(item.angle)) score += 8;
  if (hasText(item.audience)) score += 8;
  if (hasText(item.useCase)) score += 8;

  const hasBasicTags =
    hasText(item.type) &&
    hasText(item.emotion) &&
    hasText(item.platform) &&
    hasText(item.language);

  if (!hasBasicTags) {
    issues.push("tag ยังไม่ครบ");
    suggestions.push("ควรมี type, emotion, platform และ language เพื่อค้นหาและจัดแพ็กขาย");
  }

  const genericWords = ["เรื่องนี้", "สิ่งนี้", "แบบนี้", "เคล็ดลับ", "บางอย่าง"];

  if (includesAny(text, genericWords) && text.length < 60) {
    score -= 10;
    issues.push("ข้อความยังดูกว้างเกินไป");
    suggestions.push("เปลี่ยนคำกว้าง ๆ ให้เป็นปัญหาหรือสถานการณ์จริง");
  }

  if (text.includes("สำคัญมาก") || text.includes("ควรรู้")) {
    score -= 5;
    issues.push("ภาษายังดูทั่วไป");
    suggestions.push("เปลี่ยนให้เฉพาะเจาะจงกว่านี้ว่าคนดูจะได้อะไรหรือพลาดอะไร");
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    id: String(item.id || fallbackId),
    text,
    score,
    level: getLevel(score),
    issues,
    suggestions,
  };
}