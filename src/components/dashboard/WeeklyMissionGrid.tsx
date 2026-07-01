"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

type MissionGoal =
  | string
  | {
      title?: string;
      description?: string;
    };

type Mission = {
  day: number;
  title: string;
  goal?: MissionGoal;
  description?: string;
};

type WeeklyMissionGridProps = {
  missions: Mission[];
};

type SavedProgress = {
  completedDays?: number[];
};

const STORAGE_KEY = "creator-os-dashboard-progress";

function getGoalTitle(mission: Mission) {
  if (!mission.goal) return "";

  if (typeof mission.goal === "string") {
    return mission.goal;
  }

  return mission.goal.title || "";
}

function getGoalDescription(mission: Mission) {
  if (mission.description) {
    return mission.description;
  }

  if (!mission.goal) {
    return "";
  }

  if (typeof mission.goal === "string") {
    return mission.goal;
  }

  return mission.goal.description || "";
}

export default function WeeklyMissionGrid({ missions }: WeeklyMissionGridProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const parsed: SavedProgress = JSON.parse(saved);
      setCompletedDays(parsed.completedDays || []);
    } catch {
      setCompletedDays([]);
    }
  }, []);

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Mission Map</p>

      <h2 style={{ margin: "6px 0" }}>แผนภารกิจทั้ง 7 วัน</h2>

      <p style={{ color: "#555", lineHeight: "1.7" }}>
        กดเลือก Day เพื่อกลับไปทำภารกิจ หรือดูว่าวันไหนทำสำเร็จแล้ว
      </p>

      <div style={gridStyle}>
        {missions.map((mission) => {
          const isCompleted = completedDays.includes(mission.day);
          const goalTitle = getGoalTitle(mission);
          const goalDescription = getGoalDescription(mission);

          return (
            <article
              key={mission.day}
              style={{
                border: isCompleted ? "2px solid #22c55e" : "1px solid #ddd",
                borderRadius: "20px",
                padding: "18px",
                background: isCompleted ? "#f0fdf4" : "white",
              }}
            >
              <p
                style={{
                  marginTop: 0,
                  color: isCompleted ? "#16a34a" : "#4f46e5",
                  fontWeight: "bold",
                }}
              >
                Day {mission.day} {isCompleted ? "✅ สำเร็จแล้ว" : "ยังไม่สำเร็จ"}
              </p>

              <h3 style={{ lineHeight: "1.45", marginBottom: "8px" }}>
                {mission.title}
              </h3>

              {goalTitle ? (
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  🎯 {goalTitle}
                </p>
              ) : null}

              {goalDescription ? (
                <p style={{ color: "#555", lineHeight: "1.7" }}>
                  {goalDescription}
                </p>
              ) : null}

              <Link href={"/dashboard?day=" + mission.day}>
                <button
                  style={isCompleted ? completedButtonStyle : primaryButtonStyle}
                >
                  {isCompleted ? "ดูภารกิจนี้อีกครั้ง" : "เริ่ม Day " + mission.day}
                </button>
              </Link>
            </article>
          );
        })}
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

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "14px",
  marginTop: "18px",
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "12px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const completedButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "12px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #22c55e",
  background: "white",
  color: "#16a34a",
  cursor: "pointer",
  fontWeight: "bold",
};