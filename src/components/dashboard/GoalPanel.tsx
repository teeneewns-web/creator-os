import type { CSSProperties } from "react";

type GoalPanelProps = {
  title: string;
  description: string;
};

export default function GoalPanel({ title, description }: GoalPanelProps) {
  return (
    <section style={sectionStyle}>
      <div style={iconBoxStyle}>🎯</div>

      <div>
        <p style={labelStyle}>Today Goal</p>

        <h2 style={{ margin: "6px 0" }}>{title}</h2>

        <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
          {description}
        </p>
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: "24px",
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "#f8fafc",
  display: "flex",
  gap: "18px",
  alignItems: "flex-start",
};

const iconBoxStyle: CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "16px",
  background: "#eef2ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  flexShrink: 0,
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};