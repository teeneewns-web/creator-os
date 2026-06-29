"use client";

import { useEffect, useState } from "react";

type SavedProgress = {
  completedDays: number[];
  streak: number;
};

const STORAGE_KEY = "creator-os-dashboard-progress";

export default function WeeklyProgressSummary() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const parsed: SavedProgress = JSON.parse(saved);

    setCompletedDays(parsed.completedDays || []);
    setStreak(parsed.streak || 0);
  }, []);

  const completedCount = completedDays.length;
  const progress = Math.round((completedCount / 7) * 100);

  return (
    <section
      style={{
        marginTop: "24px",
        border: "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px",
        background: "#f8fafc",
      }}
    >
      <h2>📊 ความคืบหน้าแผน 7 วัน</h2>

      <p style={{ color: "#555" }}>
        คุณทำสำเร็จแล้ว {completedCount} จาก 7 วัน
      </p>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "12px",
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

      <p style={{ marginTop: "12px", fontWeight: "bold" }}>
        ความคืบหน้า {progress}%
      </p>

      <p style={{ color: "#555" }}>🔥 Streak ปัจจุบัน: {streak} วัน</p>
    </section>
  );
}