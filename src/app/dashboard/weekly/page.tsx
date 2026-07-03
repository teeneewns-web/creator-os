"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../../../components/dashboard/CopyButton";

type WeeklyTask = {
  id: string;
  title: string;
  description: string;
};

type WeeklyMission = {
  day: number;
  title: string;
  goal: string;
  output: string;
  tasks: WeeklyTask[];
};

type WeeklyState = {
  selectedDay: number;
  completedTaskIds: string[];
  notes: Record<string, string>;
};

const STORAGE_KEY = "creator-os-weekly-plan-thai";

const weeklyMissions: WeeklyMission[] = [
  {
    day: 1,
    title: "ตั้งหลักคอนเทนต์",
    goal: "รู้ว่าจะทำคอนเทนต์เรื่องอะไร ทำเพื่อใคร และต้องการผลลัพธ์แบบไหน",
    output: "ได้หัวข้อหลัก 1 เรื่อง + กลุ่มเป้าหมาย 1 กลุ่ม",
    tasks: [
      {
        id: "week-day-1-task-1",
        title: "เลือกกลุ่มเป้าหมาย",
        description:
          "ระบุให้ชัดว่าคอนเทนต์นี้พูดกับใคร เช่น มือใหม่ เจ้าของร้าน คนขายของออนไลน์ หรือ Creator",
      },
      {
        id: "week-day-1-task-2",
        title: "เลือกปัญหาหลัก",
        description:
          "เลือกปัญหาที่คนกลุ่มนั้นเจอจริง 1 เรื่อง เพื่อใช้เป็นแกนของคอนเทนต์",
      },
      {
        id: "week-day-1-task-3",
        title: "เขียนเป้าหมายคอนเทนต์",
        description:
          "สรุปว่าโพสต์หรือคลิปนี้ต้องการให้คนดูรู้สึก เข้าใจ หรือทำอะไรต่อ",
      },
    ],
  },
  {
    day: 2,
    title: "หา Hook ที่ทำให้คนหยุดดู",
    goal: "เลือกประโยคเปิดที่ทำให้คนสนใจในช่วงแรก",
    output: "ได้ Hook อย่างน้อย 5 ข้อ และเลือกข้อที่ดีที่สุด 1 ข้อ",
    tasks: [
      {
        id: "week-day-2-task-1",
        title: "เปิดคลัง Hook",
        description: "เลือกหมวดที่เกี่ยวกับหัวข้อของคุณ แล้วดู Hook หลายรูปแบบ",
      },
      {
        id: "week-day-2-task-2",
        title: "คัด Hook 5 ข้อ",
        description:
          "เลือก Hook ที่เกี่ยวกับปัญหาหรือความอยากรู้ของกลุ่มเป้าหมาย",
      },
      {
        id: "week-day-2-task-3",
        title: "เลือก Hook ที่ดีที่สุด",
        description:
          "เลือกข้อที่เจาะจุดเจ็บหรือความสงสัยมากที่สุด แล้วบันทึกไว้",
      },
    ],
  },
  {
    day: 3,
    title: "ต่อ Hook เป็นโพสต์หรือคลิป",
    goal: "เปลี่ยน Hook ให้กลายเป็นคอนเทนต์ที่ใช้งานจริงได้",
    output: "ได้ร่างโพสต์หรือสคริปต์คลิปสั้น 1 ชิ้น",
    tasks: [
      {
        id: "week-day-3-task-1",
        title: "เขียนเนื้อหากลาง",
        description:
          "อธิบายปัญหา เหตุผล หรือขั้นตอนที่เกี่ยวข้องกับ Hook ที่เลือกไว้",
      },
      {
        id: "week-day-3-task-2",
        title: "เพิ่มตัวอย่างจริง",
        description:
          "ใส่สถานการณ์หรือตัวอย่าง เพื่อให้คนดูรู้สึกว่าเนื้อหานี้เกี่ยวกับเขา",
      },
      {
        id: "week-day-3-task-3",
        title: "ทำให้เนื้อหาอ่านง่าย",
        description:
          "ตัดคำที่กว้างเกินไป และเว้นจังหวะให้อ่านหรือพูดในคลิปได้ง่าย",
      },
    ],
  },
  {
    day: 4,
    title: "ใส่ CTA ให้ตรงเป้าหมาย",
    goal: "ทำให้คอนเทนต์มีคำชวนให้คนดูทำบางอย่างต่อ",
    output: "ได้ CTA ที่ตรงกับเป้าหมาย 1–3 แบบ",
    tasks: [
      {
        id: "week-day-4-task-1",
        title: "เลือกเป้าหมายของโพสต์",
        description:
          "เลือกว่าจะให้คนดูติดตาม บันทึก แชร์ ทักแชต คลิก หรือซื้อสินค้า",
      },
      {
        id: "week-day-4-task-2",
        title: "เลือก CTA",
        description:
          "เปิดหน้า CTA แล้วเลือกคำชวนให้ทำที่เหมาะกับเป้าหมายของคอนเทนต์",
      },
      {
        id: "week-day-4-task-3",
        title: "ใส่ CTA ท้ายคอนเทนต์",
        description:
          "ต่อท้ายโพสต์หรือสคริปต์ให้เป็นธรรมชาติ ไม่ยัดเยียดเกินไป",
      },
    ],
  },
  {
    day: 5,
    title: "ตรวจคุณภาพก่อนใช้จริง",
    goal: "แยกให้ได้ว่าเนื้อหาพร้อมใช้หรือควรปรับก่อนโพสต์",
    output: "ได้เวอร์ชันที่ปรับดีขึ้น 1 เวอร์ชัน",
    tasks: [
      {
        id: "week-day-5-task-1",
        title: "ตรวจ Hook",
        description:
          "เปิดหน้าตรวจคุณภาพ Hook แล้วดูว่าข้อความควรแก้จุดไหนบ้าง",
      },
      {
        id: "week-day-5-task-2",
        title: "เพิ่มความเฉพาะเจาะจง",
        description:
          "เพิ่มกลุ่มเป้าหมาย ปัญหา สถานการณ์ หรือผลลัพธ์ให้ชัดขึ้น",
      },
      {
        id: "week-day-5-task-3",
        title: "ตัดประโยคอ่อน",
        description:
          "ลบประโยคที่กว้างเกินไป หรือฟังดูเหมือนข้อความทั่วไปที่ไม่มีจุดขาย",
      },
    ],
  },
  {
    day: 6,
    title: "เตรียมโพสต์จริง",
    goal: "จัดข้อความให้พร้อมลงแพลตฟอร์มที่เลือก",
    output: "ได้คอนเทนต์เวอร์ชันพร้อมโพสต์ 1 ชิ้น",
    tasks: [
      {
        id: "week-day-6-task-1",
        title: "เลือกแพลตฟอร์ม",
        description:
          "เลือกว่าจะใช้กับ TikTok, Reels, Shorts, Facebook หรือโพสต์ขาย",
      },
      {
        id: "week-day-6-task-2",
        title: "ปรับความยาวให้เหมาะ",
        description:
          "ถ้าเป็นคลิปให้กระชับ ถ้าเป็นโพสต์ให้แบ่งบรรทัดอ่านง่าย",
      },
      {
        id: "week-day-6-task-3",
        title: "เตรียมแคปชัน",
        description:
          "เปิดหน้าแคปชัน แล้วเลือกหรือปรับข้อความให้เข้ากับคอนเทนต์นี้",
      },
    ],
  },
  {
    day: 7,
    title: "สรุปผลและวางแผนต่อ",
    goal: "รู้ว่าอะไรทำได้ดี อะไรควรปรับ และสัปดาห์หน้าควรทำอะไรต่อ",
    output: "ได้บทเรียน 1 ชุด + หัวข้อใหม่ 3–5 หัวข้อ",
    tasks: [
      {
        id: "week-day-7-task-1",
        title: "ทบทวนงานทั้งสัปดาห์",
        description:
          "ดู Hook, โพสต์, CTA และสคริปต์ที่ทำมา แล้วเลือกสิ่งที่ดีที่สุด",
      },
      {
        id: "week-day-7-task-2",
        title: "เขียนสิ่งที่ได้เรียนรู้",
        description:
          "สรุปว่าสิ่งไหนเวิร์ก สิ่งไหนควรปรับ และจุดไหนที่ยังติดขัด",
      },
      {
        id: "week-day-7-task-3",
        title: "วางหัวข้อสัปดาห์หน้า",
        description:
          "เขียนหัวข้อใหม่ 3–5 หัวข้อ เพื่อใช้เริ่มทำงานต่อในรอบถัดไป",
      },
    ],
  },
];

