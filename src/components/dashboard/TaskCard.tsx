import type { CSSProperties } from "react";

type TaskCardProps = {
  title: string;
  time: string;
  detail: string;
  checked: boolean;
  onToggle: () => void;
};

export default function TaskCard({
  title,
  time,
  detail,
  checked,
  onToggle,
}: TaskCardProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        ...cardStyle,
        border: checked ? "2px solid #22c55e" : "1px solid #ddd",
        background: checked ? "#f0fdf4" : "white",
      }}
    >
      <div style={checkboxStyle}>{checked ? "✅" : "⬜"}</div>

      <div style={{ flex: 1 }}>
        <div style={topRowStyle}>
          <h3 style={{ margin: 0 }}>{title}</h3>

          <span style={timeBadgeStyle}>{time}</span>
        </div>

        <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
          {detail}
        </p>
      </div>
    </button>
  );
}

const cardStyle: CSSProperties = {
  width: "100%",
  borderRadius: "20px",
  padding: "18px",
  display: "flex",
  gap: "14px",
  cursor: "pointer",
  textAlign: "left",
};

const checkboxStyle: CSSProperties = {
  fontSize: "22px",
  flexShrink: 0,
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const timeBadgeStyle: CSSProperties = {
  padding: "5px 9px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "bold",
};