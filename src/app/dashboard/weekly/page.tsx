"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import CopyButton from "../../../components/dashboard/CopyButton";
import { facebookBagSamplePlan } from "../../../data/weekly-plans/facebook-bag-sample";

import type {
  ContentGoal,
  ContentPlatform,
  ContentTaskStatus,
  PlanIntensity,
  WeeklyContentDay,
  WeeklyContentPlan,
} from "../../../types/weekly-content-plan";

import { generateWeeklyContentPlan } from "../../../lib/generate-weekly-content-plan";
import type { PlanRequest } from "../../../types/plan-request";

type WeeklyPageState = {
  selectedDay: number;
  statuses: Record<string, ContentTaskStatus>;
  notes: Record<string, string>;
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

  const daysText = plan.days
    .map((day) => getDayCopyText(day))
    .join("\n\n------------------------------\n\n");

  return [
    plan.title,
    "",
    `สินค้า: ${plan.productOrService}`,
    `กลุ่มลูกค้า: ${plan.audience}`,
    `เป้าหมายทั้งสัปดาห์: ${plan.weeklyObjective}`,
    "",
    "จุดเด่นสินค้า:",
    formatList(plan.productHighlights),
    "",
    "เหตุผลของแผน:",
    plan.strategyExplanation,
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

  useEffect(() => {
    const request = readPlanRequest();

    const nextPlan = request
      ? generateWeeklyContentPlan(request)
      : facebookBagSamplePlan;

    setPlan(nextPlan);
    setState(readState(nextPlan.id));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    writeState(plan.id, state);
  }, [hydrated, plan.id, state]);

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

  function resetWeek() {
    const confirmed = window.confirm(
      "ต้องการล้างสถานะและบันทึกของแผนนี้ทั้งหมดหรือไม่?"
    );

    if (!confirmed) return;

    setState(getInitialState());
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
    เป้าหมาย: {GOAL_LABELS[plan.goal]}
  </span>

  <span style={heroTagStyle}>
    {INTENSITY_LABELS[plan.intensity]}
  </span>

  <span style={heroTagStyle}>7 วัน</span>
</div>


                <div style={buttonRowStyle}>
  <Link href="/start">
    <button type="button" style={createPlanButtonStyle}>
      สร้างแผนใหม่
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
            <p style={infoLabelStyle}>สินค้า</p>
            <p style={infoTextStyle}>
              {plan.productOrService}
            </p>
          </article>

          <article style={infoCardStyle}>
            <p style={infoLabelStyle}>กลุ่มลูกค้า</p>
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
            ทำไมแผนจึงเรียงแบบนี้?
          </p>

          <p style={strategyTextStyle}>
            {plan.strategyExplanation}
          </p>
        </article>

        <article style={highlightCardStyle}>
          <p style={infoLabelStyle}>จุดเด่นสินค้าที่ใช้ในแผน</p>

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

const buttonRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
  marginTop: "28px",
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
