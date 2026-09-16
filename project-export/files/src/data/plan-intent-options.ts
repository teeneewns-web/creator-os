export interface PlanOptionItem {
  id: string;
  value?: string;
  label: string;
  description?: string;
  icon?: string;
}

// 1. หมวดหมู่หลัก (Creator Mode)
export const CREATOR_ARCHETYPES: PlanOptionItem[] = [
  {
    id: "creator",
    value: "creator",
    label: "ครีเอเตอร์ปั้นช่องสร้างตัวตน",
    description: "เน้นเพิ่มผู้ติดตาม ยอดวิว และสร้างเอกลักษณ์เฉพาะตัว",
    icon: "🎯",
  },
  {
    id: "seller",
    value: "seller",
    label: "ร้านค้าขายสินค้า (E-commerce)",
    description: "เน้นโชว์สินค้า รีวิว ตอบข้อกังวล และปิดการขาย",
    icon: "🛍️",
  },
  {
    id: "service",
    value: "service",
    label: "ผู้ให้บริการ / ผู้เชี่ยวชาญ",
    description: "เน้นให้ความรู้ สร้างความน่าเชื่อถือ และดึงคนทักแชท",
    icon: "💼",
  },
];

export const CREATOR_GOALS: PlanOptionItem[] = [
  {
    id: "reach",
    value: "reach",
    label: "เปิดการมองเห็น (ดันยอดวิว)",
    description: "ดึงคนดูใหม่เข้าช่อง เกาะกระแส และเพิ่มการแชร์",
    icon: "🚀",
  },
  {
    id: "engagement",
    value: "engagement",
    label: "สร้างผู้ติดตามและความผูกพัน",
    description: "เน้นให้คนคอมเมนต์ เซฟคลิป และกลับมาดูซ้ำ",
    icon: "🤝",
  },
  {
    id: "authority",
    value: "authority",
    label: "สร้างความน่าเชื่อถือ / ตัวตนชัดเจน",
    description: "ตอบคำถามเชิงลึก แบ่งปันมุมมองเฉพาะทาง",
    icon: "💡",
  },
];

export const CREATOR_PLATFORMS: PlanOptionItem[] = [
  { id: "tiktok", value: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "facebook", value: "facebook", label: "Facebook (Reels / โพสต์เพจ)", icon: "📘" },
  { id: "instagram", value: "instagram", label: "Instagram (Reels)", icon: "📸" },
  { id: "youtube", value: "youtube", label: "YouTube Shorts", icon: "🔴" },
];

export const CREATOR_STYLES: PlanOptionItem[] = [
  {
    id: "educational",
    value: "educational",
    label: "สายให้ความรู้ / ทริกสั้นเข้าใจง่าย",
    description: "How-to สรุปข้อผิดพลาด และเทคนิคทำตามได้ทันที",
    icon: "📚",
  },
  {
    id: "lifestyle",
    value: "lifestyle",
    label: "สายไลฟ์สไตล์ / เบื้องหลัง / เล่าเรื่อง",
    description: "Storytelling แชร์ประสบการณ์ชีวิต หรือการทำงานประจำวัน",
    icon: "☕",
  },
  {
    id: "opinion",
    value: "opinion",
    label: "สายวิเคราะห์ / เกาะกระแส / บันเทิง",
    description: "แชร์ความคิดเห็น สรุปประเด็นร้อน ป้ายยา หรือรีวิว",
    icon: "⚡",
  },
];

export const REALITY_CONSTRAINTS: PlanOptionItem[] = [
  {
    id: "no_face",
    value: "no_face",
    label: "ไม่ออกหน้ากล้อง",
    description: "ใช้ภาพสิ่งของ หน้าจอ กิจกรรม หรือ B-roll ประกอบเสียงพากย์",
    icon: "🚫",
  },
  {
    id: "short_time",
    value: "short_time",
    label: "เวลาน้อย (ไม่เกิน 15-30 นาที/วัน)",
    description: "ขั้นตอนต้องสั้น ถ่ายรอบเดียวจบ ไม่ตัดต่อซับซ้อน",
    icon: "⏱️",
  },
  {
    id: "solo",
    value: "solo",
    label: "ทำคนเดียว ไม่มีทีมช่วย",
    description: "มุมกล้องตั้งนิ่ง ไม่ต้องมีคนช่วยถือกล้อง",
    icon: "👤",
  },
  {
    id: "mobile_only",
    value: "mobile_only",
    label: "มีแค่มือถือเครื่องเดียว",
    description: "ใช้แสงธรรมชาติและไมค์โทรศัพท์ ไม่ต้องใช้อุปกรณ์สตูดิโอ",
    icon: "📱",
  },
];

// 2. ตัวแปรเดิมรองรับระบบเดิม (Legacy Compatibility)
export const AUDIENCE_STAGE_LABELS: Record<string, string> = {
  unaware: "ยังไม่รู้จักปัญหา / เริ่มต้น",
  problem_aware: "รู้ปัญหาแต่ยังไม่รู้วิธีแก้",
  solution_aware: "กำลังมองหาวิธีแก้ / เปรียบเทียบ",
  most_aware: "พร้อมตัดสินใจ / พร้อมลงมือ",
};

export const AUDIENCE_STAGE_OPTIONS = Object.entries(AUDIENCE_STAGE_LABELS).map(
  ([id, label]) => ({ id, value: id, label })
);

export const AUDIENCE_VALUE_LABELS: Record<string, string> = {
  quick_win: "ผลลัพธ์ไว ทำตามง่าย",
  deep_knowledge: "ความรู้เชิงลึก ถูกต้อง",
  inspiration: "แรงบันดาลใจ กำลังใจ",
  entertainment: "ความสนุก ผ่อนคลาย",
  trust: "ความน่าเชื่อถือ มั่นใจได้",
};

export const DESIRED_ACTION_LABELS: Record<string, string> = {
  follow: "กดติดตาม",
  comment: "คอมเมนต์พูดคุย",
  share: "แชร์ต่อ",
  save: "เซฟเก็บไว้ดู",
  inbox: "ทักข้อความ / สอบถาม",
  click_link: "คลิกลิงก์ / สั่งซื้อ",
};

export const SUPPORT_NEED_LABELS: Record<string, string> = {
  hook: "ช่วยคิด Hook เปิดคลิป",
  script: "ช่วยเขียนบทพูดละเอียด",
  angle: "ช่วยวางมุมมองเนื้อหา",
  full_plan: "วางแผนครบทั้งกระบวนการ",
};

export const TONE_LABELS: Record<string, string> = {
  friendly: "เป็นกันเอง สบายๆ",
  expert: "มืออาชีพ น่าเชื่อถือ",
  energetic: "สนุกสนาน มีพลัง",
  empathetic: "เข้าใจ ปลอบโยน",
  direct: "ตรงไปตรงมา ชัดเจน",
};

export const TONE_OPTIONS = Object.entries(TONE_LABELS).map(([id, label]) => ({
  id,
  value: id,
  label,
}));

export function getAudienceValueOptions(..._args: unknown[]) {
  return Object.entries(AUDIENCE_VALUE_LABELS).map(([id, label]) => ({
    id,
    value: id,
    label,
  }));
}

export function getDesiredActionOptions(..._args: unknown[]) {
  return Object.entries(DESIRED_ACTION_LABELS).map(([id, label]) => ({
    id,
    value: id,
    label,
  }));
}

export function getSupportNeedOptions(..._args: unknown[]) {
  return Object.entries(SUPPORT_NEED_LABELS).map(([id, label]) => ({
    id,
    value: id,
    label,
  }));
}
