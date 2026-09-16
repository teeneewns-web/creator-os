"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

type SavedProgress = {
  completedDays?: number[];
  streak?: number;
};

type ResultData = {
  likes?: string;
  comments?: string;
  shares?: string;
  lesson?: string;
};

const PROGRESS_KEY = "creator-os-dashboard-progress";

function safeParseResult(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value) as ResultData;
  } catch {
    return null;
  }
}

function safeParseProgress(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value) as SavedProgress;
  } catch {
    return null;
  }
}

export default function WeeklyReportExport() {
  const [report, setReport] = useState("");

  function createReport() {
    const progress = safeParseProgress(localStorage.getItem(PROGRESS_KEY));
    const completedDays = progress?.completedDays || [];
    const streak = progress?.streak || 0;

    const lines: string[] = [];

    lines.push("Creator OS - Weekly Report");
    lines.push("");
    lines.push("สรุปภาพรวม");
    lines.push("- ทำสำเร็จ: " + completedDays.length + " / 7 วัน");
    lines.push("- Streak: " + streak + " วัน");
    lines.push("- Day ที่สำเร็จ: " + (completedDays.length > 0 ? completedDays.join(", ") : "-"));
    lines.push("");

    lines.push("ผลลัพธ์แต่ละวัน");

    for (let day = 1; day <= 7; day++) {
      const result = safeParseResult(
        localStorage.getItem("creator-os-post-result-day-" + day)
      );

      const draft = localStorage.getItem("creator-os-post-draft-day-" + day) || "";

      if (result || draft) {
        lines.push("");
        lines.push("Day " + day);
        lines.push("- Likes: " + (result?.likes || "0"));
        lines.push("- Comments: " + (result?.comments || "0"));
        lines.push("- Shares: " + (result?.shares || "0"));

        if (result?.lesson) {
          lines.push("- Lesson: " + result.lesson);
        }

        if (draft) {
          lines.push("- Draft: " + draft);
        }
      }
    }

    lines.push("");
    lines.push("สรุปสิ่งที่ควรทำต่อ");
    lines.push("- ดูว่าโพสต์แบบไหนได้คอมเมนต์หรือแชร์มากกว่า");
    lines.push("- เก็บ Hook ที่เวิร์กไว้ใช้ซ้ำ");
    lines.push("- ปรับ CTA จากบทเรียนที่บันทึกไว้");

    setReport(lines.join("\n"));
  }

  useEffect(() => {
    createReport();
  }, []);

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Export Report</p>

      <h2 style={{ margin: "6px 0" }}>สรุปรายงาน 7 วัน</h2>

      <p style={{ color: "#555", lineHeight: "1.7" }}>
        รวมความคืบหน้า ผลลัพธ์ ร่างโพสต์ และบทเรียน ออกมาเป็นข้อความเดียว
        เพื่อคัดลอกไปเก็บต่อได้
      </p>

      <textarea
        value={report}
        readOnly
        style={textareaStyle}
      />

      <div style={buttonRowStyle}>
        <CopyButton text={report} />

        <button onClick={createReport} style={secondaryButtonStyle}>
          อัปเดตรายงาน
        </button>
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "22px",
  background: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "220px",
  marginTop: "12px",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #ddd",
  fontSize: "14px",
  lineHeight: "1.7",
  resize: "vertical",
  background: "#f8fafc",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};