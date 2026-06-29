"use client";

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
    <section
      style={{
        marginTop: "24px",
        border: "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px",
        background: "white",
      }}
    >
      <h2>📅 เลือกวันของแผน</h2>

      <p style={{ color: "#555" }}>
        เลือก Day ที่ต้องการทำ ระบบจะจำความคืบหน้าแยกตามแต่ละวัน
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "16px",
        }}
      >
        {missions.map((mission) => {
          const isCompleted = completedDays.includes(mission.day);

          return (
            <button
              key={mission.day}
              onClick={() => onSelectDay(mission.day)}
              title={mission.title}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border:
                  currentDay === mission.day
                    ? "2px solid #4f46e5"
                    : isCompleted
                    ? "2px solid #22c55e"
                    : "1px solid #ddd",
                background:
                  currentDay === mission.day
                    ? "#eef2ff"
                    : isCompleted
                    ? "#f0fdf4"
                    : "white",
                cursor: "pointer",
                fontWeight: currentDay === mission.day ? "bold" : "normal",
              }}
            >
              Day {mission.day} {isCompleted ? "✅" : ""}
            </button>
          );
        })}
      </div>
    </section>
  );
}