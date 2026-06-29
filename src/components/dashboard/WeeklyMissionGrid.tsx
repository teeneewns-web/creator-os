"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MissionTask = {
  id: string;
  title: string;
};

type MissionGoal = {
  title: string;
  description: string;
};

type Mission = {
  day: number;
  title: string;
  goal: MissionGoal;
  tasks: MissionTask[];
};

type WeeklyMissionGridProps = {
  missions: Mission[];
};

type SavedProgress = {
  completedDays: number[];
};

const STORAGE_KEY = "creator-os-dashboard-progress";

export default function WeeklyMissionGrid({ missions }: WeeklyMissionGridProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const parsed: SavedProgress = JSON.parse(saved);

    setCompletedDays(parsed.completedDays || []);
  }, []);

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: "16px",
        marginTop: "30px",
      }}
    >
      {missions.map((mission) => {
        const isCompleted = completedDays.includes(mission.day);

        return (
          <div
            key={mission.day}
            style={{
              border: isCompleted ? "2px solid #22c55e" : "1px solid #ddd",
              borderRadius: "18px",
              padding: "20px",
              background: isCompleted ? "#f0fdf4" : "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <p style={{ color: "#4f46e5", fontWeight: "bold" }}>
                Day {mission.day}
              </p>

              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: isCompleted ? "#16a34a" : "#777",
                }}
              >
                {isCompleted ? "✅ ทำแล้ว" : "ยังไม่ได้ทำ"}
              </span>
            </div>

            <h2 style={{ fontSize: "22px" }}>{mission.title}</h2>

            <p style={{ color: "#555" }}>{mission.goal.description}</p>

            <ul>
              {mission.tasks.slice(0, 2).map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>

            <Link href={"/dashboard?day=" + mission.day}>
              <button style={{ marginTop: "12px" }}>
                {isCompleted
                  ? "ดู Day " + mission.day + " อีกครั้ง"
                  : "เปิด Day " + mission.day}
              </button>
            </Link>
          </div>
        );
      })}
    </section>
  );
}