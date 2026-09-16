"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type SavedProgress = {
  completedDays?: number[];
  streak?: number;
};

const STORAGE_KEY = "creator-os-dashboard-progress";

export default function WeeklyProgressSummary() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const parsed: SavedProgress = JSON.parse(saved);

      setCompletedDays(parsed.completedDays || []);
      setStreak(parsed.streak || 0);
    } catch {
      setCompletedDays([]);
      setStreak(0);
    }
  }, []);

  const completedCount = completedDays.length;
  const progress = Math.round((completedCount / 7) * 100);
  const remainingDays = 7 - completedCount;

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={labelStyle}>Weekly Progress</p>

          <h2 style={{ margin: "6px 0" }}>ความคืบหน้า 7 วัน</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            ดูภาพรวมว่าคุณทำแผนสำเร็จไปแล้วกี่วัน และเหลืออีกกี่วัน
          </p>
        </div>

        <div style={percentBoxStyle}>
          <p style={{ margin: 0, color: "#555" }}>สำเร็จแล้ว</p>
          <strong style={{ fontSize: "30px" }}>{progress}%</strong>
        </div>
      </div>

      <div style={progressTrackStyle}>
        <div
          style={{
            width: progress + "%",
            height: "100%",
            background: progress >= 100 ? "#22c55e" : "#4f46e5",
            borderRadius: "999px",
          }}
        />
      </div>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>ทำสำเร็จ</p>
          <strong style={statNumberStyle}>{completedCount} วัน</strong>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>เหลืออีก</p>
          <strong style={statNumberStyle}>{remainingDays} วัน</strong>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>Streak</p>
          <strong style={statNumberStyle}>🔥 {streak} วัน</strong>
        </div>
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const headerRowStyle: CSSProperties = {
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

const percentBoxStyle: CSSProperties = {
  minWidth: "150px",
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "12px",
  marginTop: "18px",
};

const statCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const statLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
};

const statNumberStyle: CSSProperties = {
  fontSize: "24px",
};