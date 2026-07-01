import type { CSSProperties } from "react";
import { type TimeMode } from "../../hooks/useDashboardProgress";

type ProgressPanelProps = {
  timeMode: TimeMode;
  onChangeTimeMode: (mode: TimeMode) => void;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
};

const timeOptions: {
  value: TimeMode;
  label: string;
  description: string;
}[] = [
  {
    value: "15",
    label: "15 นาที",
    description: "ทำภารกิจสำคัญที่สุด",
  },
  {
    value: "30",
    label: "30 นาที",
    description: "ทำภารกิจหลัก + เสริม",
  },
  {
    value: "60",
    label: "60 นาที",
    description: "ทำครบทั้งระบบ",
  },
];

export default function ProgressPanel({
  timeMode,
  onChangeTimeMode,
  progress,
  completedTasks,
  totalTasks,
  streak,
}: ProgressPanelProps) {
  return (
    <section style={panelStyle}>
      <div style={topRowStyle}>
        <div>
          <p style={labelStyle}>Today Progress</p>

          <h2 style={{ margin: "8px 0" }}>ความคืบหน้าภารกิจ</h2>

          <p style={{ color: "#555", marginBottom: 0 }}>
            ทำแล้ว {completedTasks} จาก {totalTasks} งาน
          </p>
        </div>

        <div style={streakBoxStyle}>
          <p style={{ margin: 0, color: "#555" }}>🔥 Streak</p>
          <strong style={{ fontSize: "26px" }}>{streak} วัน</strong>
        </div>
      </div>

      <div style={progressTrackStyle}>
        <div
          style={{
            width: progress + "%",
            height: "100%",
            background: "#4f46e5",
            borderRadius: "999px",
          }}
        />
      </div>

      <p style={{ fontWeight: "bold", marginTop: "10px" }}>
        ความคืบหน้า {progress}%
      </p>

      <div style={timeGridStyle}>
        {timeOptions.map((option) => {
          const active = timeMode === option.value;

          return (
            <button
              key={option.value}
              onClick={() => onChangeTimeMode(option.value)}
              style={{
                border: active ? "2px solid #4f46e5" : "1px solid #ddd",
                borderRadius: "18px",
                padding: "16px",
                background: active ? "#eef2ff" : "white",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <strong>{option.label}</strong>

              <p style={{ color: "#555", marginBottom: 0 }}>
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const panelStyle: CSSProperties = {
  marginTop: "24px",
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const streakBoxStyle: CSSProperties = {
  minWidth: "140px",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const progressTrackStyle: CSSProperties = {
  width: "100%",
  height: "14px",
  background: "#e5e7eb",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "18px",
};

const timeGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "12px",
  marginTop: "18px",
};