function getInitialState(): WeeklyState {
  return {
    selectedDay: 1,
    completedTaskIds: [],
    notes: {},
  };
}

function readState() {
  if (typeof window === "undefined") {
    return getInitialState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return getInitialState();
  }

  try {
    return {
      ...getInitialState(),
      ...(JSON.parse(raw) as WeeklyState),
    };
  } catch {
    return getInitialState();
  }
}

function writeState(state: WeeklyState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getAllTasks() {
  return weeklyMissions.flatMap((mission) => mission.tasks);
}

export default function WeeklyDashboardPage() {
  const [state, setState] = useState<WeeklyState>(getInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    writeState(state);
  }, [hydrated, state]);

  const selectedMission =
    weeklyMissions.find((mission) => mission.day === state.selectedDay) ||
    weeklyMissions[0];

  const allTasks = useMemo(() => getAllTasks(), []);

  const completedAllTasks = allTasks.filter((task) =>
    state.completedTaskIds.includes(task.id)
  );

  const weeklyProgress =
    allTasks.length === 0
      ? 0
      : Math.round((completedAllTasks.length / allTasks.length) * 100);

  const completedDays = weeklyMissions.filter((mission) => {
    return mission.tasks.every((task) =>
      state.completedTaskIds.includes(task.id)
    );
  }).length;

  const selectedDayCompletedTasks = selectedMission.tasks.filter((task) =>
    state.completedTaskIds.includes(task.id)
  );

  const selectedDayProgress =
    selectedMission.tasks.length === 0
      ? 0
      : Math.round(
          (selectedDayCompletedTasks.length / selectedMission.tasks.length) *
            100
        );

  const selectedNote = state.notes[String(selectedMission.day)] || "";

  function updateState(nextState: Partial<WeeklyState>) {
    setState((current) => {
      return {
        ...current,
        ...nextState,
      };
    });
  }

  function toggleTask(taskId: string) {
    const exists = state.completedTaskIds.includes(taskId);

    if (exists) {
      updateState({
        completedTaskIds: state.completedTaskIds.filter((id) => id !== taskId),
      });

      return;
    }

    updateState({
      completedTaskIds: [...state.completedTaskIds, taskId],
    });
  }

  function updateNote(day: number, value: string) {
    updateState({
      notes: {
        ...state.notes,
        [String(day)]: value,
      },
    });
  }

  function resetWeek() {
    updateState({
      completedTaskIds: [],
      notes: {},
      selectedDay: 1,
    });
  }

  function getDayProgress(mission: WeeklyMission) {
    const completed = mission.tasks.filter((task) =>
      state.completedTaskIds.includes(task.id)
    ).length;

    if (mission.tasks.length === 0) return 0;

    return Math.round((completed / mission.tasks.length) * 100);
  }

  function getWeeklySummaryText() {
    const noteLines = weeklyMissions
      .map((mission) => {
        const note = state.notes[String(mission.day)] || "";

        return `วันที่ ${mission.day}: ${mission.title}\n${note || "- ยังไม่มีบันทึก"}`;
      })
      .join("\n\n");

    return `สรุปแผน 7 วัน Creator OS\nความคืบหน้ารวม: ${weeklyProgress}%\nทำครบแล้ว: ${completedDays}/7 วัน\n\n${noteLines}`;
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>แผน 7 วัน</p>

        <h1 style={titleStyle}>วางระบบทำคอนเทนต์ให้ครบใน 1 สัปดาห์</h1>

        <p style={subtitleStyle}>
          ใช้หน้านี้ดูภาพรวมทั้งสัปดาห์ ตั้งแต่เลือกกลุ่มเป้าหมาย หา Hook
          เขียนคอนเทนต์ ใส่ CTA ตรวจคุณภาพ เตรียมโพสต์ และสรุปผลเพื่อต่อยอด
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>กลับไปภารกิจวันนี้</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดีย</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ความคืบหน้าทั้งสัปดาห์</p>
          <h2 style={summaryNumberStyle}>{weeklyProgress}%</h2>
          <p style={mutedTextStyle}>
            ทำแล้ว {completedAllTasks.length} จากทั้งหมด {allTasks.length} งาน
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>วันที่ทำครบแล้ว</p>
          <h2 style={summaryNumberStyle}>{completedDays}/7</h2>
          <p style={mutedTextStyle}>นับวันที่ภารกิจย่อยครบทั้งหมด</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>วันที่เลือกอยู่</p>
          <h2 style={summaryNumberStyle}>วันที่ {selectedMission.day}</h2>
          <p style={mutedTextStyle}>{selectedMission.title}</p>
        </article>
      </section>

      <section style={progressSectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>ภาพรวมแผน</p>

            <h2 style={{ margin: "6px 0" }}>เลือกวันที่ต้องการทำงาน</h2>
          </div>

          <CopyButton text={getWeeklySummaryText()} />
        </div>

        <div style={weekGridStyle}>
          {weeklyMissions.map((mission) => {
            const progress = getDayProgress(mission);
            const active = state.selectedDay === mission.day;

            return (
              <button
                key={mission.day}
                type="button"
                onClick={() => updateState({ selectedDay: mission.day })}
                style={active ? activeDayCardStyle : dayCardStyle}
              >
                <div style={dayTopRowStyle}>
                  <span style={dayBadgeStyle}>วันที่ {mission.day}</span>
                  <strong>{progress}%</strong>
                </div>

                <h3 style={dayTitleStyle}>{mission.title}</h3>

                <p style={dayGoalStyle}>{mission.goal}</p>

                <div style={progressOuterStyle}>
                  <div
                    style={{
                      ...progressInnerStyle,
                      width: progress + "%",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section style={missionBoxStyle}>
        <div style={missionTopRowStyle}>
          <div>
            <p style={labelStyle}>วันที่ {selectedMission.day}</p>

            <h2 style={{ margin: "6px 0" }}>{selectedMission.title}</h2>

            <p style={mutedTextStyle}>{selectedMission.goal}</p>
          </div>

          <div style={progressBoxStyle}>
            <p style={progressLabelStyle}>วันนี้</p>
            <strong style={progressNumberStyle}>{selectedDayProgress}%</strong>
          </div>
        </div>

        <div style={outputBoxStyle}>
          <p style={outputLabelStyle}>ผลลัพธ์ที่ควรได้วันนี้</p>
          <p style={outputTextStyle}>{selectedMission.output}</p>
        </div>

        <div style={taskGridStyle}>
          {selectedMission.tasks.map((task) => {
            const completed = state.completedTaskIds.includes(task.id);

            return (
              <article
                key={task.id}
                style={completed ? completedTaskCardStyle : taskCardStyle}
              >
                <h3 style={{ marginTop: 0 }}>{task.title}</h3>

                <p style={taskDescriptionStyle}>{task.description}</p>

                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  style={completed ? doneButtonStyle : taskButtonStyle}
                >
                  {completed ? "ทำแล้ว" : "ทำเสร็จแล้วกดตรงนี้"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>บันทึกประจำวัน</p>

            <h2 style={{ margin: "6px 0" }}>
              เขียนสิ่งที่ทำได้หรือสิ่งที่ควรปรับ
            </h2>
          </div>

          <CopyButton text={selectedNote} />
        </div>

        <textarea
          value={selectedNote}
          onChange={(event) =>
            updateNote(selectedMission.day, event.target.value)
          }
          placeholder="บันทึกของวันนี้ เช่น ได้ Hook อะไรบ้าง เขียนโพสต์ได้ไหม ติดตรงไหน และพรุ่งนี้ควรทำอะไรต่อ..."
          style={textareaStyle}
        />
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>จบแผน 7 วันแล้วทำอะไรต่อ?</h2>

        <p style={bottomTextStyle}>
          เมื่อทำครบ 7 วัน ให้คัด Hook และคอนเทนต์ที่ดีที่สุดเก็บไว้
          แล้วนำไปต่อยอดเป็นโพสต์ คลิป แพ็กคอนเทนต์ หรือระบบขายพรีเมียมต่อได้
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/favorites">
            <button style={darkButtonStyle}>ดูไอเดียที่บันทึกไว้</button>
          </Link>

          <Link href="/quality/hooks">
            <button style={darkSecondaryButtonStyle}>ตรวจคุณภาพ Hook</button>
          </Link>

          <button type="button" onClick={resetWeek} style={darkSecondaryButtonStyle}>
            เริ่มแผนใหม่
          </button>
        </div>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "42px 24px",
  borderRadius: "24px",
  background: "#111827",
  color: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "42px",
  lineHeight: "1.15",
  margin: "12px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "860px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const buttonRowCenterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const summaryCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  background: "white",
};

const summaryLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const summaryNumberStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "38px",
};

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
};

const progressSectionStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const sectionTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const weekGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  gap: "14px",
  marginTop: "20px",
};

const dayCardStyle: CSSProperties = {
  textAlign: "left",
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
};

const activeDayCardStyle: CSSProperties = {
  textAlign: "left",
  padding: "18px",
  borderRadius: "18px",
  border: "2px solid #4f46e5",
  background: "#eef2ff",
  cursor: "pointer",
};

const dayTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "center",
};

const dayBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "white",
  border: "1px solid #e5e7eb",
  color: "#4f46e5",
  fontWeight: "bold",
  fontSize: "13px",
};

const dayTitleStyle: CSSProperties = {
  margin: "12px 0 8px",
};

const dayGoalStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.6",
  margin: 0,
};

const progressOuterStyle: CSSProperties = {
  height: "9px",
  borderRadius: "999px",
  background: "#e5e7eb",
  overflow: "hidden",
  marginTop: "14px",
};

const progressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#4f46e5",
};

const missionBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const missionTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const progressBoxStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "18px",
  background: "#eef2ff",
  minWidth: "150px",
};

const progressLabelStyle: CSSProperties = {
  margin: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const progressNumberStyle: CSSProperties = {
  display: "block",
  fontSize: "34px",
  marginTop: "4px",
};

const outputBoxStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  marginTop: "18px",
};

const outputLabelStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "#4f46e5",
  fontWeight: "bold",
};

const outputTextStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
  lineHeight: "1.7",
  fontSize: "18px",
};

const taskGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const taskCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const completedTaskCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  border: "1px solid #a7f3d0",
  background: "#ecfdf5",
};

const taskDescriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
};

const taskButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const doneButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #047857",
  background: "#047857",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const sectionStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "150px",
  marginTop: "16px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  lineHeight: "1.7",
  resize: "vertical",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "30px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const bottomTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "760px",
  margin: "0 auto",
};

const darkButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const darkSecondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};