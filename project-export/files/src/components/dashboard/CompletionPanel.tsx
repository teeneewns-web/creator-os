import Link from "next/link";

type CompletionPanelProps = {
  completedToday: boolean;
  streak: number;
  day: number;
};

export default function CompletionPanel({
  completedToday,
  streak,
  day,
}: CompletionPanelProps) {
  if (!completedToday) {
    return null;
  }

  const nextDay = day + 1;
  const hasNextDay = day < 7;

  return (
    <section
      style={{
        marginTop: "24px",
        border: "2px solid #22c55e",
        borderRadius: "20px",
        padding: "20px",
        background: "#f0fdf4",
      }}
    >
      <h2>🎉 ภารกิจ Day {day} สำเร็จแล้ว</h2>

      <p style={{ color: "#555" }}>
        วันนี้คุณทำภารกิจครบแล้ว เก็บความต่อเนื่องไว้ให้ดี
      </p>

      <p style={{ fontWeight: "bold" }}>🔥 Streak ปัจจุบัน: {streak} วัน</p>

      {hasNextDay ? (
        <Link href={"/dashboard?day=" + nextDay}>
          <button
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #22c55e",
              background: "white",
              cursor: "pointer",
            }}
          >
            ไป Day {nextDay} ต่อ
          </button>
        </Link>
      ) : (
        <Link href="/dashboard/weekly">
          <button
            style={{
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #22c55e",
              background: "white",
              cursor: "pointer",
            }}
          >
            ดูสรุปแผน 7 วัน
          </button>
        </Link>
      )}
    </section>
  );
}