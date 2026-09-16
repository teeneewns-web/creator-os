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
import {
  DIRECTION_QUALITY_MARKERS,
  getRealityLimits,
  inferProductionConstraints,
} from "./reality-playbooks";

export const CURRENT_PLAN_QUALITY_VERSION = 5;
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

function getConstraintSource(request: PlanRequest) {
  return {
    productOrService: request.productOrService || "",
    productHighlights: (request.productHighlights || "")
      .split(/\r?\n|,|;|•|\|/gu)
      .map((item) => item.trim())
      .filter(Boolean),
    audience: request.audience || "",
    customerConcerns: (request.customerConcerns || "")
      .split(/\r?\n|,|;|•|\|/gu)
      .map((item) => item.trim())
      .filter(Boolean),
    creatorChallenge: request.creatorChallenge || "",
    promotionDetails: request.promotionDetails || "",
    prohibitedClaims: request.prohibitedClaims
      .split(/\r?\n|,|;|•|\|/gu)
      .map((item) => item.trim())
      .filter(Boolean),
    capabilities: request.capabilities || [],
  };
}

function isDayReadyToExecute(
  day: WeeklyContentDay,
  request: PlanRequest
) {
  const constraints = inferProductionConstraints(
    getConstraintSource(request)
  );
  const onScreenReady = constraints.noOnScreenText
    ? true
    : hasList(day.onScreenTexts);

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
    onScreenReady &&
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

function getRealityText(plan: WeeklyContentPlan) {
  return plan.days
    .flatMap((day) => [
      day.title,
      day.script,
      ...day.shotList,
      ...day.preparation,
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

  const safetyForms = [
    `ไม่${normalizedPhrase}`,
    `ไม่ ${normalizedPhrase}`,
    `ห้าม${normalizedPhrase}`,
    `ห้าม ${normalizedPhrase}`,
    `อย่า${normalizedPhrase}`,
    `อย่า ${normalizedPhrase}`,
    `ไม่ควร${normalizedPhrase}`,
    `ไม่ควร ${normalizedPhrase}`,
    `หลีกเลี่ยง${normalizedPhrase}`,
    `หลีกเลี่ยง ${normalizedPhrase}`,
  ];

  const stripped = safetyForms.reduce(
    (current, form) => current.replaceAll(form, ""),
    normalizedPlanText
  );

  return stripped.includes(normalizedPhrase);
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
  const requiresFace = [
    "พูดกับกล้อง",
    "ถ่ายหน้าตัวเอง",
    "เห็นหน้าคุณ",
    "ออกหน้ากล้อง",
    "ถ่ายใบหน้า",
  ].some((phrase) => executionText.includes(phrase));

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
    return ["พิมพ์", "ความคิดเห็น", "เล่า", "ตอบ", "เลือก", "คำถาม"];
  }
  if (request.goal === "trust") {
    return ["บันทึก", "ตรวจ", "สอบถาม", "ข้อมูล", "ติดตาม"];
  }
  if (request.goal === "promote") {
    return ["ติดต่อ", "สอบถาม", "จอง", "สนใจ", "รายละเอียด"];
  }
  return ["รายละเอียด", "ตัดสินใจ", "สั่ง", "ราคา", "ส่งข้อความ", "สนใจ"];
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
  const patterns: Array<{ label: string; pattern: RegExp }> = [
    {
      label: "รับประกันผลลัพธ์",
      pattern: /รับประกัน.{0,30}(ยอดขาย|ยอดวิว|ผู้ติดตาม|ผลลัพธ์|เห็นผล)/u,
    },
    {
      label: "การันตีผลลัพธ์",
      pattern: /การันตี.{0,30}(ยอดขาย|ยอดวิว|ผู้ติดตาม|ผลลัพธ์|เห็นผล)/u,
    },
    {
      label: "ผลลัพธ์แน่นอน",
      pattern: /(ยอดขาย|ยอดวิว|ผู้ติดตาม|เห็นผล).{0,20}(แน่นอน|ชัวร์|100%)/u,
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
  if (request.contentDirection) return request.contentDirection;
  if (request.planType === "creator") return "creator-education";
  if (request.planType === "service") return "service-expert";
  return "product-problem-solution";
}

function auditDirectionAlignment(
  plan: WeeklyContentPlan,
  request: PlanRequest
) {
  const expectedDirection = resolveExpectedDirection(request);
  const metadataPassed = plan.contentDirection === expectedDirection;
  const executionText = normalizeText(getExecutionText(plan));
  const markers = DIRECTION_QUALITY_MARKERS[expectedDirection] || [];
  const matchedMarkers = markers.filter((marker) =>
    executionText.includes(normalizeText(marker))
  );
  const markerPassed = matchedMarkers.length >= Math.min(2, markers.length);
  const challenge = normalizeText(request.creatorChallenge || "");
  const challengeLeaked =
    request.planType === "creator" &&
    challenge.length >= 8 &&
    executionText.includes(challenge);

  const passed = metadataPassed && markerPassed && !challengeLeaked;

  if (!metadataPassed) {
    return { passed: false, message: "ชนิดผลงานในแผนไม่ตรงกับทิศทางที่ลูกค้าเลือก" };
  }
  if (challengeLeaked) {
    return { passed: false, message: "ปัญหาของผู้สร้างถูกนำไปใช้เป็นข้อความสำหรับผู้ชมโดยตรง" };
  }
  if (!markerPassed) {
    return { passed: false, message: "องค์ประกอบของผลงานยังไม่ชัดตามทิศทางที่เลือก" };
  }
  return { passed: true, message: "ทิศทางผลงานตรงกับตัวเลือกและมีองค์ประกอบเฉพาะของสายนั้น" };
}

function auditExplicitConstraints(
  plan: WeeklyContentPlan,
  request: PlanRequest
) {
  const constraints = inferProductionConstraints(
    getConstraintSource(request)
  );
  const text = normalizeText(getExecutionText(plan));
  const issues: string[] = [];

  if (constraints.noDialogue) {
    const dialogueMarkers = [
      /ตัวละคร\s*:/u,
      /พูดว่า/u,
      /พูดสั้น/u,
      /กระซิบ/u,
      /บทพูด/u,
      /พากย์/u,
    ];
    if (dialogueMarkers.some((pattern) => pattern.test(text))) {
      issues.push("ยังมีบทพูด/การพากย์ทั้งที่ระบุให้ไม่มีบทพูด");
    }
  }

  if (
    constraints.noOnScreenText &&
    plan.days.some((day) => day.onScreenTexts.length > 0)
  ) {
    issues.push("ยังมีข้อความบนจอทั้งที่ลูกค้าห้ามใช้");
  }

  if (constraints.solo) {
    const soloViolations = [
      "นักแสดง 2",
      "นักแสดง 3",
      "ให้เพื่อน",
      "ผู้ช่วยถือกล้อง",
      "คนที่สอง",
    ];
    if (soloViolations.some((phrase) => text.includes(phrase))) {
      issues.push("มีขั้นตอนที่ต้องใช้คนอื่นทั้งที่ลูกค้าระบุว่าทำคนเดียว");
    }
  }

  if (constraints.minimalGear) {
    const gearMarkers = ["กิมบอล", "ไฟสตูดิโอ", "กล้องสองตัว", "เลนส์เสริม", "ไมค์ไร้สาย"];
    if (gearMarkers.some((phrase) => text.includes(phrase))) {
      issues.push("แผนบังคับใช้อุปกรณ์เพิ่มเติมทั้งที่ทรัพยากรจำกัด");
    }
  }

  return {
    passed: issues.length === 0,
    message:
      issues.length === 0
        ? "ข้อจำกัดสำคัญ เช่น ไม่มีบทพูด ไม่มีข้อความบนจอ ทำคนเดียว และอุปกรณ์จำกัด ถูกเคารพ"
        : issues.join("; "),
  };
}

function auditRealityFeasibility(
  plan: WeeklyContentPlan,
  request: PlanRequest
) {
  const constraints = inferProductionConstraints(
    getConstraintSource(request)
  );
  const limits = getRealityLimits(plan.intensity, constraints);
  const requestMaximum = getMaximumMinutes(request);
  const maximumMinutes = Math.min(limits.maxMinutes, requestMaximum);
  const issues: string[] = [];

  for (const day of plan.days) {
    if (day.estimatedMinutes > maximumMinutes) {
      issues.push(`Day ${day.day} ใช้เวลา ${day.estimatedMinutes} นาที`);
    }
    if (
      ["reel", "video", "live"].includes(day.format) &&
      day.shotList.length > limits.maxShots
    ) {
      issues.push(`Day ${day.day} มี ${day.shotList.length} ช็อต เกินกรอบ ${limits.maxShots}`);
    }
    const sceneMatches = day.script.match(/ฉาก\s*\d+/gu) || [];
    if (sceneMatches.length > limits.maxScenes + 1) {
      issues.push(`Day ${day.day} มีจำนวนฉากมากเกินทรัพยากรที่เลือก`);
    }
  }

  return {
    passed: issues.length === 0,
    message:
      issues.length === 0
        ? `ทุกวันถูกคุมให้อยู่ในกรอบเวลาไม่เกิน ${maximumMinutes} นาที และลดจำนวนช็อต/ฉากตามทรัพยากรจริง`
        : issues.slice(0, 4).join("; "),
  };
}

function auditFormatExecutionMatch(
  plan: WeeklyContentPlan
) {
  const issues: string[] = [];

  for (const day of plan.days) {
    const script = normalizeText(day.script);
    const looksLikeTimedVideo =
      /(?:ช็อต|ฉาก)\s*\d+[^\n]{0,24}\d+\s*[–-]\s*\d+\s*วิ/u.test(script) ||
      /timeline[^\n]{0,30}\d+\s*[–-]\s*\d+\s*วิ/u.test(script);
    const hasMultipleScenes = (script.match(/ฉาก\s*\d+/gu) || []).length >= 2;

    if (
      ["image", "text"].includes(day.format) &&
      (looksLikeTimedVideo || hasMultipleScenes)
    ) {
      issues.push(`Day ${day.day} เป็น ${day.format} แต่สคริปต์ยังเป็นวิดีโอหลายฉาก`);
    }

    if (
      ["reel", "video"].includes(day.format) &&
      day.shotList.length < 2
    ) {
      issues.push(`Day ${day.day} เป็นวิดีโอแต่ลำดับช็อตไม่พอให้ถ่ายตาม`);
    }
  }

  return {
    passed: issues.length === 0,
    message:
      issues.length === 0
        ? "รูปแบบโพสต์ตรงกับวิธีลงมือทำ ไม่มีภาพนิ่งที่ได้รับบทวิดีโอหลายฉาก"
        : issues.slice(0, 4).join("; "),
  };
}

function auditDirectionExecutionDepth(
  plan: WeeklyContentPlan,
  request: PlanRequest
) {
  const direction = resolveExpectedDirection(request);
  const markers = DIRECTION_QUALITY_MARKERS[direction] || [];
  const meaningfulDays = plan.days.filter((day) => {
    const text = normalizeText(
      [day.title, day.objective, day.script, ...day.shotList].join(" ")
    );
    const matches = markers.filter((marker) =>
      text.includes(normalizeText(marker))
    ).length;
    return matches >= 1 && day.shotList.length >= 1 && day.script.length >= 80;
  }).length;

  return {
    passed: meaningfulDays >= 5,
    meaningfulDays,
    message:
      meaningfulDays >= 5
        ? `${meaningfulDays}/7 วันมีวิธีทำและหลักฐานเฉพาะของสาย ${direction} ไม่ใช่คำแนะนำกว้าง ๆ`
        : `มีเพียง ${meaningfulDays}/7 วันที่ลงรายละเอียดเฉพาะของสาย ${direction}`,
  };
}

export function auditPlanQuality(
  plan: WeeklyContentPlan,
  request: PlanRequest,
  options: AuditPlanQualityOptions = {}
): CreatorPlanQualityReport {
  const checks: CreatorPlanQualityCheck[] = [];

  const expectedDays = [1, 2, 3, 4, 5, 6, 7];
  const actualDays = plan.days.map((day) => day.day).sort((a, b) => a - b);
  const structurePassed =
    plan.days.length === 7 &&
    expectedDays.every((day, index) => actualDays[index] === day);
  checks.push(createCheck(
    "seven-day-structure",
    "โครงสร้างครบ 7 วัน",
    true,
    7,
    structurePassed ? 7 : 0,
    structurePassed,
    structurePassed ? "มีแผนครบวันที่ 1–7 โดยไม่มีวันหายหรือวันซ้ำ" : `พบ ${plan.days.length} วัน หรือหมายเลขวันไม่ครบ 1–7`
  ));

  const expectedPlanType = request.planType || "product";
  const expectedPlatform = request.platform || "facebook";
  const expectedGoal = request.goal || "sell";
  const alignmentResults = [
    plan.planType === expectedPlanType,
    plan.platform === expectedPlatform,
    plan.goal === expectedGoal,
    compactText(plan.productOrService) === compactText(request.productOrService),
    compactText(plan.audience) === compactText(request.audience || plan.audience),
    request.audienceStage ? plan.audienceStage === request.audienceStage : true,
    request.audienceValue ? plan.audienceValue === request.audienceValue : true,
    request.desiredAction ? plan.desiredAction === request.desiredAction : true,
    request.tone ? plan.tone === request.tone : true,
    request.supportNeeds?.length
      ? request.supportNeeds.every((need) => plan.supportNeeds.includes(need))
      : true,
  ];
  const alignmentPassedCount = alignmentResults.filter(Boolean).length;
  const alignmentPassed = alignmentPassedCount === alignmentResults.length;
  checks.push(createCheck(
    "request-alignment",
    "ตรงตามข้อมูลที่ลูกค้ากรอก",
    true,
    7,
    ratioScore(alignmentPassedCount, alignmentResults.length, 7),
    alignmentPassed,
    alignmentPassed ? "ประเภท ผู้ชม เป้าหมาย แพลตฟอร์ม และตัวเลือกควบคุมตรงกับคำสั่งซื้อ" : `ข้อมูลตรง ${alignmentPassedCount}/${alignmentResults.length} จุด`
  ));

  const directionAlignment = auditDirectionAlignment(plan, request);
  checks.push(createCheck(
    "content-direction-alignment",
    "ตรงกับทิศทางคอนเทนต์ที่เลือก",
    true,
    6,
    directionAlignment.passed ? 6 : 0,
    directionAlignment.passed,
    directionAlignment.message
  ));

  const readyDays = plan.days.filter((day) => isDayReadyToExecute(day, request)).length;
  const readyPassed = readyDays === 7;
  checks.push(createCheck(
    "ready-to-execute",
    "พร้อมนำไปทำและโพสต์จริง",
    true,
    12,
    ratioScore(readyDays, 7, 12),
    readyPassed,
    readyPassed ? "ทุกวันมีงานพร้อมใช้ ลำดับทำ แคปชัน CTA และงานหลังโพสต์ครบ" : `พร้อมใช้งานครบ ${readyDays}/7 วัน`
  ));

  const uniqueFields = [
    { label: "หัวข้อ", values: plan.days.map((day) => day.topic) },
    { label: "Hook", values: plan.days.map((day) => day.hook) },
    { label: "บท", values: plan.days.map((day) => day.script) },
    { label: "แคปชัน", values: plan.days.map((day) => day.caption) },
    { label: "CTA", values: plan.days.map((day) => day.cta) },
  ];
  const duplicateFields = uniqueFields.filter((field) => uniqueCount(field.values) !== field.values.length);
  const varietyPassed = duplicateFields.length === 0;
  checks.push(createCheck(
    "internal-variety",
    "ไม่ซ้ำกันภายในแผน 7 วัน",
    false,
    6,
    ratioScore(uniqueFields.length - duplicateFields.length, uniqueFields.length, 6),
    varietyPassed,
    varietyPassed ? "หัวข้อ Hook บท และแคปชันไม่ซ้ำแบบตรงกัน" : `พบส่วนที่ซ้ำ: ${duplicateFields.map((field) => field.label).join(", ")}`
  ));

  const capability = auditCapabilityCompliance(plan, request);
  checks.push(createCheck(
    "capability-compliance",
    "ตรงกับสิ่งที่ลูกค้าทำได้",
    true,
    7,
    capability.passed ? 7 : 0,
    capability.passed,
    capability.message
  ));

  const reality = auditRealityFeasibility(plan, request);
  checks.push(createCheck(
    "reality-feasibility",
    "Reality Gate: ทำได้จริงตามเวลาและทรัพยากร",
    true,
    9,
    reality.passed ? 9 : 0,
    reality.passed,
    reality.message
  ));

  const constraints = auditExplicitConstraints(plan, request);
  checks.push(createCheck(
    "explicit-constraints",
    "Constraint Gate: ไม่ฝ่าฝืนข้อจำกัดของลูกค้า",
    true,
    12,
    constraints.passed ? 12 : 0,
    constraints.passed,
    constraints.message
  ));

  const formatMatch = auditFormatExecutionMatch(plan);
  checks.push(createCheck(
    "format-execution-match",
    "รูปแบบโพสต์ตรงกับวิธีทำ",
    true,
    8,
    formatMatch.passed ? 8 : 0,
    formatMatch.passed,
    formatMatch.message
  ));

  const normalizedPlanText = normalizeText(getExecutionText(plan));
  const prohibitedClaims = splitProhibitedClaims(request.prohibitedClaims);
  const matchedClaims = prohibitedClaims.filter((claim) => includesPhrase(normalizedPlanText, claim));
  const prohibitedPassed = matchedClaims.length === 0;
  checks.push(createCheck(
    "prohibited-claims",
    "ไม่ใช้คำหรือข้อกล่าวอ้างที่ลูกค้าห้าม",
    true,
    6,
    prohibitedPassed ? 6 : 0,
    prohibitedPassed,
    prohibitedPassed ? (prohibitedClaims.length ? `ตรวจคำต้องห้าม ${prohibitedClaims.length} รายการแล้ว` : "ลูกค้าไม่ได้ระบุคำต้องห้ามเพิ่มเติม") : `พบข้อความที่ลูกค้าห้าม: ${matchedClaims.slice(0, 3).join(", ")}`
  ));

  const overpromise = findOverpromise(getExecutionText(plan));
  const overpromisePassed = !overpromise;
  checks.push(createCheck(
    "unsupported-promises",
    "ไม่มีคำรับประกันผลลัพธ์เกินจริง",
    true,
    5,
    overpromisePassed ? 5 : 0,
    overpromisePassed,
    overpromisePassed ? "ไม่พบคำรับประกันยอดขาย ยอดวิว ผู้ติดตาม หรือผลลัพธ์แบบแน่นอน" : `พบข้อความเสี่ยง: ${overpromise}`
  ));

  const goalKeywords = getGoalKeywords(request);
  const alignedCtas = plan.days.filter((day) => {
    const cta = normalizeText(day.cta);
    return goalKeywords.some((keyword) => cta.includes(normalizeText(keyword)));
  }).length;
  const ctaPassed = alignedCtas >= 4;
  checks.push(createCheck(
    "goal-cta",
    "CTA สอดคล้องกับเป้าหมาย",
    false,
    4,
    ratioScore(alignedCtas, 7, 4),
    ctaPassed,
    ctaPassed ? `CTA ตรงกับเป้าหมาย ${alignedCtas}/7 วัน` : `CTA ตรงกับเป้าหมายเพียง ${alignedCtas}/7 วัน`
  ));

  const fallbackDays = plan.days.filter(isFallbackReady).length;
  const fallbackPassed = fallbackDays === 7;
  checks.push(createCheck(
    "fallback-content",
    "มีแผนสำรองทุกวัน",
    false,
    4,
    ratioScore(fallbackDays, 7, 4),
    fallbackPassed,
    fallbackPassed ? "ทุกวันมีรูปแบบสำรองพร้อมขั้นตอนทำตาม" : `มีแผนสำรองครบ ${fallbackDays}/7 วัน`
  ));

  const depth = auditDirectionExecutionDepth(plan, request);
  checks.push(createCheck(
    "direction-execution-depth",
    "Playbook เฉพาะสายและลงมือทำได้",
    true,
    7,
    depth.passed ? 7 : ratioScore(depth.meaningfulDays, 7, 7),
    depth.passed,
    depth.message
  ));

  const score = checks.reduce((total, check) => total + check.score, 0);
  const maxScore = checks.reduce((total, check) => total + check.maxScore, 0);
  const normalizedScore = maxScore === 100
    ? score
    : Math.round((score / Math.max(1, maxScore)) * 100);
  const blockingIssues = checks
    .filter((check) => check.critical && !check.passed)
    .map((check) => check.label);
  const passed =
    normalizedScore >= PLAN_QUALITY_THRESHOLD &&
    blockingIssues.length === 0;

  return {
    version: CURRENT_PLAN_QUALITY_VERSION,
    score: normalizedScore,
    threshold: PLAN_QUALITY_THRESHOLD,
    passed,
    checks,
    blockingIssues,
    auditedAt: new Date().toISOString(),
    regenerationAttempts: Math.max(0, Math.floor(options.regenerationAttempts || 0)),
  };
}
