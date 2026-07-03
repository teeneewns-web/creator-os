"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../../components/dashboard/CopyButton";

type TimeMode = "15" | "30" | "60";

type DailyTask = {
  id: string;
  title: string;
  description: string;
  time: string;
};

type DailyMission = {
  day: number;
  title: string;
  goal: string;
  tasks: DailyTask[];
  draftPrompt: string;
};

type DashboardState = {
  day: number;
  timeMode: TimeMode;
  completedTaskIds: string[];
  checklist: Record<string, boolean>;
  draftText: string;
  resultText: string;
  noteText: string;
};

const STORAGE_KEY = "creator-os-dashboard-thai";

const missions: DailyMission[] = [
  {
    day: 1,
    title: "ตั้งหลักให้ชัด",
    goal: "รู้ว่าวันนี้จะทำคอนเทนต์เรื่องอะไร และทำเพื่อใคร",
    draftPrompt:
      "วันนี้ฉันจะทำคอนเทนต์เรื่อง ________ สำหรับกลุ่มคน ________ เพื่อให้เขา ________",
    tasks: [
      {
        id: "day-1-task-1",
        title: "เลือกกลุ่มเป้าหมาย",
        description:
          "เขียนให้ชัดว่าคอนเทนต์นี้พูดกับใคร เช่น มือใหม่ เจ้าของร้าน Creator หรือคนขายของออนไลน์",
        time: "5 นาที",
      },
      {
        id: "day-1-task-2",
        title: "เลือกปัญหาหลัก",
        description:
          "เลือกปัญหาที่คนดูเจอจริง 1 อย่าง แล้วใช้เป็นแกนหลักของคอนเทนต์",
        time: "5 นาที",
      },
      {
        id: "day-1-task-3",
        title: "เลือก Hook",
        description:
          "เปิดคลัง Hook หรือหน้าค้นหา แล้วเลือกประโยคเปิดที่เข้ากับปัญหานั้น",
        time: "10 นาที",
      },
      {
        id: "day-1-task-4",
        title: "เขียนร่างโพสต์แรก",
        description:
          "นำ Hook มาต่อเป็นโพสต์สั้น ๆ หรือสคริปต์คลิปสั้น 1 ชิ้น",
        time: "20 นาที",
      },
    ],
  },
  {
    day: 2,
    title: "ทำให้คนหยุดดู",
    goal: "ฝึกเลือกประโยคเปิดที่ทำให้คนสนใจใน 3 วินาทีแรก",
    draftPrompt:
      "Hook ที่ฉันจะใช้วันนี้คือ ________ เพราะมันแตะปัญหา ________ ของคนดู",
    tasks: [
      {
        id: "day-2-task-1",
        title: "ค้นหา Hook 5 แบบ",
        description: "เลือก Hook ที่เกี่ยวกับหัวข้อเดียวกันอย่างน้อย 5 ข้อ",
        time: "10 นาที",
      },
      {
        id: "day-2-task-2",
        title: "คัด Hook ที่ดีที่สุด",
        description:
          "เลือก Hook ที่เจาะปัญหาคนดูชัดที่สุด ไม่ใช่ประโยคกว้าง ๆ",
        time: "10 นาที",
      },
      {
        id: "day-2-task-3",
        title: "ปรับคำให้เป็นภาษาของตัวเอง",
        description:
          "อย่าคัดลอกแบบทื่อ ๆ ให้ปรับคำให้เข้ากับสินค้า เพจ หรือสไตล์ของคุณ",
        time: "15 นาที",
      },
      {
        id: "day-2-task-4",
        title: "บันทึก Hook ที่ชอบ",
        description: "กดบันทึก Hook ที่อาจนำไปใช้ต่อในอนาคต",
        time: "5 นาที",
      },
    ],
  },
  {
    day: 3,
    title: "ต่อ Hook เป็นเนื้อหา",
    goal: "เปลี่ยนประโยคเปิดให้กลายเป็นโพสต์หรือสคริปต์ที่ใช้ได้จริง",
    draftPrompt:
      "หลังจาก Hook แล้ว ฉันจะเล่าต่อว่า ________ และปิดท้ายด้วย ________",
    tasks: [
      {
        id: "day-3-task-1",
        title: "เลือก Hook ที่บันทึกไว้",
        description: "เปิดหน้าไอเดียที่บันทึกไว้ แล้วเลือก Hook 1 ข้อ",
        time: "5 นาที",
      },
      {
        id: "day-3-task-2",
        title: "เขียนเนื้อหากลาง",
        description:
          "อธิบายปัญหา เหตุผล หรือประสบการณ์ที่เกี่ยวข้องกับ Hook นั้น",
        time: "15 นาที",
      },
      {
        id: "day-3-task-3",
        title: "เพิ่มตัวอย่าง",
        description:
          "ใส่ตัวอย่างจริง เพื่อให้คนดูรู้สึกว่าเนื้อหานี้เกี่ยวกับเขา",
        time: "10 นาที",
      },
      {
        id: "day-3-task-4",
        title: "เลือก CTA",
        description: "ปิดท้ายด้วยคำชวนให้ติดตาม ทักแชต บันทึก หรือซื้อสินค้า",
        time: "10 นาที",
      },
    ],
  },
  {
    day: 4,
    title: "ทำให้โพสต์มีเป้าหมาย",
    goal: "รู้ว่าโพสต์นี้ต้องการยอดดู ยอดติดตาม ยอดทัก หรือยอดขาย",
    draftPrompt:
      "เป้าหมายของคอนเทนต์วันนี้คือ ________ ดังนั้นท้ายโพสต์ฉันจะชวนให้คนดู ________",
    tasks: [
      {
        id: "day-4-task-1",
        title: "เลือกเป้าหมายเดียว",
        description: "เลือกแค่ 1 เป้าหมาย เช่น ให้คนติดตาม ให้คนทัก หรือให้คนซื้อ",
        time: "5 นาที",
      },
      {
        id: "day-4-task-2",
        title: "เลือก CTA ให้ตรงเป้าหมาย",
        description:
          "เปิดหน้า CTA แล้วเลือกคำชวนให้ทำที่เข้ากับเป้าหมายของวันนี้",
        time: "10 นาที",
      },
      {
        id: "day-4-task-3",
        title: "เขียนโพสต์ให้ไหลลื่น",
        description: "เชื่อม Hook เนื้อหา และ CTA ให้เป็นเรื่องเดียวกัน",
        time: "20 นาที",
      },
      {
        id: "day-4-task-4",
        title: "อ่านออกเสียง",
        description:
          "อ่านโพสต์หรือสคริปต์ออกเสียง 1 รอบ เพื่อตรวจว่าภาษาธรรมชาติไหม",
        time: "5 นาที",
      },
    ],
  },
  {
    day: 5,
    title: "ตรวจคุณภาพก่อนใช้จริง",
    goal: "แยกให้ได้ว่าอะไรพร้อมใช้ อะไรควรปรับก่อนโพสต์",
    draftPrompt:
      "จุดที่ฉันควรปรับในคอนเทนต์นี้คือ ________ เพื่อให้คนดูรู้สึกว่า ________",
    tasks: [
      {
        id: "day-5-task-1",
        title: "ตรวจ Hook",
        description: "เปิดหน้าตรวจคุณภาพ Hook แล้วดูว่าควรปรับอะไรบ้าง",
        time: "10 นาที",
      },
      {
        id: "day-5-task-2",
        title: "แก้คำให้เฉพาะเจาะจง",
        description:
          "เพิ่มกลุ่มเป้าหมาย ปัญหา หรือสถานการณ์ให้ชัดขึ้น",
        time: "15 นาที",
      },
      {
        id: "day-5-task-3",
        title: "ตัดคำกว้าง ๆ",
        description:
          "ลบประโยคที่เหมือนคำพูดทั่วไป และแทนด้วยข้อความที่จับต้องได้",
        time: "10 นาที",
      },
      {
        id: "day-5-task-4",
        title: "คัดเวอร์ชันสุดท้าย",
        description: "เลือกเวอร์ชันที่พร้อมนำไปโพสต์หรือถ่ายคลิปมากที่สุด",
        time: "10 นาที",
      },
    ],
  },
  {
    day: 6,
    title: "เตรียมเผยแพร่",
    goal: "จัดข้อความให้พร้อมนำไปลงแพลตฟอร์มจริง",
    draftPrompt:
      "คอนเทนต์นี้จะลงที่ ________ รูปแบบคือ ________ และควรโพสต์เวลา ________",
    tasks: [
      {
        id: "day-6-task-1",
        title: "เลือกแพลตฟอร์ม",
        description: "เลือกว่าจะใช้กับ TikTok, Facebook, Reels, Shorts หรือโพสต์ขาย",
        time: "5 นาที",
      },
      {
        id: "day-6-task-2",
        title: "ปรับความยาว",
        description:
          "ถ้าเป็นคลิปสั้น ให้กระชับ ถ้าเป็นโพสต์ ให้เว้นบรรทัดอ่านง่าย",
        time: "15 นาที",
      },
      {
        id: "day-6-task-3",
        title: "เตรียมแคปชัน",
        description: "เปิดหน้าแคปชัน แล้วเลือกหรือปรับให้เข้ากับคอนเทนต์นี้",
        time: "10 นาที",
      },
      {
        id: "day-6-task-4",
        title: "เก็บเวอร์ชันสุดท้าย",
        description:
          "คัดลอกข้อความสุดท้ายเก็บไว้ เพื่อพร้อมโพสต์หรือถ่ายคลิป",
        time: "10 นาที",
      },
    ],
  },
  {
    day: 7,
    title: "สรุปผลและวางแผนต่อ",
    goal: "ดูว่าอะไรใช้ได้ดี และควรทำคอนเทนต์แบบไหนต่อ",
    draftPrompt:
      "สิ่งที่ฉันได้เรียนรู้จากสัปดาห์นี้คือ ________ และสัปดาห์หน้าควรทำต่อเรื่อง ________",
    tasks: [
      {
        id: "day-7-task-1",
        title: "ดูงานที่ทำไปแล้ว",
        description: "ย้อนดู Hook โพสต์ หรือสคริปต์ที่ทำในสัปดาห์นี้",
        time: "10 นาที",
      },
      {
        id: "day-7-task-2",
        title: "เลือกสิ่งที่ดีที่สุด",
        description:
          "เลือกไอเดียที่น่าต่อยอดที่สุด 1–3 ข้อ แล้วบันทึกไว้",
        time: "10 นาที",
      },
      {
        id: "day-7-task-3",
        title: "เขียนสิ่งที่ควรปรับ",
        description:
          "สรุปว่า Hook, เนื้อหา หรือ CTA ตรงไหนควรดีขึ้น",
        time: "15 นาที",
      },
      {
        id: "day-7-task-4",
        title: "วางหัวข้อสัปดาห์หน้า",
        description: "เลือกหัวข้อใหม่ 3–5 หัวข้อสำหรับทำต่อ",
        time: "15 นาที",
      },
    ],
  },
];

