import "server-only";

import type { WeeklyContentDay, WeeklyContentPlan } from "../types/weekly-content-plan";
import type { RepeatNoveltyReport } from "../types/creator-order";

export const CURRENT_REPEAT_NOVELTY_VERSION = 1;

const MAX_DAY_SIMILARITY = 0.84;
const MAX_AVERAGE_BEST_SIMILARITY = 0.66;

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("th-TH")
    .replace(/https?:\/\/\S+/gu, " ")
    .replace(/[#*_`>|()[\]{}:;,.!?/\\\-–—]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function segmentWords(value: string) {
  const text = normalize(value);
  if (!text) return new Set<string>();

  try {
    const segmenter = new Intl.Segmenter("th", {
      granularity: "word",
    });
    const tokens = Array.from(segmenter.segment(text))
      .filter((part) => part.isWordLike)
      .map((part) => part.segment.trim())
      .filter((part) => part.length > 1);

    if (tokens.length >= 4) {
      return new Set(tokens);
    }
  } catch {
    // ใช้ character shingles ด้านล่างเป็น fallback
  }

  const compact = text.replace(/\s+/gu, "");
  const shingles = new Set<string>();
  const width = compact.length > 80 ? 4 : 3;

  for (let index = 0; index <= compact.length - width; index += 1) {
    shingles.add(compact.slice(index, index + width));
  }

  return shingles;
}

function jaccard(leftText: string, rightText: string) {
  const left = segmentWords(leftText);
  const right = segmentWords(rightText);

  if (left.size === 0 || right.size === 0) return 0;

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) intersection += 1;
  }

  const union = left.size + right.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function daySimilarity(left: WeeklyContentDay, right: WeeklyContentDay) {
  const conceptSimilarity = jaccard(
    [left.stage, left.title, left.topic, left.hook].join(" "),
    [right.stage, right.title, right.topic, right.hook].join(" ")
  );
  const executionSimilarity = jaccard(
    [left.script, ...left.shotList].join(" "),
    [right.script, ...right.shotList].join(" ")
  );
  const publishingSimilarity = jaccard(
    [left.caption, left.cta, ...left.onScreenTexts].join(" "),
    [right.caption, right.cta, ...right.onScreenTexts].join(" ")
  );
  const sameStructure =
    left.format === right.format &&
    normalize(left.stage) === normalize(right.stage)
      ? 1
      : left.format === right.format
        ? 0.45
        : 0;

  return (
    conceptSimilarity * 0.35 +
    executionSimilarity * 0.4 +
    publishingSimilarity * 0.15 +
    sameStructure * 0.1
  );
}

export function auditRepeatNovelty(
  candidate: WeeklyContentPlan,
  previousPlans: WeeklyContentPlan[]
): RepeatNoveltyReport {
  const historicalDays = previousPlans.flatMap((plan) => plan.days);

  if (historicalDays.length === 0) {
    return {
      version: CURRENT_REPEAT_NOVELTY_VERSION,
      passed: true,
      previousPlansCompared: 0,
      historicalDaysCompared: 0,
      maxDaySimilarity: 0,
      averageBestSimilarity: 0,
      maxDayThreshold: MAX_DAY_SIMILARITY,
      averageThreshold: MAX_AVERAGE_BEST_SIMILARITY,
      message: "สัปดาห์แรก ไม่มีประวัติเดิมให้เปรียบเทียบ",
    };
  }

  const bestMatches = candidate.days.map((day) => {
    let best = 0;

    for (const historicalDay of historicalDays) {
      best = Math.max(best, daySimilarity(day, historicalDay));
    }

    return best;
  });

  const maxDaySimilarity = Math.max(...bestMatches, 0);
  const averageBestSimilarity =
    bestMatches.reduce((sum, value) => sum + value, 0) /
    Math.max(1, bestMatches.length);
  const passed =
    maxDaySimilarity <= MAX_DAY_SIMILARITY &&
    averageBestSimilarity <= MAX_AVERAGE_BEST_SIMILARITY;

  return {
    version: CURRENT_REPEAT_NOVELTY_VERSION,
    passed,
    previousPlansCompared: previousPlans.length,
    historicalDaysCompared: historicalDays.length,
    maxDaySimilarity: Number(maxDaySimilarity.toFixed(3)),
    averageBestSimilarity: Number(averageBestSimilarity.toFixed(3)),
    maxDayThreshold: MAX_DAY_SIMILARITY,
    averageThreshold: MAX_AVERAGE_BEST_SIMILARITY,
    message: passed
      ? "ผ่าน Repeat Novelty Gate: สัปดาห์ใหม่มีมุมและวิธีทำต่างจากประวัติเดิมในระดับที่กำหนด"
      : "ไม่ผ่าน Repeat Novelty Gate: พบแผนรายวันที่คล้ายสัปดาห์เดิมมากเกินไป ระบบต้องสร้างใหม่",
  };
}
