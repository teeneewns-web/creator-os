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
  rewriteText: string;
  rewriteReason: string;
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

function createRewriteSuggestion(text: string, item: RawHookItem) {
  const cleanText = text.trim();
  const platform = hasText(item.platform) ? item.platform : "โพสต์หรือคลิป";
  const audience = hasText(item.audience) ? item.audience : "คนดู";

  if (!cleanText) {
    return {
      rewriteText:
        "ถ้าคุณกำลังเริ่มทำคอนเทนต์ อย่าข้ามจุดนี้ เพราะอาจเป็นเหตุผลที่ทำให้คนดูเลื่อนผ่านตั้งแต่แรก",
      rewriteReason:
        "เพิ่มปัญหา กลุ่มเป้าหมาย และเหตุผลให้คนรู้สึกว่าข้อความนี้เกี่ยวกับเขา",
    };
  }

  if (cleanText.length < 25) {
    return {
      rewriteText:
        "ถ้าคุณเป็น" +
        audience +
        " อย่าเพิ่งมองข้ามเรื่องนี้ เพราะจุดเล็ก ๆ อาจทำให้ผลลัพธ์ต่างจากเดิมมากกว่าที่คิด",
      rewriteReason:
        "ข้อความเดิมสั้นเกินไป จึงเพิ่มกลุ่มเป้าหมายและเหตุผลให้คนอยากอ่านต่อ",
    };
  }

  if (cleanText.includes("เรื่องนี้")) {
    return {
      rewriteText:
        cleanText.replace("เรื่องนี้", "จุดนี้") +
        " เพราะมันอาจเป็นสาเหตุที่ทำให้คนดูเลื่อนผ่านโดยไม่รู้ตัว",
      rewriteReason:
        "เปลี่ยนคำกว้าง ๆ ให้มีผลลัพธ์หรือความเสี่ยงที่ชัดขึ้น",
    };
  }

  if (cleanText.includes("สิ่งนี้")) {
    return {
      rewriteText:
        cleanText.replace("สิ่งนี้", "จุดนี้") +
        " โดยเฉพาะถ้าคุณอยากให้คอนเทนต์ดูน่าเชื่อถือและใช้งานได้จริง",
      rewriteReason:
        "ลดความกว้างของคำ และเพิ่มประโยชน์ที่คนดูจะได้รับ",
    };
  }

  if (cleanText.includes("ควรรู้")) {
    return {
      rewriteText:
        cleanText.replace("ควรรู้", "ควรเช็กก่อนเริ่ม") +
        " เพื่อไม่ให้เสียเวลาแก้ทีหลัง",
      rewriteReason:
        "ทำให้ Hook มีแรงจูงใจมากขึ้น ไม่ใช่แค่บอกว่าเป็นความรู้ทั่วไป",
    };
  }

  if (cleanText.includes("เคล็ดลับ")) {
    return {
      rewriteText:
        cleanText.replace("เคล็ดลับ", "จุดที่หลายคนมองข้าม") +
        " และอาจเป็นเหตุผลที่ทำให้ผลลัพธ์ต่างจากคนอื่น",
      rewriteReason:
        "คำว่าเคล็ดลับมักกว้างเกินไป จึงเปลี่ยนให้มีมุมปัญหาและความแตกต่าง",
    };
  }

  if (cleanText.includes("สำคัญมาก")) {
    return {
      rewriteText:
        cleanText.replace("สำคัญมาก", "เป็นจุดที่หลายคนพลาดโดยไม่รู้ตัว") +
        " ถ้าแก้ตรงนี้ได้ ผลลัพธ์อาจดีขึ้นทันที",
      rewriteReason:
        "เปลี่ยนภาษาทั่วไปให้มีปัญหาและผลลัพธ์ชัดขึ้น",
    };
  }

  if (cleanText.includes("หลายคน")) {
    return {
      rewriteText:
        cleanText +
        " แต่สิ่งที่น่าสนใจกว่าคือ คนส่วนใหญ่มักไม่รู้ว่าควรแก้จากจุดไหนก่อน",
      rewriteReason:
        "เพิ่มความค้างคาและทำให้คนอยากอ่านต่อหลังประโยคเปิด",
    };
  }

  if (cleanText.includes("ถ้าคุณ")) {
    return {
      rewriteText:
        cleanText +
        " เพราะปัญหาอาจไม่ได้อยู่ที่ความพยายาม แต่อยู่ที่วิธีเริ่มต้น",
      rewriteReason:
        "เพิ่มเหตุผลเชิงลึก ทำให้ Hook มีน้ำหนักมากกว่าเดิม",
    };
  }

  return {
    rewriteText:
      "ก่อนจะใช้ไอเดียนี้กับ" +
      platform +
      " ลองเช็กก่อนว่า Hook นี้ชี้ปัญหาให้คนดูเห็นชัดพอหรือยัง: " +
      cleanText,
    rewriteReason:
      "ข้อความเดิมพอใช้ได้ แต่ควรเพิ่มปัญหา ผลลัพธ์ หรือกลุ่มเป้าหมายให้คมขึ้นก่อนขาย",
  };
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

  const rewrite = createRewriteSuggestion(text, item);

  return {
    id: String(item.id || fallbackId),
    text,
    score,
    level: getLevel(score),
    issues,
    suggestions,
    rewriteText: rewrite.rewriteText,
    rewriteReason: rewrite.rewriteReason,
  };
}