const checklistItems = [
  "Hook เจาะปัญหาหรือความอยากรู้ของคนดูชัด",
  "เนื้อหากลางไม่กว้างเกินไป",
  "มีตัวอย่างหรือสถานการณ์จริง",
  "CTA ตรงกับเป้าหมายของโพสต์",
  "ภาษาอ่านง่ายและเหมาะกับแพลตฟอร์ม",
];

function getInitialState(): DashboardState {
  return {
    day: 1,
    timeMode: "30",
    completedTaskIds: [],
    checklist: {},
    draftText: "",
    resultText: "",
    noteText: "",
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
      ...(JSON.parse(raw) as DashboardState),
    };
  } catch {
    return getInitialState();
  }
}

function writeState(state: DashboardState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getVisibleTaskCount(timeMode: TimeMode) {
  if (timeMode === "15") return 2;
  if (timeMode === "30") return 3;

  return 4;
}

export default function DashboardClient() {
  const [state, setState] = useState<DashboardState>(getInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    writeState(state);
  }, [hydrated, state]);

  const currentMission =
    missions.find((mission) => mission.day === state.day) || missions[0];

  const visibleTasks = useMemo(() => {
    return currentMission.tasks.slice(0, getVisibleTaskCount(state.timeMode));
  }, [currentMission, state.timeMode]);

  const completedVisibleTasks = visibleTasks.filter((task) =>
    state.completedTaskIds.includes(task.id)
  );

  const progress =
    visibleTasks.length === 0
      ? 0
      : Math.round((completedVisibleTasks.length / visibleTasks.length) * 100);

  function updateState(nextState: Partial<DashboardState>) {
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

  function toggleChecklist(item: string) {
    updateState({
      checklist: {
        ...state.checklist,
        [item]: !state.checklist[item],
      },
    });
  }

  function goNextDay() {
    const nextDay = state.day >= 7 ? 1 : state.day + 1;

    updateState({
      day: nextDay,
    });
  }

  function resetToday() {
    const taskIds = currentMission.tasks.map((task) => task.id);

    updateState({
      completedTaskIds: state.completedTaskIds.filter(
        (id) => !taskIds.includes(id)
      ),
      draftText: "",
      resultText: "",
      noteText: "",
    });
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>ภารกิจวันนี้</p>

        <h1 style={titleStyle}>รู้ทันทีว่าวันนี้ต้องทำคอนเทนต์อะไร</h1>

        <p style={subtitleStyle}>
          ใช้หน้านี้เป็นหน้าทำงานประจำวัน เลือกเวลาที่มี ทำตามภารกิจ
          เขียนร่าง ตรวจคุณภาพ แล้วบันทึกผลลัพธ์ไว้ต่อยอดในวันถัดไป
        </p>

        <div style={buttonRowStyle}>
          <Link href="/search">
            <button style={primaryButtonStyle}>ค้นหาไอเดีย</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>

          <Link href="/dashboard/weekly">
            <button style={secondaryButtonStyle}>ดูแผน 7 วัน</button>
          </Link>
        </div>
      </section>

      <section style={controlGridStyle}>
        <article style={controlCardStyle}>
          <p style={controlLabelStyle}>เลือกวันที่ทำงาน</p>

          <div style={buttonRowStyle}>
            {missions.map((mission) => (
              <button
                key={mission.day}
                type="button"
                onClick={() => updateState({ day: mission.day })}
                style={
                  state.day === mission.day
                    ? activePillButtonStyle
                    : pillButtonStyle
                }
              >
                วันที่ {mission.day}
              </button>
            ))}
          </div>
        </article>

        <article style={controlCardStyle}>
          <p style={controlLabelStyle}>วันนี้มีเวลากี่นาที</p>

          <div style={buttonRowStyle}>
            {(["15", "30", "60"] as TimeMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateState({ timeMode: mode })}
                style={
                  state.timeMode === mode
                    ? activePillButtonStyle
                    : pillButtonStyle
                }
              >
                {mode} นาที
              </button>
            ))}
          </div>
        </article>
      </section>

      <section style={missionBoxStyle}>
        <div style={missionTopRowStyle}>
          <div>
            <p style={labelStyle}>วันที่ {currentMission.day}</p>

            <h2 style={{ margin: "6px 0" }}>{currentMission.title}</h2>

            <p style={mutedTextStyle}>{currentMission.goal}</p>
          </div>

          <div style={progressBoxStyle}>
            <p style={progressLabelStyle}>ความคืบหน้า</p>
            <strong style={progressNumberStyle}>{progress}%</strong>
          </div>
        </div>

        <div style={progressOuterStyle}>
          <div style={{ ...progressInnerStyle, width: progress + "%" }} />
        </div>

        <div style={taskGridStyle}>
          {visibleTasks.map((task) => {
            const completed = state.completedTaskIds.includes(task.id);

            return (
              <article
                key={task.id}
                style={completed ? completedTaskCardStyle : taskCardStyle}
              >
                <div style={taskTopRowStyle}>
                  <h3 style={{ margin: 0 }}>{task.title}</h3>

                  <span style={timeBadgeStyle}>{task.time}</span>
                </div>

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
            <p style={labelStyle}>ร่างคอนเทนต์วันนี้</p>

            <h2 style={{ margin: "6px 0" }}>เขียนร่างจากโจทย์นี้</h2>
          </div>

          <CopyButton text={state.draftText || currentMission.draftPrompt} />
        </div>

        <div style={promptBoxStyle}>
          <p style={promptLabelStyle}>โจทย์ช่วยเริ่มเขียน</p>
          <p style={promptTextStyle}>{currentMission.draftPrompt}</p>
        </div>

        <textarea
          value={state.draftText}
          onChange={(event) => updateState({ draftText: event.target.value })}
          placeholder="เขียนร่าง Hook, โพสต์, แคปชัน หรือสคริปต์ของวันนี้ตรงนี้..."
          style={textareaStyle}
        />
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>เช็กก่อนนำไปใช้จริง</p>

        <h2 style={{ margin: "6px 0" }}>เช็กลิสต์คุณภาพ</h2>

        <div style={checklistGridStyle}>
          {checklistItems.map((item) => (
            <label key={item} style={checkItemStyle}>
              <input
                type="checkbox"
                checked={Boolean(state.checklist[item])}
                onChange={() => toggleChecklist(item)}
              />

              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>ผลลัพธ์วันนี้</p>

            <h2 style={{ margin: "6px 0" }}>บันทึกสิ่งที่ทำเสร็จ</h2>
          </div>

          <CopyButton text={state.resultText} />
        </div>

        <textarea
          value={state.resultText}
          onChange={(event) => updateState({ resultText: event.target.value })}
          placeholder="สรุปว่าวันนี้ทำอะไรเสร็จ เช่น ได้ Hook 3 ข้อ ได้โพสต์ 1 ชิ้น ได้สคริปต์ 1 คลิป..."
          style={textareaStyle}
        />

        <textarea
          value={state.noteText}
          onChange={(event) => updateState({ noteText: event.target.value })}
          placeholder="บันทึกสิ่งที่ได้เรียนรู้ หรือสิ่งที่ควรปรับในวันพรุ่งนี้..."
          style={textareaStyle}
        />
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>จบงานวันนี้แล้วไปต่อ</h2>

        <p style={bottomTextStyle}>
          ถ้าทำภารกิจครบแล้ว ให้ไปวันที่ถัดไป หรือเปิดแผน 7 วันเพื่อดูภาพรวมทั้งหมด
        </p>

        <div style={buttonRowCenterStyle}>
          <button type="button" onClick={goNextDay} style={darkButtonStyle}>
            ไปวันที่ถัดไป
          </button>

          <Link href="/dashboard/weekly">
            <button style={darkSecondaryButtonStyle}>ดูแผน 7 วัน</button>
          </Link>

          <button type="button" onClick={resetToday} style={darkSecondaryButtonStyle}>
            ล้างงานวันนี้
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
  maxWidth: "820px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
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

const controlGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const controlCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const controlLabelStyle: CSSProperties = {
  marginTop: 0,
  fontWeight: "bold",
};

const pillButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#374151",
};

const activePillButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #4f46e5",
  background: "#eef2ff",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#4f46e5",
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

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
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

const progressOuterStyle: CSSProperties = {
  height: "10px",
  borderRadius: "999px",
  background: "#e5e7eb",
  overflow: "hidden",
  marginTop: "18px",
};

const progressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#4f46e5",
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

const taskTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "center",
};

const timeBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "white",
  border: "1px solid #e5e7eb",
  color: "#555",
  fontSize: "13px",
  fontWeight: "bold",
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

const sectionTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const promptBoxStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  marginTop: "16px",
};

const promptLabelStyle: CSSProperties = {
  margin: "0 0 8px",
  color: "#4f46e5",
  fontWeight: "bold",
};

const promptTextStyle: CSSProperties = {
  margin: 0,
  color: "#111827",
  lineHeight: "1.7",
  fontSize: "18px",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "130px",
  marginTop: "16px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  lineHeight: "1.7",
  resize: "vertical",
};

const checklistGridStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "16px",
};

const checkItemStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  color: "#374151",
  lineHeight: "1.6",
  cursor: "pointer",
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