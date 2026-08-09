"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import CopyButton from "../../../components/dashboard/CopyButton";
import RevisionRequestCard from "../../../components/dashboard/RevisionRequestCard";
import { facebookBagSamplePlan } from "../../../data/weekly-plans/facebook-bag-sample";
import {
  AUDIENCE_STAGE_LABELS,
  AUDIENCE_VALUE_LABELS,
  DESIRED_ACTION_LABELS,
  SUPPORT_NEED_LABELS,
  TONE_LABELS,
} from "../../../data/plan-intent-options";

import type {
  ContentGoal,
  ContentPlatform,
  ContentTaskStatus,
  PlanIntensity,
  WeeklyContentDay,
  WeeklyContentPlan,
} from "../../../types/weekly-content-plan";

import { generateWeeklyContentPlan } from "../../../lib/generate-weekly-content-plan";
import type { ContentDirection, PlanRequest, PlanType } from "../../../types/plan-request";
import type {
  CreatorPlanQualityReport,
  CreatorRevisionRequest,
  RepeatNoveltyReport,
} from "../../../types/creator-order";

type FacebookMission = {
  id: string;
  title: string;
  completed: number;
  target: number;
};

type SystemFacebookMission = {
  id: string;
  title: string;
  target: number;
  reason: string;
};

type WeeklyPageState = {
  selectedDay: number;
  statuses: Record<string, ContentTaskStatus>;
  notes: Record<string, string>;
  facebookMissions: FacebookMission[];
};

type PlanAccessState =
  | "loading"
  | "approved"
  | "pending"
  | "locked"
  | "error";

type OrderStatusResponse = {
  ok: boolean;
  status?:
    | "pending"
    | "payment-submitted"
    | "review-ready"
    | "approved";
  request?: PlanRequest | null;
  plan?: WeeklyContentPlan | null;
  planRound?: number | null;
  qualityReport?: CreatorPlanQualityReport | null;
  repeatNoveltyReport?: RepeatNoveltyReport | null;
  revisionRequest?: CreatorRevisionRequest | null;
  revisionUsedAt?: string | null;
  message?: string;
};

const REQUEST_STORAGE_KEY = "creator-os-plan-request-v1";
const STATE_STORAGE_PREFIX = "creator-os-weekly-plan-state";


const PLATFORM_LABELS: Record<ContentPlatform, string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  "facebook-and-tiktok": "Facebook และ TikTok",
};

const GOAL_LABELS: Record<ContentGoal, string> = {
  sell: "ขายสินค้า",
  grow: "เพิ่มผู้ติดตาม",
  engagement: "เพิ่มการมีส่วนร่วม",
  trust: "สร้างความน่าเชื่อถือ",
  promote: "โปรโมตร้านหรือบริการ",
};

const INTENSITY_LABELS: Record<PlanIntensity, string> = {
  light: "แผนเบา",
  standard: "แผนมาตรฐาน",
  growth: "แผนเต็ม",
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

type WeeklyPlanCopy = {
  subject: string;
  audience: string;
  highlights: string;
};

function getWeeklyPlanCopy(
  planType: PlanType
): WeeklyPlanCopy {
  if (planType === "service") {
    return {
      subject: "บริการหรือร้าน",
      audience: "กลุ่มลูกค้า",
      highlights: "จุดเด่นหรือขั้นตอนบริการที่ใช้ในแผน",
    };
  }

  if (planType === "creator") {
    return {
      subject: "หัวข้อเพจหรือคอนเทนต์",
      audience: "กลุ่มผู้ชม",
      highlights: "จุดเด่น ประสบการณ์ หรือแนวทางที่ใช้ในแผน",
    };
  }

  return {
    subject: "สินค้า",
    audience: "กลุ่มลูกค้า",
    highlights: "จุดเด่นสินค้าที่ใช้ในแผน",
  };
}

function getGoalLabel(
  goal: ContentGoal,
  planType: PlanType
) {
  if (goal === "sell" && planType === "service") {
    return "เพิ่มยอดสอบถามหรือยอดจอง";
  }

  if (goal === "sell" && planType === "creator") {
    return "เปลี่ยนผู้ชมเป็นผู้ติดตามหรือลูกค้า";
  }

  if (goal === "promote" && planType === "creator") {
    return "โปรโมตเพจ ผลงาน หรือข้อเสนอ";
  }

  return GOAL_LABELS[goal];
}

function getStateStorageKey(planId: string) {
  return `${STATE_STORAGE_PREFIX}:${planId}`;
}

function readPlanRequest(): PlanRequest | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(
    REQUEST_STORAGE_KEY
  );

  if (!raw) {
    return null;
  }

  try {
    const request = JSON.parse(raw) as PlanRequest;

    if (
      !request.productOrService?.trim() ||
      !request.goal ||
      !request.platform
    ) {
      return null;
    }

    return request;
  } catch {
    return null;
  }
}

const STATUS_OPTIONS: Array<{
  value: ContentTaskStatus;
  label: string;
  progress: number;
}> = [
  {
    value: "not-started",
    label: "ยังไม่เริ่ม",
    progress: 0,
  },
  {
    value: "preparing",
    label: "กำลังเตรียม",
    progress: 20,
  },
  {
    value: "ready-to-film",
    label: "พร้อมถ่าย",
    progress: 40,
  },
  {
    value: "filmed",
    label: "ถ่ายแล้ว",
    progress: 55,
  },
  {
    value: "editing",
    label: "กำลังตัดต่อ",
    progress: 70,
  },
  {
    value: "ready-to-post",
    label: "พร้อมโพสต์",
    progress: 85,
  },
  {
    value: "posted",
    label: "โพสต์แล้ว",
    progress: 100,
  },
];

function getInitialState(): WeeklyPageState {
  return {
    selectedDay: 1,
    statuses: {},
    notes: {},
    facebookMissions: [],
  };
}

function readState(planId: string): WeeklyPageState {
  if (typeof window === "undefined") {
    return getInitialState();
  }

  const raw = window.localStorage.getItem(
    getStateStorageKey(planId)
  );

  if (!raw) {
    return getInitialState();
  }

  try {
    return {
      ...getInitialState(),
      ...(JSON.parse(raw) as WeeklyPageState),
    };
  } catch {
    return getInitialState();
  }
}

function writeState(
  planId: string,
  state: WeeklyPageState
) {
  window.localStorage.setItem(
    getStateStorageKey(planId),
    JSON.stringify(state)
  );
} 

