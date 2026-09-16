"use client";

type MissionActionPanelProps = {
  progress: number;
  completedToday: boolean;
  onFinish: () => void;
  onReset: () => void;
};

export default function MissionActionPanel({
  progress,
  completedToday,
  onFinish,
  onReset,
}: MissionActionPanelProps) {
  const canFinish = progress === 100 && !completedToday;

  return (
    <section style={{ marginTop: "30px" }}>
      <button
        onClick={onFinish}
        disabled={!canFinish}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "14px",
          border: "none",
          background: canFinish ? "#22c55e" : "#d1d5db",
          color: "white",
          fontSize: "18px",
          cursor: canFinish ? "pointer" : "not-allowed",
        }}
      >
        {completedToday ? "✅ จบภารกิจวันนี้แล้ว" : "✅ จบภารกิจวันนี้"}
      </button>

      <button
        onClick={onReset}
        style={{
          width: "100%",
          marginTop: "12px",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          background: "white",
          cursor: "pointer",
        }}
      >
        รีเซ็ตภารกิจวันนี้
      </button>
    </section>
  );
}