"use client";

type TimeMode = "15" | "30" | "60";

type ProgressPanelProps = {
  timeMode: TimeMode;
  onChangeTimeMode: (value: TimeMode) => void;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
};

export default function ProgressPanel({
  timeMode,
  onChangeTimeMode,
  progress,
  completedTasks,
  totalTasks,
  streak,
}: ProgressPanelProps) {
  return (
    <section
      style={{
        marginTop: "24px",
        border: "2px solid #4f46e5",
        borderRadius: "22px",
        padding: "24px",
        background: "#f8faff",
      }}
    >
      <h2>⏰ วันนี้คุณมีเวลากี่นาที?</h2>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
        <button
          onClick={() => onChangeTimeMode("15")}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: timeMode === "15" ? "2px solid #4f46e5" : "1px solid #ddd",
            background: timeMode === "15" ? "#eef2ff" : "white",
            cursor: "pointer",
          }}
        >
          15 นาที
        </button>

        <button
          onClick={() => onChangeTimeMode("30")}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: timeMode === "30" ? "2px solid #4f46e5" : "1px solid #ddd",
            background: timeMode === "30" ? "#eef2ff" : "white",
            cursor: "pointer",
          }}
        >
          30 นาที
        </button>

        <button
          onClick={() => onChangeTimeMode("60")}
          style={{
            padding: "12px 18px",
            borderRadius: "12px",
            border: timeMode === "60" ? "2px solid #4f46e5" : "1px solid #ddd",
            background: timeMode === "60" ? "#eef2ff" : "white",
            cursor: "pointer",
          }}
        >
          60 นาที
        </button>
      </div>

      <div style={{ marginTop: "24px" }}>
        <h3>📊 ความคืบหน้าวันนี้</h3>

        <div
          style={{
            width: "100%",
            height: "14px",
            background: "#e5e7eb",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: progress + "%",
              height: "100%",
              background: "#4f46e5",
            }}
          />
        </div>

        <p style={{ color: "#555" }}>
          ทำแล้ว {completedTasks} จาก {totalTasks} ภารกิจ ({progress}%)
        </p>

        <p style={{ fontWeight: "bold" }}>🔥 ทำต่อเนื่อง {streak} วัน</p>
      </div>
    </section>
  );
}
