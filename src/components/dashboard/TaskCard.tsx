"use client";

type TaskCardProps = {
  id: string;
  priority: string;
  title: string;
  time: string;
  detail: string;
  checked: boolean;
  onToggle: (taskId: string) => void;
};

function getPriorityLabel(priority: string) {
  if (priority === "must") return "🔴 ต้องทำ";
  if (priority === "should") return "🟡 ถ้ามีเวลา";
  return "🟢 โบนัส";
}

export default function TaskCard({
  id,
  priority,
  title,
  time,
  detail,
  checked,
  onToggle,
}: TaskCardProps) {
  return (
    <div
      style={{
        border: checked ? "2px solid #22c55e" : "1px solid #ddd",
        borderRadius: "18px",
        padding: "20px",
        background: checked ? "#f0fdf4" : "white",
      }}
    >
      <p style={{ margin: 0, color: "#555" }}>{getPriorityLabel(priority)}</p>

      <h3 style={{ marginBottom: "6px" }}>{title}</h3>

      <p style={{ color: "#555" }}>⏱ ใช้เวลาประมาณ {time}</p>

      <p>{detail}</p>

      <label style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(id)}
        />
        ทำภารกิจนี้แล้ว
      </label>
    </div>
  );
}