function createFacebookMission(): FacebookMission {
  return {
    id: `facebook-mission-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    title: "",
    completed: 0,
    target: 1,
  };
}

function normalizeMissionNumber(
  value: number,
  minimum: number
) {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.max(minimum, Math.floor(value));
}

function getSystemFacebookMissions(
  plan: WeeklyContentPlan
): SystemFacebookMission[] {
  const reels = plan.days.filter((day) =>
    ["reel", "video"].includes(day.format)
  ).length;

  const stories = plan.days.filter(
    (day) => day.format === "story"
  ).length;

  const supportingPosts = plan.days.filter((day) =>
    ["image", "carousel", "text"].includes(
      day.format
    )
  ).length;

  return [
    {
      id: "system-main-content",
      title: "ทำคอนเทนต์หลักตามแผน",
      target: plan.days.length,
      reason:
        "ระบบคำนวณจากแผน 7 วันที่ผ่าน Quality Gate แล้ว",
    },
    ...(reels > 0
      ? [
          {
            id: "system-reels",
            title: "Reels / วิดีโอหลัก",
            target: reels,
            reason:
              "จำนวนนี้มาจากเวลาที่เลือก ความสามารถ และรูปแบบผลงาน",
          },
        ]
      : []),
    ...(supportingPosts > 0
      ? [
          {
            id: "system-support-posts",
            title: "โพสต์เสริม ภาพ ข้อความ หรือคารูเซล",
            target: supportingPosts,
            reason:
              "ใช้สนับสนุนคอนเทนต์หลักโดยไม่เพิ่มภาระการถ่ายเกินเวลา",
          },
        ]
      : []),
    ...(stories > 0
      ? [
          {
            id: "system-stories",
            title: "Story",
            target: stories,
            reason:
              "กำหนดเฉพาะวันที่ Story มีหน้าที่สนับสนุนแผนจริง",
          },
        ]
      : []),
  ];
}

function getStatusLabel(status: ContentTaskStatus) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.label ||
    "ยังไม่เริ่ม"
  );
}

function getStatusProgress(status: ContentTaskStatus) {
  return (
    STATUS_OPTIONS.find((item) => item.value === status)?.progress || 0
  );
}

function getDayStatus(
  day: WeeklyContentDay,
  statuses: Record<string, ContentTaskStatus>
) {
  return statuses[String(day.day)] || day.status;
}

function formatList(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function getDayCopyText(day: WeeklyContentDay) {
  return [
    `แผนคอนเทนต์ วันที่ ${day.day}`,
    `ช่วงของแผน: ${day.stage}`,
    `หัวข้อ: ${day.title}`,
    `เป้าหมาย: ${day.objective}`,
    "",
    `หลักการที่ใช้: ${day.marketingPrinciple.title}`,
    day.marketingPrinciple.explanation,
    "",
    `รูปแบบ: ${day.format}`,
    `เวลาโพสต์: ${day.publishTime}`,
    `เวลาที่ใช้โดยประมาณ: ${day.estimatedMinutes} นาที`,
    "",
    `หัวข้อเนื้อหา: ${day.topic}`,
    "",
    "ประโยคเปิด:",
    day.hook,
    "",
    "บทพูดหรือเนื้อหา:",
    day.script,
    "",
    "ลำดับการถ่าย:",
    formatList(day.shotList),
    "",
    "ข้อความบนหน้าจอ:",
    formatList(day.onScreenTexts),
    "",
    "แคปชัน:",
    day.caption,
    "",
    `คำชวนให้ทำต่อ: ${day.cta}`,
    "",
    `แฮชแท็ก: ${day.hashtags.join(" ")}`,
    "",
    "สิ่งที่ต้องเตรียม:",
    formatList(day.preparation),
    "",
    `แผนสำรอง: ${day.fallback.title}`,
    formatList(day.fallback.instructions),
    day.fallback.caption
      ? `\nแคปชันแผนสำรอง:\n${day.fallback.caption}`
      : "",
    "",
    "หลังโพสต์ต้องทำอะไร:",
    formatList(day.afterPosting),
    "",
    "ตัวอย่างตอบความคิดเห็น:",
    formatList(day.replyExamples),
    "",
    "ตัวชี้วัดที่ควรดู:",
    formatList(day.metrics),
  ]
    .filter(Boolean)
    .join("\n");
}

 function getWeeklyCopyText(
  plan: WeeklyContentPlan
) {
  const copy = getWeeklyPlanCopy(plan.planType);

  const daysText = plan.days
    .map((day) => getDayCopyText(day))
    .join("\n\n------------------------------\n\n");

  return [
    plan.title,
    "",
    `${copy.subject}: ${plan.productOrService}`,
    `${copy.audience}: ${plan.audience}`,
    `เป้าหมายทั้งสัปดาห์: ${plan.weeklyObjective}`,
    "",
    `${copy.highlights}:`,
    formatList(plan.productHighlights),
    "",
    "เหตุผลของแผน:",
    plan.strategyExplanation,
    "",
    plan.platformGuidance.title + ":",
    plan.platformGuidance.explanation,
    "",
    "สิ่งที่ควรทำบนแพลตฟอร์ม:",
    formatList(plan.platformGuidance.actions),
    "",
    "ตัวเลขที่ควรดู:",
    formatList(plan.platformGuidance.measurements),
    "",
    `ข้อควรระวัง: ${plan.platformGuidance.caution}`,
    "",
    daysText,
  ].join("\n");
}

export default function WeeklyDashboardPage() {
  const [plan, setPlan] =
    useState<WeeklyContentPlan>(
      facebookBagSamplePlan
    );

  const [state, setState] =
    useState<WeeklyPageState>(getInitialState);

  const [hydrated, setHydrated] = useState(false);
  const [accessState, setAccessState] =
    useState<PlanAccessState>("loading");
  const [accessMessage, setAccessMessage] = useState(
    "กำลังตรวจสอบสิทธิ์การใช้งานแผน 7 วัน..."
  );
  const [statusHref, setStatusHref] = useState("/checkout");
  const [planRound, setPlanRound] = useState(1);
  const [qualityReport, setQualityReport] =
    useState<CreatorPlanQualityReport | null>(null);
  const [repeatNoveltyReport, setRepeatNoveltyReport] =
    useState<RepeatNoveltyReport | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [currentAccessKey, setCurrentAccessKey] = useState("");
  const [revisionRequest, setRevisionRequest] =
    useState<CreatorRevisionRequest | null>(null);
  const [revisionUsedAt, setRevisionUsedAt] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadApprovedPlan() {
      const searchParams = new URLSearchParams(
        window.location.search
      );

      const orderId = searchParams.get("order") || "";
      const accessKey = searchParams.get("key") || "";

      if (!cancelled) {
        setCurrentOrderId(orderId);
        setCurrentAccessKey(accessKey);
      }

      if (!orderId || !accessKey) {
        if (!cancelled) {
          setAccessState("locked");
          setAccessMessage(
            "หน้านี้เปิดได้หลังตรวจสอบและอนุมัติการชำระเงินแล้วเท่านั้น"
          );
        }
        return;
      }

      setStatusHref(
        `/order/${encodeURIComponent(
          orderId
        )}?key=${encodeURIComponent(accessKey)}`
      );

      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(
            orderId
          )}?key=${encodeURIComponent(accessKey)}`,
          { cache: "no-store" }
        );

        const data =
          (await response.json()) as OrderStatusResponse;

        if (!response.ok || !data.ok) {
          throw new Error(
            data.message || "ตรวจสอบสิทธิ์ไม่สำเร็จ"
          );
        }

        if (data.status !== "approved" || !data.request) {
          if (!cancelled) {
            setAccessState("pending");
            setAccessMessage(
              data.status === "review-ready"
                ? "ตรวจยอดแล้วและแผนกำลังผ่าน Human Review ก่อนส่งมอบ กรุณากลับไปที่หน้าตรวจสอบสถานะ"
                : "คำสั่งซื้อนี้ยังรอตรวจสอบการชำระเงิน กรุณากลับไปที่หน้าตรวจสอบสถานะ"
            );
          }
          return;
        }

        if (!data.qualityReport?.passed) {
          throw new Error(
            "แผนยังไม่ผ่านการตรวจคุณภาพ จึงยังไม่สามารถเปิดใช้งานได้"
          );
        }

        const nextPlan =
          data.plan ||
          generateWeeklyContentPlan(data.request);

        window.localStorage.setItem(
          REQUEST_STORAGE_KEY,
          JSON.stringify(data.request)
        );

        if (!cancelled) {
          setPlan(nextPlan);
          setPlanRound(
            Math.max(1, data.planRound || 1)
          );
          setQualityReport(data.qualityReport);
          setRepeatNoveltyReport(
            data.repeatNoveltyReport || null
          );
          setRevisionRequest(data.revisionRequest || null);
          setRevisionUsedAt(data.revisionUsedAt || null);
          setState(readState(nextPlan.id));
          setHydrated(true);
          setAccessState("approved");
        }
      } catch (error) {
        if (!cancelled) {
          setAccessState("error");
          setAccessMessage(
            error instanceof Error
              ? error.message
              : "ตรวจสอบสิทธิ์ไม่สำเร็จ กรุณาลองใหม่"
          );
        }
      }
    }

    void loadApprovedPlan();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || accessState !== "approved") return;

    writeState(plan.id, state);
  }, [accessState, hydrated, plan.id, state]);

  const planCopy = getWeeklyPlanCopy(plan.planType);

  const selectedDay =
    plan.days.find((day) => day.day === state.selectedDay) ||
    plan.days[0];

  const selectedStatus = getDayStatus(
    selectedDay,
    state.statuses
  );

  const selectedDayProgress =
    getStatusProgress(selectedStatus);

  const weeklyProgress = useMemo(() => {
    if (plan.days.length === 0) return 0;

    const total = plan.days.reduce((sum, day) => {
      const status = getDayStatus(day, state.statuses);

      return sum + getStatusProgress(status);
    }, 0);

    return Math.round(total / plan.days.length);
  }, [plan.days, state.statuses]);

  const postedDays = plan.days.filter((day) => {
    return getDayStatus(day, state.statuses) === "posted";
  }).length;

  const selectedNote =
    state.notes[String(selectedDay.day)] || "";

  const showFacebookMissions =
    plan.platform === "facebook" ||
    plan.platform === "facebook-and-tiktok";

  const systemFacebookMissions = useMemo(
    () => getSystemFacebookMissions(plan),
    [plan]
  );

  const activeFacebookMissions =
    state.facebookMissions.filter(
      (mission) =>
        mission.title.trim() && mission.target > 0
    );

  const facebookMissionProgress = useMemo(() => {
    const totalTarget = activeFacebookMissions.reduce(
      (sum, mission) => sum + mission.target,
      0
    );

    if (totalTarget === 0) {
      return 0;
    }

    const totalCompleted = activeFacebookMissions.reduce(
      (sum, mission) =>
        sum + Math.min(mission.completed, mission.target),
      0
    );

    return Math.round(
      (totalCompleted / totalTarget) * 100
    );
  }, [activeFacebookMissions]);

  const remainingPlanDays = Math.max(
    1,
    8 - selectedDay.day
  );

  function updateState(nextState: Partial<WeeklyPageState>) {
    setState((current) => ({
      ...current,
      ...nextState,
    }));
  }

  function updateStatus(
    day: number,
    status: ContentTaskStatus
  ) {
    updateState({
      statuses: {
        ...state.statuses,
        [String(day)]: status,
      },
    });
  }

  function updateNote(day: number, note: string) {
    updateState({
      notes: {
        ...state.notes,
        [String(day)]: note,
      },
    });
  }

  function addFacebookMission() {
    setState((current) => ({
      ...current,
      facebookMissions: [
        ...current.facebookMissions,
        createFacebookMission(),
      ],
    }));
  }


  function updateFacebookMission(
    missionId: string,
    patch: Partial<FacebookMission>
  ) {
    setState((current) => ({
      ...current,
      facebookMissions: current.facebookMissions.map(
        (mission) => {
          if (mission.id !== missionId) {
            return mission;
          }

          const target = normalizeMissionNumber(
            patch.target ?? mission.target,
            1
          );

          const completed = Math.min(
            target,
            normalizeMissionNumber(
              patch.completed ?? mission.completed,
              0
            )
          );

          return {
            ...mission,
            ...patch,
            target,
            completed,
          };
        }
      ),
    }));
  }

  function removeFacebookMission(missionId: string) {
    setState((current) => ({
      ...current,
      facebookMissions: current.facebookMissions.filter(
        (mission) => mission.id !== missionId
      ),
    }));
  }

  function resetWeek() {
    const confirmed = window.confirm(
      "ต้องการล้างสถานะและบันทึกของแผนนี้ทั้งหมดหรือไม่?"
    );

    if (!confirmed) return;

    setState(getInitialState());
  }

  if (accessState !== "approved") {
    return (
      <main style={pageStyle}>
        <section style={accessCardStyle}>
          <p style={accessEyebrowStyle}>
            Creator OS · แผนคอนเทนต์ 7 วัน
          </p>

          <h1 style={accessTitleStyle}>
            {accessState === "loading"
              ? "กำลังตรวจสอบสิทธิ์"
              : accessState === "pending"
                ? "รอตรวจสอบการชำระเงิน"
                : "ยังไม่สามารถเปิดแผนได้"}
          </h1>

          <p style={accessTextStyle}>{accessMessage}</p>

          <Link
            href={statusHref}
            style={accessButtonStyle}
          >
            {accessState === "pending"
              ? "กลับไปตรวจสอบสถานะ"
              : "กลับไปหน้าชำระเงิน"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={heroLabelStyle}>
          แผนคอนเทนต์พร้อมทำ 7 วัน
        </p>

        <h1 style={heroTitleStyle}>{plan.title}</h1>

        <p style={heroSubtitleStyle}>
          ระบบจัดหัวข้อ บทพูด ลำดับการถ่าย แคปชัน
          และงานหลังโพสต์ไว้ให้แล้ว
          คุณเพียงเลือกวันและลงมือทำตามแผน
        </p>

       <div style={heroTagRowStyle}>
  <span style={heroTagStyle}>
    {PLATFORM_LABELS[plan.platform]}
  </span>

  <span style={heroTagStyle}>
    {PLAN_TYPE_LABELS[plan.planType]}
  </span>

  <span style={heroTagStyle}>
    {CONTENT_DIRECTION_LABELS[
      plan.contentDirection
    ]}
  </span>

  <span style={heroTagStyle}>
    เป้าหมาย: {getGoalLabel(plan.goal, plan.planType)}
  </span>

  <span style={heroTagStyle}>
    {INTENSITY_LABELS[plan.intensity]}
  </span>

  <span style={heroTagStyle}>
    สัปดาห์ที่ {planRound}
  </span>

  {qualityReport?.passed && (
    <span style={qualityTagStyle}>
      ผ่านตรวจคุณภาพ {qualityReport.score}/100
    </span>
  )}

  {planRound > 1 && repeatNoveltyReport?.passed && (
    <span style={qualityTagStyle}>
      ผ่านตรวจความใหม่จากสัปดาห์ก่อน
    </span>
  )}

  <span style={heroTagStyle}>7 วัน</span>
</div>


                <div style={buttonRowStyle}>
  {currentOrderId && currentAccessKey ? (
    <Link
      href={`/start?repeatOrder=${encodeURIComponent(
        currentOrderId
      )}&key=${encodeURIComponent(currentAccessKey)}`}
    >
      <button type="button" style={nextWeekButtonStyle}>
        สร้างสัปดาห์ที่ {planRound + 1}
      </button>
    </Link>
  ) : null}

  <Link href="/start">
    <button type="button" style={createPlanButtonStyle}>
      สร้างแผนใหม่คนละชุด
    </button>
  </Link>

  <Link href="/dashboard">
    <button type="button" style={primaryButtonStyle}>
      กลับหน้า Dashboard
    </button>
  </Link>

  <CopyButton text={getWeeklyCopyText(plan)} />
</div>
      </section>

      {currentOrderId && currentAccessKey ? (
        <RevisionRequestCard
          orderId={currentOrderId}
          accessKey={currentAccessKey}
          initialRevision={revisionRequest}
          revisionUsedAt={revisionUsedAt}
        />
      ) : null}

      {planRound > 1 && repeatNoveltyReport ? (
        <section style={repeatWeekNoticeStyle}>
          <strong>สัปดาห์ที่ {planRound} ต่อจากแผนเดิม</strong>
          <span>
            ระบบเปรียบเทียบกับ {repeatNoveltyReport.previousPlansCompared} สัปดาห์ก่อนหน้าแล้ว โดยค่าเฉลี่ยความคล้ายสูงสุดของแต่ละวันอยู่ที่ {Math.round(repeatNoveltyReport.averageBestSimilarity * 100)}% และผ่าน Repeat Novelty Gate
          </span>
        </section>
      ) : null}

      <section style={overviewSectionStyle}>
        <div style={sectionHeadingRowStyle}>
          <div>
            <p style={sectionLabelStyle}>ภาพรวมแผน</p>

            <h2 style={sectionTitleStyle}>
              สิ่งที่ระบบวางไว้ให้คุณ
            </h2>
          </div>
        </div>

        <div style={summaryGridStyle}>
          <article style={summaryCardStyle}>
            <p style={summaryLabelStyle}>
              ความคืบหน้าทั้งสัปดาห์
            </p>

            <h3 style={summaryNumberStyle}>
              {weeklyProgress}%
            </h3>

            <div style={progressOuterStyle}>
              <div
                style={{
                  ...progressInnerStyle,
                  width: `${weeklyProgress}%`,
                }}
              />
            </div>
          </article>

          <article style={summaryCardStyle}>
            <p style={summaryLabelStyle}>โพสต์แล้ว</p>

            <h3 style={summaryNumberStyle}>
              {postedDays}/7
            </h3>

            <p style={mutedTextStyle}>
              จำนวนวันที่ทำจนถึงขั้นโพสต์แล้ว
            </p>
          </article>

          <article style={summaryCardStyle}>
            <p style={summaryLabelStyle}>วันที่กำลังดู</p>

            <h3 style={summaryNumberStyle}>
              วันที่ {selectedDay.day}
            </h3>

            <p style={mutedTextStyle}>
              {getStatusLabel(selectedStatus)}
            </p>
          </article>
        </div>

        <div style={planInfoGridStyle}>
          <article style={infoCardStyle}>
            <p style={infoLabelStyle}>{planCopy.subject}</p>
            <p style={infoTextStyle}>
              {plan.productOrService}
            </p>
          </article>

          <article style={infoCardStyle}>
            <p style={infoLabelStyle}>{planCopy.audience}</p>
            <p style={infoTextStyle}>{plan.audience}</p>
          </article>

          <article style={infoCardStyle}>
            <p style={infoLabelStyle}>
              เป้าหมายทั้งสัปดาห์
            </p>
            <p style={infoTextStyle}>
              {plan.weeklyObjective}
            </p>
          </article>
        </div>

        <article style={strategyCardStyle}>
          <p style={strategyLabelStyle}>
            ระบบเข้าใจคำสั่งของคุณว่า
          </p>

          <p style={strategyTextStyle}>
            ผู้ชมอยู่ในระดับ “{AUDIENCE_STAGE_LABELS[plan.audienceStage || "new"]}”
            และควรได้รับ “{AUDIENCE_VALUE_LABELS[plan.audienceValue || "solve"]}”
            จากคอนเทนต์นี้ โดยคำชวนหลักคือ
            “{DESIRED_ACTION_LABELS[plan.desiredAction || "follow"]}”
            ใช้น้ำเสียง “{TONE_LABELS[plan.tone || "friendly"]}”
            และให้น้ำหนักกับ{" "}
            {(plan.supportNeeds || [])
              .map(
                (need) => SUPPORT_NEED_LABELS[need]
              )
              .join(", ") || "บทและลำดับงานพร้อมใช้"}
          </p>
        </article>

        <article style={strategyCardStyle}>
          <p style={strategyLabelStyle}>
            ทำไมแผนจึงเรียงแบบนี้?
          </p>

          <p style={strategyTextStyle}>
            {plan.strategyExplanation}
          </p>
        </article>

        <article style={platformGuideCardStyle}>
          <p style={platformGuideLabelStyle}>
            {plan.platformGuidance.title}
          </p>

          <p style={platformGuideTextStyle}>
            {plan.platformGuidance.explanation}
          </p>

          <div style={platformGuideGridStyle}>
            <div>
              <p style={platformGuideHeadingStyle}>
                สิ่งที่ควรทำเป็นประจำ
              </p>
              <ul style={listStyle}>
                {plan.platformGuidance.actions.map((item) => (
                  <li key={item} style={listItemStyle}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p style={platformGuideHeadingStyle}>
                ตัวเลขที่ควรดู
              </p>
              <ul style={listStyle}>
                {plan.platformGuidance.measurements.map((item) => (
                  <li key={item} style={listItemStyle}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p style={platformCautionStyle}>
            <strong>ข้อควรระวัง:</strong>{" "}
            {plan.platformGuidance.caution}
          </p>
        </article>

        {showFacebookMissions ? (
          <section style={facebookMissionSectionStyle}>
            <div style={sectionHeadingRowStyle}>
              <div>
                <p style={facebookMissionEyebrowStyle}>
                  Creator OS Recommended Missions
                </p>
                <h2 style={facebookMissionTitleStyle}>
                  ภารกิจที่ระบบคำนวณให้
                </h2>
                <p style={facebookMissionHelpStyle}>
                  จำนวนด้านล่างคำนวณจากเวลาที่คุณเลือก
                  ความสามารถ รูปแบบผลงาน และแผน 7 วันที่ผ่าน
                  Quality Gate แล้ว จึงแก้ไขไม่ได้
                </p>
              </div>
            </div>

            <div style={facebookMissionListStyle}>
              {systemFacebookMissions.map((mission) => (
                <article
                  key={mission.id}
                  style={facebookMissionCardStyle}
                >
                  <strong style={facebookMissionTitleInputStyle}>
                    {mission.title}
                  </strong>

                  <p style={facebookMissionOverallNumberStyle}>
                    {mission.target} ครั้ง / สัปดาห์
                  </p>

                  <p style={facebookMissionAdviceStyle}>
                    {mission.reason}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {showFacebookMissions ? (
          <section style={facebookMissionSectionStyle}>
            <div style={sectionHeadingRowStyle}>
              <div>
                <p style={facebookMissionEyebrowStyle}>
                  Optional Facebook Missions
                </p>
                <h2 style={facebookMissionTitleStyle}>
                  ภารกิจเพิ่มเติมของคุณ
                </h2>
                <p style={facebookMissionHelpStyle}>
                  ส่วนนี้แยกจากแผนหลัก ใช้กรอกภารกิจที่บัญชี
                  Facebook Professional Dashboard แสดงจริง
                  หรือภารกิจที่คุณอยากเพิ่มเอง
                </p>
              </div>

              <div style={facebookMissionButtonRowStyle}>
                <button
                  type="button"
                  onClick={addFacebookMission}
                  style={facebookMissionPrimaryButtonStyle}
                >
                  + เพิ่มภารกิจ
                </button>
              </div>
            </div>

            {state.facebookMissions.length > 0 ? (
              <>
                <div style={facebookMissionOverallStyle}>
                  <div>
                    <p style={facebookMissionOverallLabelStyle}>
                      ความคืบหน้าภารกิจรวม
                    </p>
                    <strong style={facebookMissionOverallNumberStyle}>
                      {facebookMissionProgress}%
                    </strong>
                  </div>

                  <div style={facebookMissionOverallProgressStyle}>
                    <div
                      style={{
                        ...facebookMissionOverallProgressInnerStyle,
                        width: `${facebookMissionProgress}%`,
                      }}
                    />
                  </div>
                </div>

                <div style={facebookMissionListStyle}>
                  {state.facebookMissions.map((mission) => {
                    const remaining = Math.max(
                      0,
                      mission.target - mission.completed
                    );
                    const missionProgress =
                      mission.target > 0
                        ? Math.round(
                            (Math.min(
                              mission.completed,
                              mission.target
                            ) /
                              mission.target) *
                              100
                          )
                        : 0;
                    const suggestedToday = Math.min(
                      remaining,
                      Math.ceil(
                        remaining / remainingPlanDays
                      )
                    );

                    return (
                      <article
                        key={mission.id}
                        style={facebookMissionCardStyle}
                      >
                        <input
                          value={mission.title}
                          onChange={(event) =>
                            updateFacebookMission(
                              mission.id,
                              { title: event.target.value }
                            )
                          }
                          placeholder="เช่น สร้าง Reels"
                          style={facebookMissionTitleInputStyle}
                        />

                        <div style={facebookMissionNumberGridStyle}>
                          <label style={facebookMissionFieldStyle}>
                            <span>ทำแล้ว</span>
                            <input
                              type="number"
                              min={0}
                              max={mission.target}
                              value={mission.completed}
                              onChange={(event) =>
                                updateFacebookMission(
                                  mission.id,
                                  {
                                    completed: Number(
                                      event.target.value
                                    ),
                                  }
                                )
                              }
                              style={facebookMissionNumberInputStyle}
                            />
                          </label>

                          <label style={facebookMissionFieldStyle}>
                            <span>เป้าหมาย</span>
                            <input
                              type="number"
                              min={1}
                              value={mission.target}
                              onChange={(event) =>
                                updateFacebookMission(
                                  mission.id,
                                  {
                                    target: Number(
                                      event.target.value
                                    ),
                                  }
                                )
                              }
                              style={facebookMissionNumberInputStyle}
                            />
                          </label>
                        </div>

                        <div style={facebookMissionProgressTrackStyle}>
                          <div
                            style={{
                              ...facebookMissionProgressFillStyle,
                              width: `${missionProgress}%`,
                            }}
                          />
                        </div>

                        <p style={facebookMissionAdviceStyle}>
                          {remaining === 0
                            ? "ภารกิจนี้ครบแล้ว ✅"
                            : `เหลือ ${remaining} · วันนี้ควรทำประมาณ ${suggestedToday}`}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            removeFacebookMission(mission.id)
                          }
                          style={facebookMissionRemoveButtonStyle}
                        >
                          ลบภารกิจ
                        </button>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={facebookMissionEmptyStyle}>
                ยังไม่มีภารกิจเพิ่มเติม
                กด “เพิ่มภารกิจ” เมื่อต้องการกรอกเป้าหมาย
                จาก Facebook Professional Dashboard หรือเพิ่มงานของคุณเอง
              </div>
            )}
          </section>
        ) : null}

        <article style={highlightCardStyle}>
          <p style={infoLabelStyle}>{planCopy.highlights}</p>

          <ul style={listStyle}>
            {plan.productHighlights.map((highlight) => (
              <li key={highlight} style={listItemStyle}>
                {highlight}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section style={daySelectorSectionStyle}>
        <div style={sectionHeadingRowStyle}>
          <div>
            <p style={sectionLabelStyle}>ตาราง 7 วัน</p>

            <h2 style={sectionTitleStyle}>
              เลือกวันที่ต้องการลงมือทำ
            </h2>
          </div>
        </div>

        <div style={dayGridStyle}>
          {plan.days.map((day) => {
            const status = getDayStatus(
              day,
              state.statuses
            );

            const progress = getStatusProgress(status);
            const active = selectedDay.day === day.day;

            return (
              <button
                key={day.day}
                type="button"
                onClick={() =>
                  updateState({ selectedDay: day.day })
                }
                style={
                  active
                    ? activeDayCardStyle
                    : dayCardStyle
                }
              >
                <div style={dayTopRowStyle}>
                  <span style={dayBadgeStyle}>
                    วันที่ {day.day}
                  </span>

                  <span style={statusBadgeStyle}>
                    {getStatusLabel(status)}
                  </span>
                </div>

                <p style={dayStageStyle}>{day.stage}</p>

                <h3 style={dayTitleStyle}>{day.title}</h3>

                <div style={progressOuterStyle}>
                  <div
                    style={{
                      ...progressInnerStyle,
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p style={dayProgressTextStyle}>
                  ความคืบหน้า {progress}%
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section style={contentSectionStyle}>
        <div style={dayHeroStyle}>
          <div style={{ flex: 1 }}>
            <p style={sectionLabelStyle}>
              วันที่ {selectedDay.day} · {selectedDay.stage}
            </p>

            <h2 style={selectedDayTitleStyle}>
              {selectedDay.title}
            </h2>

            <p style={selectedDayObjectiveStyle}>
              {selectedDay.objective}
            </p>
          </div>

          <div style={dayProgressBoxStyle}>
            <p style={dayProgressLabelStyle}>ความคืบหน้า</p>

            <strong style={dayProgressNumberStyle}>
              {selectedDayProgress}%
            </strong>
          </div>
        </div>

        {showFacebookMissions ? (
          <article style={facebookTodayCardStyle}>
            <p style={facebookTodayEyebrowStyle}>
              ภารกิจหลักสำหรับวันที่ {selectedDay.day}
            </p>
            <h3 style={facebookTodayTitleStyle}>
              ทำคอนเทนต์ตามแผนวันนี้ 1 ชิ้น
            </h3>

            <div style={facebookTodayGridStyle}>
              <div style={facebookTodayItemStyle}>
                <strong>{selectedDay.title}</strong>
                <span>
                  รูปแบบ {selectedDay.format} · ใช้เวลาประมาณ{" "}
                  {selectedDay.estimatedMinutes} นาที
                </span>
              </div>
            </div>
          </article>
        ) : null}

        {showFacebookMissions &&
        activeFacebookMissions.length > 0 ? (
          <article style={facebookTodayCardStyle}>
            <p style={facebookTodayEyebrowStyle}>
              ภารกิจเพิ่มเติมสำหรับวันที่ {selectedDay.day}
            </p>
            <h3 style={facebookTodayTitleStyle}>
              ทำเพิ่มเฉพาะเมื่อเป็นภารกิจที่คุณกรอกเอง
            </h3>

            <div style={facebookTodayGridStyle}>
              {activeFacebookMissions.map((mission) => {
                const remaining = Math.max(
                  0,
                  mission.target - mission.completed
                );

                const suggestedToday = Math.min(
                  remaining,
                  Math.ceil(
                    remaining / remainingPlanDays
                  )
                );

                return (
                  <div
                    key={mission.id}
                    style={facebookTodayItemStyle}
                  >
                    <strong>{mission.title}</strong>
                    <span>
                      {remaining === 0
                        ? "ครบแล้ว"
                        : `ทำเพิ่มประมาณ ${suggestedToday} · เหลือ ${remaining}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>
        ) : null}

        <div style={statusControlStyle}>
          <label
            htmlFor="content-status"
            style={statusLabelStyle}
          >
            สถานะงานวันนี้
          </label>

          <select
            id="content-status"
            value={selectedStatus}
            onChange={(event) =>
              updateStatus(
                selectedDay.day,
                event.target.value as ContentTaskStatus
              )
            }
            style={selectStyle}
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <CopyButton text={getDayCopyText(selectedDay)} />
        </div>

        <div style={quickInfoGridStyle}>
          <article style={quickInfoCardStyle}>
            <p style={quickInfoLabelStyle}>รูปแบบ</p>
            <strong>{selectedDay.format}</strong>
          </article>

          <article style={quickInfoCardStyle}>
            <p style={quickInfoLabelStyle}>เวลาโพสต์</p>
            <strong>{selectedDay.publishTime}</strong>
          </article>

          <article style={quickInfoCardStyle}>
            <p style={quickInfoLabelStyle}>เวลาที่ใช้</p>
            <strong>
              ประมาณ {selectedDay.estimatedMinutes} นาที
            </strong>
          </article>
        </div>

        <article style={principleCardStyle}>
          <p style={principleLabelStyle}>
            หลักการที่ใช้
          </p>

          <h3 style={principleTitleStyle}>
            {selectedDay.marketingPrinciple.title}
          </h3>

          <p style={principleTextStyle}>
            {selectedDay.marketingPrinciple.explanation}
          </p>
        </article>

        <div style={twoColumnGridStyle}>
          <article style={contentCardStyle}>
            <div style={cardHeadingRowStyle}>
              <h3 style={cardTitleStyle}>หัวข้อคอนเทนต์</h3>
              <CopyButton text={selectedDay.topic} />
            </div>

            <p style={largeContentTextStyle}>
              {selectedDay.topic}
            </p>
          </article>

          <article style={contentCardStyle}>
            <div style={cardHeadingRowStyle}>
              <h3 style={cardTitleStyle}>
                ประโยคเปิดคลิปหรือโพสต์
              </h3>

              <CopyButton text={selectedDay.hook} />
            </div>

            <p style={largeContentTextStyle}>
              {selectedDay.hook}
            </p>
          </article>
        </div>

        <article style={contentCardStyle}>
          <div style={cardHeadingRowStyle}>
            <h3 style={cardTitleStyle}>
              บทพูดหรือเนื้อหาพร้อมใช้
            </h3>

            <CopyButton text={selectedDay.script} />
          </div>

          <p style={scriptTextStyle}>
            {selectedDay.script}
          </p>
        </article>

        <div style={twoColumnGridStyle}>
          <article style={contentCardStyle}>
            <h3 style={cardTitleStyle}>ลำดับการถ่าย</h3>

            <ol style={listStyle}>
              {selectedDay.shotList.map((shot) => (
                <li key={shot} style={listItemStyle}>
                  {shot}
                </li>
              ))}
            </ol>
          </article>

          <article style={contentCardStyle}>
            <h3 style={cardTitleStyle}>
              ข้อความที่ขึ้นบนหน้าจอ
            </h3>

            <ul style={listStyle}>
              {selectedDay.onScreenTexts.map((text) => (
                <li key={text} style={listItemStyle}>
                  {text}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article style={contentCardStyle}>
          <div style={cardHeadingRowStyle}>
            <h3 style={cardTitleStyle}>แคปชันพร้อมโพสต์</h3>

            <CopyButton text={selectedDay.caption} />
          </div>

          <p style={preserveLineTextStyle}>
            {selectedDay.caption}
          </p>
        </article>

        <div style={twoColumnGridStyle}>
          <article style={contentCardStyle}>
            <div style={cardHeadingRowStyle}>
              <h3 style={cardTitleStyle}>
                คำชวนให้คนทำต่อ
              </h3>

              <CopyButton text={selectedDay.cta} />
            </div>

            <p style={largeContentTextStyle}>
              {selectedDay.cta}
            </p>
          </article>

          <article style={contentCardStyle}>
            <div style={cardHeadingRowStyle}>
              <h3 style={cardTitleStyle}>แฮชแท็ก</h3>

              <CopyButton
                text={selectedDay.hashtags.join(" ")}
              />
            </div>

            <div style={hashtagRowStyle}>
              {selectedDay.hashtags.map((hashtag) => (
                <span
                  key={hashtag}
                  style={hashtagStyle}
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </article>
        </div>

        <article style={contentCardStyle}>
          <h3 style={cardTitleStyle}>สิ่งที่ต้องเตรียม</h3>

          <ul style={listStyle}>
            {selectedDay.preparation.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article style={fallbackCardStyle}>
          <p style={fallbackLabelStyle}>
            วันนี้ทำรูปแบบหลักไม่ได้?
          </p>

          <h3 style={fallbackTitleStyle}>
            แผนสำรอง: {selectedDay.fallback.title}
          </h3>

          <p style={mutedTextStyle}>
            ระบบเปลี่ยนงานให้ทำได้ง่ายขึ้น
            โดยยังรักษาเป้าหมายของวันนี้ไว้
          </p>

          <ol style={listStyle}>
            {selectedDay.fallback.instructions.map(
              (instruction) => (
                <li
                  key={instruction}
                  style={listItemStyle}
                >
                  {instruction}
                </li>
              )
            )}
          </ol>

          {selectedDay.fallback.caption ? (
            <div style={fallbackCaptionStyle}>
              <div style={cardHeadingRowStyle}>
                <strong>แคปชันสำหรับแผนสำรอง</strong>

                <CopyButton
                  text={selectedDay.fallback.caption}
                />
              </div>

              <p style={preserveLineTextStyle}>
                {selectedDay.fallback.caption}
              </p>
            </div>
          ) : null}
        </article>

        <div style={twoColumnGridStyle}>
          <article style={contentCardStyle}>
            <h3 style={cardTitleStyle}>
              หลังโพสต์ต้องทำอะไร
            </h3>

            <ol style={listStyle}>
              {selectedDay.afterPosting.map((item) => (
                <li key={item} style={listItemStyle}>
                  {item}
                </li>
              ))}
            </ol>
          </article>

          <article style={contentCardStyle}>
            <h3 style={cardTitleStyle}>
              ตัวอย่างตอบความคิดเห็น
            </h3>

            <ul style={listStyle}>
              {selectedDay.replyExamples.map((reply) => (
                <li key={reply} style={listItemStyle}>
                  “{reply}”
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article style={metricsCardStyle}>
          <p style={metricsLabelStyle}>
            ตัวชี้วัดที่ควรดู
          </p>

          <div style={metricsGridStyle}>
            {selectedDay.metrics.map((metric) => (
              <div key={metric} style={metricItemStyle}>
                {metric}
              </div>
            ))}
          </div>
        </article>

        <article style={noteCardStyle}>
          <div style={cardHeadingRowStyle}>
            <div>
              <p style={sectionLabelStyle}>บันทึกของวันนี้</p>

              <h3 style={cardTitleStyle}>
                จดผลลัพธ์หรือสิ่งที่ต้องปรับ
              </h3>
            </div>

            <CopyButton text={selectedNote} />
          </div>

          <textarea
            value={selectedNote}
            onChange={(event) =>
              updateNote(
                selectedDay.day,
                event.target.value
              )
            }
            placeholder="ตัวอย่าง: คนถามเรื่องขนาดมากที่สุด คลิปช่วงแรกยาวเกินไป หรือควรถ่ายมุมด้านในเพิ่ม..."
            style={textareaStyle}
          />
        </article>
      </section>

      <section style={bottomSectionStyle}>
        <h2 style={bottomTitleStyle}>
          แผนนี้พร้อมให้ผู้ใช้ลงมือทำแล้ว
        </h2>

        <p style={bottomTextStyle}>
          เปิดทีละวัน เตรียมของตามรายการ
          ใช้บทพูดและแคปชันที่ระบบจัดไว้
          จากนั้นบันทึกสถานะและผลลัพธ์หลังโพสต์
        </p>

        <div style={buttonRowCenterStyle}>
        <CopyButton text={getWeeklyCopyText(plan)} />

          <button
            type="button"
            onClick={resetWeek}
            style={resetButtonStyle}
          >
            ล้างสถานะและเริ่มใหม่
          </button>
        </div>
      </section>
    </main>
  );
}

const facebookMissionSectionStyle: CSSProperties = {
  marginTop: "20px",
  padding: "24px",
  border: "1px solid #bfdbfe",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
};

const facebookMissionEyebrowStyle: CSSProperties = {
  margin: 0,
  color: "#1d4ed8",
  fontWeight: 900,
};

const facebookMissionTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#0f172a",
  fontSize: "26px",
};

const facebookMissionHelpStyle: CSSProperties = {
  maxWidth: "760px",
  margin: "10px 0 0",
  color: "#475569",
  lineHeight: 1.75,
};

const facebookMissionButtonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const facebookMissionPrimaryButtonStyle: CSSProperties = {
  minHeight: "44px",
  padding: "0 16px",
  border: 0,
  borderRadius: "12px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
};

const facebookMissionSecondaryButtonStyle: CSSProperties = {
  minHeight: "44px",
  padding: "0 16px",
  border: "1px solid #93c5fd",
  borderRadius: "12px",
  background: "white",
  color: "#1d4ed8",
  cursor: "pointer",
  fontWeight: 900,
};

const facebookMissionOverallStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(150px, 220px) 1fr",
  alignItems: "center",
  gap: "16px",
  marginTop: "20px",
  padding: "16px",
  borderRadius: "18px",
  background: "#dbeafe",
};

const facebookMissionOverallLabelStyle: CSSProperties = {
  margin: 0,
  color: "#1e3a8a",
  fontWeight: 800,
};

const facebookMissionOverallNumberStyle: CSSProperties = {
  display: "block",
  marginTop: "4px",
  color: "#1e40af",
  fontSize: "30px",
};

const facebookMissionOverallProgressStyle: CSSProperties = {
  height: "12px",
  overflow: "hidden",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.75)",
};

const facebookMissionOverallProgressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#2563eb",
  transition: "width 0.2s ease",
};

const facebookMissionListStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "14px",
  marginTop: "16px",
};

const facebookMissionCardStyle: CSSProperties = {
  padding: "16px",
  border: "1px solid #dbeafe",
  borderRadius: "18px",
  background: "white",
};

const facebookMissionTitleInputStyle: CSSProperties = {
  width: "100%",
  minHeight: "44px",
  padding: "0 12px",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  color: "#0f172a",
  fontWeight: 800,
  boxSizing: "border-box",
};

const facebookMissionNumberGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "12px",
};

const facebookMissionFieldStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  color: "#475569",
  fontSize: "13px",
  fontWeight: 800,
};

const facebookMissionNumberInputStyle: CSSProperties = {
  width: "100%",
  minHeight: "42px",
  padding: "0 10px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  color: "#0f172a",
  boxSizing: "border-box",
};

const facebookMissionProgressTrackStyle: CSSProperties = {
  height: "9px",
  marginTop: "14px",
  overflow: "hidden",
  borderRadius: "999px",
  background: "#e2e8f0",
};

const facebookMissionProgressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#2563eb",
};

const facebookMissionAdviceStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "#1e3a8a",
  fontWeight: 800,
};

const facebookMissionRemoveButtonStyle: CSSProperties = {
  marginTop: "10px",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: 800,
};

const facebookMissionEmptyStyle: CSSProperties = {
  marginTop: "18px",
  padding: "18px",
  border: "1px dashed #93c5fd",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.72)",
  color: "#475569",
  lineHeight: 1.75,
};

const facebookTodayCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "18px",
  border: "1px solid #bfdbfe",
  borderRadius: "18px",
  background: "#eff6ff",
};

const facebookTodayEyebrowStyle: CSSProperties = {
  margin: 0,
  color: "#1d4ed8",
  fontWeight: 900,
};

const facebookTodayTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  color: "#0f172a",
  fontSize: "20px",
};

const facebookTodayGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "10px",
  marginTop: "14px",
};

const facebookTodayItemStyle: CSSProperties = {
  display: "grid",
  gap: "4px",
  padding: "12px",
  borderRadius: "14px",
  background: "white",
  color: "#0f172a",
};

const accessCardStyle: CSSProperties = {
  width: "min(680px, 100%)",
  margin: "70px auto",
  padding: "32px",
  border: "1px solid #e2e8f0",
  borderRadius: "24px",
  background: "white",
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.10)",
};

const accessEyebrowStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const accessTitleStyle: CSSProperties = {
  margin: "12px 0 0",
  color: "#0f172a",
  fontSize: "clamp(28px, 5vw, 42px)",
  lineHeight: 1.15,
};

const accessTextStyle: CSSProperties = {
  margin: "16px 0 0",
  color: "#475569",
  lineHeight: 1.8,
};

const accessButtonStyle: CSSProperties = {
  display: "inline-flex",
  minHeight: "48px",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "24px",
  padding: "0 20px",
  borderRadius: "14px",
  background: "#4f46e5",
  color: "white",
  textDecoration: "none",
  fontWeight: 900,
};

const pageStyle: CSSProperties = {
  maxWidth: "1160px",
  margin: "0 auto",
  padding: "24px",
};

const heroStyle: CSSProperties = {
  padding: "40px 24px",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
};

const heroLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: 800,
};

const heroTitleStyle: CSSProperties = {
  margin: "12px 0",
  fontSize: "clamp(32px, 6vw, 50px)",
  lineHeight: 1.15,
};

const heroSubtitleStyle: CSSProperties = {
  maxWidth: "820px",
  margin: 0,
  color: "#e0e7ff",
  fontSize: "18px",
  lineHeight: 1.8,
};

const heroTagRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "22px",
};

const heroTagStyle: CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
  fontSize: "14px",
  fontWeight: 700,
};

const qualityTagStyle: CSSProperties = {
  ...heroTagStyle,
  background: "#dcfce7",
  borderColor: "#86efac",
  color: "#166534",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  marginTop: "28px",
};

const nextWeekButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #047857",
  background: "#047857",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const repeatWeekNoticeStyle: CSSProperties = {
  maxWidth: "1180px",
  margin: "18px auto 0",
  padding: "16px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  borderRadius: "18px",
  border: "1px solid #a7f3d0",
  background: "#ecfdf5",
  color: "#065f46",
  lineHeight: 1.65,
};

const createPlanButtonStyle: CSSProperties = {
  padding: "12px 20px",
  borderRadius: "14px",
  border: "1px solid #ffffff",
  background: "#ffffff",
  color: "#312e81",
  cursor: "pointer",
  fontWeight: 800,
  boxShadow: "0 8px 20px rgba(15, 23, 42, 0.18)",
};

const buttonRowCenterStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
  marginTop: "20px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 800,
};

const overviewSectionStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  background: "white",
};

const sectionHeadingRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "14px",
};

const sectionLabelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: 800,
};

const sectionTitleStyle: CSSProperties = {
  margin: "6px 0 0",
  fontSize: "28px",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "14px",
  marginTop: "20px",
};

const summaryCardStyle: CSSProperties = {
  padding: "20px",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  background: "#f8fafc",
};

const summaryLabelStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontWeight: 700,
};

const summaryNumberStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "38px",
  color: "#111827",
};

const progressOuterStyle: CSSProperties = {
  width: "100%",
  height: "9px",
  marginTop: "12px",
  borderRadius: "999px",
  overflow: "hidden",
  background: "#e5e7eb",
};

const progressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#4f46e5",
  transition: "width 0.2s ease",
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  lineHeight: 1.7,
};

const planInfoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
  marginTop: "18px",
};

const infoCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
};

const infoLabelStyle: CSSProperties = {
  margin: "0 0 7px",
  color: "#4f46e5",
  fontWeight: 800,
};

const infoTextStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
  lineHeight: 1.7,
};

const strategyCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
};

const strategyLabelStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "#4338ca",
  fontWeight: 800,
};

const strategyTextStyle: CSSProperties = {
  margin: 0,
  color: "#312e81",
  lineHeight: 1.8,
};

const platformGuideCardStyle: CSSProperties = {
  marginTop: "16px",
  padding: "22px",
  border: "1px solid #bae6fd",
  borderRadius: "20px",
  background: "#f0f9ff",
};

const platformGuideLabelStyle: CSSProperties = {
  margin: 0,
  color: "#0369a1",
  fontWeight: 900,
};

const platformGuideTextStyle: CSSProperties = {
  margin: "10px 0 0",
  color: "#0f172a",
  lineHeight: 1.8,
};

const platformGuideGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px",
  marginTop: "16px",
};

const platformGuideHeadingStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "#0c4a6e",
  fontWeight: 800,
};

const platformCautionStyle: CSSProperties = {
  margin: "16px 0 0",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#334155",
  lineHeight: 1.7,
};

const highlightCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const daySelectorSectionStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  background: "white",
};

const dayGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "14px",
  marginTop: "20px",
};

const dayCardStyle: CSSProperties = {
  padding: "18px",
  textAlign: "left",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  background: "#f8fafc",
  cursor: "pointer",
};

const activeDayCardStyle: CSSProperties = {
  padding: "18px",
  textAlign: "left",
  border: "2px solid #4f46e5",
  borderRadius: "18px",
  background: "#eef2ff",
  cursor: "pointer",
};

const dayTopRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  flexWrap: "wrap",
};

const dayBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "white",
  border: "1px solid #c7d2fe",
  color: "#4338ca",
  fontWeight: 800,
  fontSize: "13px",
};

const statusBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#e2e8f0",
  color: "#334155",
  fontWeight: 700,
  fontSize: "12px",
};

const dayStageStyle: CSSProperties = {
  margin: "14px 0 5px",
  color: "#4f46e5",
  fontWeight: 800,
  fontSize: "14px",
};

const dayTitleStyle: CSSProperties = {
  margin: 0,
  minHeight: "52px",
  color: "#111827",
  lineHeight: 1.45,
};

const dayProgressTextStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  fontSize: "13px",
};

const contentSectionStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  background: "white",
};

const dayHeroStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "18px",
  flexWrap: "wrap",
};

const selectedDayTitleStyle: CSSProperties = {
  margin: "7px 0",
  fontSize: "32px",
  lineHeight: 1.3,
};

const selectedDayObjectiveStyle: CSSProperties = {
  maxWidth: "820px",
  margin: 0,
  color: "#475569",
  fontSize: "17px",
  lineHeight: 1.8,
};

const dayProgressBoxStyle: CSSProperties = {
  minWidth: "150px",
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
};

const dayProgressLabelStyle: CSSProperties = {
  margin: 0,
  color: "#4338ca",
  fontWeight: 800,
};

const dayProgressNumberStyle: CSSProperties = {
  display: "block",
  marginTop: "4px",
  color: "#312e81",
  fontSize: "34px",
};

const statusControlStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "20px",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const statusLabelStyle: CSSProperties = {
  color: "#111827",
  fontWeight: 800,
};

const selectStyle: CSSProperties = {
  minHeight: "42px",
  padding: "8px 12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "15px",
  cursor: "pointer",
};

const quickInfoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const quickInfoCardStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const quickInfoLabelStyle: CSSProperties = {
  margin: "0 0 6px",
  color: "#64748b",
  fontWeight: 700,
};

const principleCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #fde68a",
  background: "#fffbeb",
};

const principleLabelStyle: CSSProperties = {
  margin: 0,
  color: "#92400e",
  fontWeight: 800,
};

const principleTitleStyle: CSSProperties = {
  margin: "8px 0",
  color: "#78350f",
};

const principleTextStyle: CSSProperties = {
  margin: 0,
  color: "#78350f",
  lineHeight: 1.8,
};

const twoColumnGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(290px, 1fr))",
  gap: "16px",
  marginTop: "18px",
};

const contentCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const cardHeadingRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "10px",
};

const cardTitleStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
};

const largeContentTextStyle: CSSProperties = {
  margin: "14px 0 0",
  color: "#111827",
  fontSize: "18px",
  lineHeight: 1.8,
};

const scriptTextStyle: CSSProperties = {
  margin: "14px 0 0",
  color: "#334155",
  fontSize: "17px",
  lineHeight: 1.9,
};

const preserveLineTextStyle: CSSProperties = {
  margin: "14px 0 0",
  color: "#334155",
  lineHeight: 1.8,
  whiteSpace: "pre-line",
};

const listStyle: CSSProperties = {
  margin: "14px 0 0",
  paddingLeft: "22px",
};

const listItemStyle: CSSProperties = {
  marginBottom: "9px",
  color: "#334155",
  lineHeight: 1.7,
};

const hashtagRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "14px",
};

const hashtagStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4338ca",
  fontWeight: 700,
  fontSize: "14px",
};

const fallbackCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #fed7aa",
  background: "#fff7ed",
};

const fallbackLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c2410c",
  fontWeight: 800,
};

const fallbackTitleStyle: CSSProperties = {
  margin: "8px 0",
  color: "#9a3412",
};

const fallbackCaptionStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "16px",
  background: "white",
  border: "1px solid #fed7aa",
};

const metricsCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const metricsLabelStyle: CSSProperties = {
  margin: 0,
  color: "#166534",
  fontWeight: 800,
};

const metricsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "10px",
  marginTop: "14px",
};

const metricItemStyle: CSSProperties = {
  padding: "12px",
  borderRadius: "14px",
  background: "white",
  border: "1px solid #bbf7d0",
  color: "#166534",
  fontWeight: 700,
};

const noteCardStyle: CSSProperties = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "150px",
  marginTop: "16px",
  padding: "14px 16px",
  boxSizing: "border-box",
  borderRadius: "16px",
  border: "1px solid #cbd5e1",
  background: "white",
  fontSize: "16px",
  lineHeight: 1.7,
  resize: "vertical",
};

const bottomSectionStyle: CSSProperties = {
  marginTop: "28px",
  padding: "30px 24px",
  borderRadius: "26px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const bottomTitleStyle: CSSProperties = {
  margin: 0,
};

const bottomTextStyle: CSSProperties = {
  maxWidth: "760px",
  margin: "12px auto 0",
  color: "#cbd5e1",
  lineHeight: 1.8,
};

const resetButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};
