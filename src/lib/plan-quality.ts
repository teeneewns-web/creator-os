import type {
  CreatorPlanQualityCheck,
  CreatorPlanQualityReport,
} from "../types/creator-order";
import type {
  ContentCapability,
  ContentDirection,
  PlanRequest,
} from "../types/plan-request";
import type {
  WeeklyContentDay,
  WeeklyContentPlan,
} from "../types/weekly-content-plan";

export const CURRENT_PLAN_QUALITY_VERSION = 3;
export const PLAN_QUALITY_THRESHOLD = 85;

export type AuditPlanQualityOptions = {
  regenerationAttempts?: number;
};

function normalizeText(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("th-TH")
    .replace(/[“”‘’"'`]/gu, "")
    .replace(/\s+/gu, " ");
}

function compactText(value: string) {
  return normalizeText(value).replace(
    /[^\p{L}\p{N}]+/gu,
    ""
  );
}

function uniqueCount(values: string[]) {
  return new Set(
    values.map(compactText).filter(Boolean)
  ).size;
}

function ratioScore(
  passedItems: number,
  totalItems: number,
  maxScore: number
) {
  if (totalItems <= 0) return 0;

  return Math.round(
    (Math.max(0, Math.min(passedItems, totalItems)) /
      totalItems) *
      maxScore
  );
}

function createCheck(
  id: string,
  label: string,
  critical: boolean,
  maxScore: number,
  score: number,
  passed: boolean,
  message: string
): CreatorPlanQualityCheck {
  return {
    id,
    label,
    critical,
    maxScore,
    score: Math.max(0, Math.min(score, maxScore)),
    passed,
    message,
  };
}

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

function hasList(values: string[] | undefined) {
  return Boolean(
    values?.some((value) => value.trim().length > 0)
  );
}

function isDayReadyToExecute(day: WeeklyContentDay) {
  return (
    hasText(day.stage) &&
    hasText(day.title) &&
    hasText(day.objective) &&
    hasText(day.marketingPrinciple?.title) &&
    hasText(day.marketingPrinciple?.explanation) &&
    hasText(day.publishTime) &&
    Number.isFinite(day.estimatedMinutes) &&
    day.estimatedMinutes > 0 &&
    hasText(day.topic) &&
    hasText(day.hook) &&
    hasText(day.script) &&
    hasList(day.shotList) &&
    hasList(day.onScreenTexts) &&
    hasText(day.caption) &&
    hasText(day.cta) &&
    hasList(day.hashtags) &&
    hasList(day.preparation) &&
    hasList(day.afterPosting) &&
    hasList(day.replyExamples) &&
    hasList(day.metrics)
  );
}

function isFallbackReady(day: WeeklyContentDay) {
  return (
    Boolean(day.fallback?.format) &&
    hasText(day.fallback?.title) &&
    hasList(day.fallback?.instructions)
  );
}

function getPlanText(plan: WeeklyContentPlan) {
  return [
    plan.title,
    plan.productOrService,
    plan.audience,
    plan.weeklyObjective,
    plan.strategyExplanation,
    plan.platformGuidance.title,
    plan.platformGuidance.explanation,
    ...plan.platformGuidance.actions,
    ...plan.platformGuidance.measurements,
    plan.platformGuidance.caution,
    ...plan.days.flatMap((day) => [
      day.stage,
      day.title,
      day.objective,
      day.marketingPrinciple.title,
      day.marketingPrinciple.explanation,
      day.topic,
      day.hook,
      day.script,
      ...day.shotList,
      ...day.onScreenTexts,
      day.caption,
      day.cta,
      ...day.hashtags,
      ...day.preparation,
      day.fallback.title,
      ...day.fallback.instructions,
      day.fallback.caption || "",
      ...day.afterPosting,
      ...day.replyExamples,
      ...day.metrics,
    ]),
  ].join("\n");
}

function getExecutionText(plan: WeeklyContentPlan) {
  return plan.days
    .flatMap((day) => [
      day.title,
      day.topic,
      day.hook,
      day.script,
      day.caption,
      day.cta,
      ...day.onScreenTexts,
      ...day.shotList,
    ])
    .join("\n");
}

function splitProhibitedClaims(value: string) {
  return value
    .split(/\r?\n|,|;|•|\||\//gu)
    .map((item) =>
      normalizeText(item)
        .replace(
          /^(ห้าม|อย่า|ไม่ใช้|ไม่พูด|ไม่เขียน|หลีกเลี่ยง|คำว่า)\s*/gu,
          ""
        )
        .replace(
          /^(บอกว่า|พูดว่า|เขียนว่า|ใช้คำว่า)\s*/gu,
          ""
        )
        .replace(/[.!?。]+$/gu, "")
        .trim()
    )
    .filter((item) => item.length >= 3);
}

function includesPhrase(
  normalizedPlanText: string,
  phrase: string
) {
  const normalizedPhrase = normalizeText(phrase);

  if (!normalizedPhrase) return false;

  return normalizedPlanText.includes(normalizedPhrase);
}

function hasCapability(
  request: PlanRequest,
  capability: ContentCapability
) {
  return request.capabilities.includes(capability);
}

function auditCapabilityCompliance(
  plan: WeeklyContentPlan,
  request: PlanRequest
) {
  const capabilities = request.capabilities;

  if (capabilities.length === 0) {
    return {
      passed: true,
      message: "ระบบใช้รูปแบบสำรองสำหรับผู้ที่ยังไม่ได้ระบุความสามารถ",
    };
  }

  const canProduceVideo =
    hasCapability(request, "film-product") ||
    hasCapability(request, "face-camera") ||
    hasCapability(request, "voice-over");
  const noFace =
    hasCapability(request, "no-face") &&
    !hasCapability(request, "face-camera");
  const imageOnly =
    hasCapability(request, "image-only") &&
    !canProduceVideo;

  const videoDays = plan.days.filter((day) =>
    ["reel", "video", "live"].includes(day.format)
  );

  const executionText = normalizeText(
    getExecutionText(plan)
  );
  const faceRequiredPhrases = [
    "พูดกับกล้อง",
    "ถ่ายหน้าตัวเอง",
    "เห็นหน้าคุณ",
    "ออกหน้ากล้อง",
    "ถ่ายใบหน้า",
  ];
  const narrativeCreator =
    request.planType === "creator" &&
    (request.contentDirection === "creator-short-film" ||
      request.contentDirection === "creator-comedy");

  const requiresFace =
    !narrativeCreator &&
    faceRequiredPhrases.some(
      (phrase) => executionText.includes(phrase)
    );

  if (!canProduceVideo && videoDays.length > 0) {
    return {
      passed: false,
      message: `พบงานวิดีโอ ${videoDays.length} วัน ทั้งที่ลูกค้าไม่ได้เลือกความสามารถทำวิดีโอ`,
    };
  }

  if (imageOnly && videoDays.length > 0) {
    return {
      passed: false,
      message: "แผนมีวิดีโอทั้งที่ลูกค้าเลือกทำได้เฉพาะภาพ",
    };
  }

  if (noFace && requiresFace) {
    return {
      passed: false,
      message: "พบขั้นตอนที่บังคับออกหน้า ทั้งที่ลูกค้าเลือกไม่ออกหน้า",
    };
  }

  return {
    passed: true,
    message: "รูปแบบงานตรงกับความสามารถและเงื่อนไขการออกหน้าของลูกค้า",
  };
}

function getMaximumMinutes(request: PlanRequest) {
  if (request.dailyTime === "10-20") return 20;
  if (request.dailyTime === "30-45") return 45;
  if (request.dailyTime === "60-90") return 90;
  if (request.dailyTime === "90-plus") return 180;

  return 60;
}

function getGoalKeywords(request: PlanRequest) {
  if (request.goal === "grow") {
    return ["ติดตาม", "บันทึก", "ส่งต่อ"];
  }

  if (request.goal === "engagement") {
    return [
      "พิมพ์",
      "ความคิดเห็น",
      "เล่า",
      "ตอบ",
      "เลือกข้อ",
      "คำถาม",
    ];
  }

  if (request.goal === "trust") {
    return [
      "บันทึก",
      "ตรวจ",
      "สอบถาม",
      "ข้อมูล",
      "ติดตาม",
    ];
  }

  if (request.goal === "promote") {
    return [
      "ติดต่อ",
      "สอบถาม",
      "จอง",
      "สนใจ",
      "รายละเอียด",
    ];
  }

  return [
    "รายละเอียด",
    "ตัดสินใจ",
    "สั่งซื้อ",
    "ราคา",
    "ส่งข้อความ",
    "สนใจ",
  ];
}

function removeSafetyNegations(value: string) {
  return normalizeText(value)
    .replace(/ไม่รับประกัน/gu, "")
    .replace(/ไม่มี[^\n.]{0,30}รับประกัน/gu, "")
    .replace(/อย่ารับประกัน/gu, "")
    .replace(/ห้ามรับประกัน/gu, "")
    .replace(/ไม่ควรรับประกัน/gu, "")
    .replace(/ไม่กล่าวอ้าง/gu, "")
    .replace(/หลีกเลี่ยงการกล่าวอ้าง/gu, "");
}

function findOverpromise(value: string) {
  const normalized = removeSafetyNegations(value);
  const patterns: Array<{
    label: string;
    pattern: RegExp;
  }> = [
    {
      label: "รับประกันผลลัพธ์",
      pattern:
        /รับประกัน.{0,30}(ยอดขาย|ยอดวิว|ผู้ติดตาม|ผลลัพธ์|เห็นผล)/u,
    },
    {
      label: "การันตีผลลัพธ์",
      pattern:
        /การันตี.{0,30}(ยอดขาย|ยอดวิว|ผู้ติดตาม|ผลลัพธ์|เห็นผล)/u,
    },
    {
      label: "ผลลัพธ์แน่นอน",
      pattern:
        /(ยอดขาย|ยอดวิว|ผู้ติดตาม|เห็นผล).{0,20}(แน่นอน|ชัวร์|100%)/u,
    },
    {
      label: "คำกล่าวอ้างอันดับหนึ่ง",
      pattern: /(ดีที่สุดในโลก|อันดับ\s*1\s*แน่นอน)/u,
    },
  ];

  return patterns.find((item) =>
    item.pattern.test(normalized)
  )?.label;
}


function resolveExpectedDirection(
  request: PlanRequest
): ContentDirection {
  if (request.contentDirection) {
    return request.contentDirection;
  }

  if (request.planType === "creator") {
    return "creator-education";
  }

  if (request.planType === "service") {
    return "service-expert";
  }

  return "product-problem-solution";
}

function auditDirectionAlignment(
  plan: WeeklyContentPlan,
  request: PlanRequest
) {
  const expectedDirection =
    resolveExpectedDirection(request);
  const metadataPassed =
    plan.contentDirection === expectedDirection;

  if (request.planType !== "creator") {
    return {
      passed: metadataPassed,
      message: metadataPassed
        ? "ทิศทางคอนเทนต์ในแผนตรงกับตัวเลือกของลูกค้า"
        : "ทิศทางคอนเทนต์ในแผนไม่ตรงกับตัวเลือกของลูกค้า",
    };
  }

  const executionText = normalizeText(
    getExecutionText(plan)
  );

  const markerGroups: Partial<
    Record<ContentDirection, string[]>
  > = {
    "creator-short-film": [
      "ฉาก",
      "ตัวละคร",
      "บทพูด",
      "ตอนจบ",
      "ตอนต่อ",
      "หักมุม",
    ],
    "creator-comedy": [
      "ฉาก",
      "ตัวละคร",
      "มุก",
      "จังหวะ",
      "ตอนจบ",
    ],
    "creator-education": [
      "วิธี",
      "ขั้นตอน",
      "ข้อ",
      "ทำตาม",
      "อธิบาย",
    ],
    "creator-review": [
      "รีวิว",
      "เปรียบเทียบ",
      "เกณฑ์",
      "ข้อดี",
      "ข้อจำกัด",
    ],
    "creator-story": [
      "เรื่อง",
      "ประสบการณ์",
      "เหตุการณ์",
      "บทเรียน",
      "เส้นทาง",
    ],
    "creator-gaming": [
      "เกม",
      "เล่น",
      "ภารกิจ",
      "ไฮไลต์",
      "ชาเลนจ์",
    ],
    "creator-art": [
      "ผลงาน",
      "กระบวนการ",
      "เบื้องหลัง",
      "การแสดง",
      "สร้างสรรค์",
    ],
    "creator-lifestyle": [
      "ชีวิต",
      "กิจวัตร",
      "สถานการณ์จริง",
      "ชุมชน",
      "ประจำวัน",
    ],
  };

  const markers =
    markerGroups[expectedDirection] || [];
  const matchedMarkers = markers.filter(
    (marker) =>
      executionText.includes(normalizeText(marker))
  );
  const markerPassed =
    markers.length === 0 ||
    matchedMarkers.length >= 2;

  const challenge = normalizeText(
    request.creatorChallenge || ""
  );
  const challengeLeaked =
    challenge.length >= 4 &&
    executionText.includes(challenge);

  const passed =
    metadataPassed &&
    markerPassed &&
    !challengeLeaked;

  if (!metadataPassed) {
    return {
      passed: false,
      message:
        "ชนิดผลงานในแผนไม่ตรงกับทิศทางที่ครีเอเตอร์เลือก",
    };
  }

  if (challengeLeaked) {
    return {
      passed: false,
      message:
        "พบว่าปัญหาของผู้สร้างถูกนำไปใช้เป็นข้อความสำหรับผู้ชม ต้องสร้างแผนใหม่",
    };
  }

  if (!markerPassed) {
    return {
      passed: false,
      message:
        "องค์ประกอบของผลงานยังไม่ชัดตามทิศทางที่เลือก",
    };
  }

  return {
    passed: true,
    message:
      "ผลงานตรงกับทิศทางครีเอเตอร์ และแยกโจทย์ของผู้สร้างออกจากความสนใจของผู้ชมแล้ว",
  };
}

export function auditPlanQuality(
  plan: WeeklyContentPlan,
  request: PlanRequest,
  options: AuditPlanQualityOptions = {}
): CreatorPlanQualityReport {
  const checks: CreatorPlanQualityCheck[] = [];

  const expectedDays = [1, 2, 3, 4, 5, 6, 7];
  const actualDays = plan.days
    .map((day) => day.day)
    .sort((a, b) => a - b);
  const structurePassed =
    plan.days.length === 7 &&
    expectedDays.every(
      (day, index) => actualDays[index] === day
    );

  checks.push(
    createCheck(
      "seven-day-structure",
      "โครงสร้างครบ 7 วัน",
      true,
      10,
      structurePassed ? 10 : 0,
      structurePassed,
      structurePassed
        ? "มีแผนครบวันที่ 1–7 โดยไม่มีวันหายหรือวันซ้ำ"
        : `พบ ${plan.days.length} วัน หรือหมายเลขวันไม่ครบ 1–7`
    )
  );

  const expectedPlanType = request.planType || "product";
  const expectedPlatform = request.platform || "facebook";
  const expectedGoal = request.goal || "sell";
  const alignmentResults = [
    plan.planType === expectedPlanType,
    plan.platform === expectedPlatform,
    plan.goal === expectedGoal,
    compactText(plan.productOrService) ===
      compactText(request.productOrService),
    compactText(plan.audience) ===
      compactText(request.audience || plan.audience),
    request.audienceStage
      ? plan.audienceStage === request.audienceStage
      : true,
    request.audienceValue
      ? plan.audienceValue === request.audienceValue
      : true,
    request.desiredAction
      ? plan.desiredAction === request.desiredAction
      : true,
    request.tone
      ? plan.tone === request.tone
      : true,
    Array.isArray(request.supportNeeds) &&
    request.supportNeeds.length > 0
      ? request.supportNeeds.every((need) =>
          plan.supportNeeds.includes(need)
        )
      : true,
  ];
  const alignmentPassedCount = alignmentResults.filter(
    Boolean
  ).length;
  const alignmentPassed =
    alignmentPassedCount === alignmentResults.length;

  checks.push(
    createCheck(
      "request-alignment",
      "ตรงตามข้อมูลที่ลูกค้ากรอก",
      true,
      8,
      ratioScore(
        alignmentPassedCount,
        alignmentResults.length,
        8
      ),
      alignmentPassed,
      alignmentPassed
        ? "ประเภท ทิศทาง ผู้ชม คุณค่าที่ต้องส่งมอบ คำชวน น้ำเสียง แพลตฟอร์ม และเป้าหมายตรงกับคำสั่งซื้อ"
        : `ข้อมูลตรง ${alignmentPassedCount}/${alignmentResults.length} จุด ต้องสร้างแผนใหม่`
    )
  );

  const directionAlignment =
    auditDirectionAlignment(plan, request);

  checks.push(
    createCheck(
      "content-direction-alignment",
      "ตรงกับทิศทางคอนเทนต์ที่เลือก",
      true,
      8,
      directionAlignment.passed ? 8 : 0,
      directionAlignment.passed,
      directionAlignment.message
    )
  );

  const readyDays = plan.days.filter(
    isDayReadyToExecute
  ).length;
  const readyPassed = readyDays === 7;

  checks.push(
    createCheck(
      "ready-to-execute",
      "พร้อมนำไปทำและโพสต์จริง",
      true,
      18,
      ratioScore(readyDays, 7, 18),
      readyPassed,
      readyPassed
        ? "ทุกวันมีหัวข้อ Hook บทพูด ช็อต ข้อความบนจอ แคปชัน CTA เวลาโพสต์ และงานหลังโพสต์ครบ"
        : `พร้อมใช้งานครบ ${readyDays}/7 วัน`
    )
  );

  const uniqueFields = [
    {
      label: "หัวข้อ",
      values: plan.days.map((day) => day.topic),
    },
    {
      label: "Hook",
      values: plan.days.map((day) => day.hook),
    },
    {
      label: "บทพูด",
      values: plan.days.map((day) => day.script),
    },
    {
      label: "แคปชัน",
      values: plan.days.map((day) => day.caption),
    },
    {
      label: "CTA",
      values: plan.days.map((day) => day.cta),
    },
  ];
  const duplicateFields = uniqueFields.filter(
    (field) =>
      uniqueCount(field.values) !== field.values.length
  );
  const varietyPassed = duplicateFields.length === 0;
  const varietyScore = ratioScore(
    uniqueFields.length - duplicateFields.length,
    uniqueFields.length,
    10
  );

  checks.push(
    createCheck(
      "internal-variety",
      "ไม่ซ้ำกันภายในแผน 7 วัน",
      false,
      10,
      varietyScore,
      varietyPassed,
      varietyPassed
        ? "หัวข้อ Hook บทพูด แคปชัน และ CTA ไม่ซ้ำกันแบบตรงกัน"
        : `พบส่วนที่ซ้ำ: ${duplicateFields
            .map((field) => field.label)
            .join(", ")}`
    )
  );

  const capability = auditCapabilityCompliance(
    plan,
    request
  );

  checks.push(
    createCheck(
      "capability-compliance",
      "ตรงกับสิ่งที่ลูกค้าทำได้",
      true,
      10,
      capability.passed ? 10 : 0,
      capability.passed,
      capability.message
    )
  );

  const maximumMinutes = getMaximumMinutes(request);
  const overTimeDays = plan.days.filter(
    (day) => day.estimatedMinutes > maximumMinutes
  );
  const timePassed = overTimeDays.length === 0;

  checks.push(
    createCheck(
      "time-fit",
      "ทำได้ภายในเวลาที่ลูกค้าเลือก",
      false,
      8,
      ratioScore(7 - overTimeDays.length, 7, 8),
      timePassed,
      timePassed
        ? `ทุกวันใช้เวลาไม่เกินกรอบประมาณ ${maximumMinutes} นาที`
        : `มี ${overTimeDays.length} วันที่ใช้เวลามากกว่ากรอบที่กำหนด`
    )
  );

  const normalizedPlanText = normalizeText(
    getExecutionText(plan)
  );
  const prohibitedClaims = splitProhibitedClaims(
    request.prohibitedClaims
  );
  const matchedClaims = prohibitedClaims.filter(
    (claim) =>
      includesPhrase(normalizedPlanText, claim)
  );
  const prohibitedPassed = matchedClaims.length === 0;

  checks.push(
    createCheck(
      "prohibited-claims",
      "ไม่ใช้คำหรือข้อกล่าวอ้างที่ลูกค้าห้าม",
      true,
      10,
      prohibitedPassed ? 10 : 0,
      prohibitedPassed,
      prohibitedPassed
        ? prohibitedClaims.length > 0
          ? `ตรวจคำต้องห้าม ${prohibitedClaims.length} รายการแล้ว ไม่พบในแผน`
          : "ลูกค้าไม่ได้ระบุคำต้องห้ามเพิ่มเติม"
        : `พบข้อความที่ลูกค้าห้าม: ${matchedClaims
            .slice(0, 3)
            .join(", ")}`
    )
  );

  const overpromise = findOverpromise(
    getExecutionText(plan)
  );
  const overpromisePassed = !overpromise;

  checks.push(
    createCheck(
      "unsupported-promises",
      "ไม่มีคำรับประกันผลลัพธ์เกินจริง",
      true,
      6,
      overpromisePassed ? 6 : 0,
      overpromisePassed,
      overpromisePassed
        ? "ไม่พบคำรับประกันยอดขาย ยอดวิว ผู้ติดตาม หรือผลลัพธ์แบบแน่นอน"
        : `พบข้อความเสี่ยง: ${overpromise}`
    )
  );

  const goalKeywords = getGoalKeywords(request);
  const alignedCtas = plan.days.filter((day) => {
    const cta = normalizeText(day.cta);

    return goalKeywords.some((keyword) =>
      cta.includes(normalizeText(keyword))
    );
  }).length;
  const ctaPassed = alignedCtas >= 4;

  checks.push(
    createCheck(
      "goal-cta",
      "CTA สอดคล้องกับเป้าหมาย",
      false,
      6,
      ratioScore(alignedCtas, 7, 6),
      ctaPassed,
      ctaPassed
        ? `CTA ตรงกับเป้าหมายอย่างน้อย ${alignedCtas}/7 วัน`
        : `CTA ตรงกับเป้าหมายเพียง ${alignedCtas}/7 วัน`
    )
  );

  const fallbackDays = plan.days.filter(
    isFallbackReady
  ).length;
  const fallbackPassed = fallbackDays === 7;

  checks.push(
    createCheck(
      "fallback-content",
      "มีแผนสำรองทุกวัน",
      false,
      6,
      ratioScore(fallbackDays, 7, 6),
      fallbackPassed,
      fallbackPassed
        ? "ทุกวันมีรูปแบบสำรองพร้อมขั้นตอนทำตาม"
        : `มีแผนสำรองครบ ${fallbackDays}/7 วัน`
    )
  );

  const score = checks.reduce(
    (total, check) => total + check.score,
    0
  );
  const blockingIssues = checks
    .filter((check) => check.critical && !check.passed)
    .map((check) => check.label);
  const passed =
    score >= PLAN_QUALITY_THRESHOLD &&
    blockingIssues.length === 0;

  return {
    version: CURRENT_PLAN_QUALITY_VERSION,
    score,
    threshold: PLAN_QUALITY_THRESHOLD,
    passed,
    checks,
    blockingIssues,
    auditedAt: new Date().toISOString(),
    regenerationAttempts: Math.max(
      0,
      Math.floor(options.regenerationAttempts || 0)
    ),
  };
}
