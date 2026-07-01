import type { CSSProperties } from "react";

type MissionDay = {
  day: number;
  title: string;
};

type DaySelectorProps = {
  missions: MissionDay[];
  currentDay: number;
  completedDays: number[];
  onSelectDay: (day: number) => void;
};

export default function DaySelector({
  missions,
  currentDay,
  completedDays,
  onSelectDay,
}: DaySelectorProps) {
  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={labelStyle}>7-Day Plan</p>
          <h2 style={{ margin: "6px 0" }}>เลือกวันของแผน</h2>
          <p style={{ color: "#555", marginBottom: 0 }}>
            ระบบจะจำความคืบหน้าแยกตามแต่ละ Day
          </p>
        </div>
      </div>

      <div style={dayGridStyle}>
        {missions.map((mission) => {
          const isActive = currentDay === mission.day;
          const isCompleted = completedDays.includes(mission.day);

          return (
            <button
              key={mission.day}
              onClick={() => onSelectDay(mission.day)}
              title={mission.title}
              style={{
                border: isActive
                  ? "2px solid #4f46e5"
                  : isCompleted
                  ? "2px solid #22c55e"
                  : "1px solid #ddd",
                borderRadius: "18px",
                padding: "14px",
                background: isActive
                  ? "#eef2ff"
                  : isCompleted
                  ? "#f0fdf4"
                  : "white",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: isCompleted ? "#16a34a" : "#4f46e5",
                  fontWeight: "bold",
                }}
              >
                Day {mission.day} {isCompleted ? "✅" : ""}
              </p>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                {mission.title}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: "24px",
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

const dayGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
  gap: "12px",
  marginTop: "18px",
};