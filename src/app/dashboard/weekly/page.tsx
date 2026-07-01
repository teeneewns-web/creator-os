import type { CSSProperties } from "react";
import Link from "next/link";
import WeeklyProgressSummary from "../../../components/dashboard/WeeklyProgressSummary";
import WeeklyResultSummary from "../../../components/dashboard/WeeklyResultSummary";
import WeeklyLearningNotes from "../../../components/dashboard/WeeklyLearningNotes";
import WeeklyDraftArchive from "../../../components/dashboard/WeeklyDraftArchive";
import WeeklyReportExport from "../../../components/dashboard/WeeklyReportExport";
import WeeklyMissionGrid from "../../../components/dashboard/WeeklyMissionGrid";
import ResetWeeklyDataPanel from "../../../components/dashboard/ResetWeeklyDataPanel";
import { weeklyMissions } from "../../../data/dashboard/weeklyMissions";

export default function WeeklyDashboardPage() {
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <div>
          <p style={labelStyle}>Weekly Dashboard</p>

          <h1 style={titleStyle}>สรุปแผนทำคอนเทนต์ 7 วัน</h1>

          <p style={subtitleStyle}>
            ดูภาพรวมความคืบหน้า ภารกิจที่ทำสำเร็จ ร่างโพสต์ ผลลัพธ์หลังโพสต์
            และบทเรียนที่ได้จากการลงมือทำจริง
          </p>

          <div style={buttonGroupStyle}>
            <Link href="/dashboard">
              <button style={primaryButtonStyle}>🏠 กลับไปภารกิจวันนี้</button>
            </Link>

            <Link href="/search">
              <button style={secondaryButtonStyle}>🔍 ค้นหาไอเดียเพิ่ม</button>
            </Link>

            <Link href="/pricing">
              <button style={secondaryButtonStyle}>💰 ดูแพ็กเกจ</button>
            </Link>
          </div>
        </div>

        <div style={sideCardStyle}>
          <p style={{ marginTop: 0, color: "#4f46e5", fontWeight: "bold" }}>
            เป้าหมายของหน้านี้
          </p>

          <h2 style={{ margin: "8px 0" }}>รู้ว่าทำอะไรไปแล้ว และควรปรับอะไรต่อ</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            ใช้หน้านี้หลังทำครบหลายวัน เพื่อมองภาพรวมว่าโพสต์แบบไหนเวิร์ก
            และสิ่งไหนควรพัฒนาต่อ
          </p>
        </div>
      </section>

      <section style={sectionGridStyle}>
        <div style={wideColumnStyle}>
          <WeeklyProgressSummary />
          <WeeklyMissionGrid missions={weeklyMissions} />
          <WeeklyResultSummary />
          <WeeklyLearningNotes />
        </div>

        <aside style={sideColumnStyle}>
          <div style={summaryCardStyle}>
            <p style={labelStyle}>Quick Action</p>

            <h2 style={{ margin: "6px 0" }}>ทำอะไรต่อดี?</h2>

            <p style={{ color: "#555", lineHeight: "1.7" }}>
              ถ้ายังทำไม่ครบ ให้กลับไปหน้า Dashboard แล้วเลือก Day ที่ยังไม่ได้ทำ
              ถ้าทำครบแล้ว ให้ดูบทเรียนและสรุปผลเพื่อวางแผนโพสต์รอบต่อไป
            </p>

            <Link href="/dashboard">
              <button style={fullButtonStyle}>ทำภารกิจต่อ</button>
            </Link>
          </div>

          <WeeklyReportExport />
          <ResetWeeklyDataPanel />
        </aside>
      </section>

      <WeeklyDraftArchive />
    </main>
  );
}

const heroStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.5fr) minmax(260px,0.9fr)",
  gap: "20px",
  padding: "34px",
  borderRadius: "28px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "42px",
  lineHeight: "1.15",
  margin: "10px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#374151",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "760px",
};

const buttonGroupStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "22px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const sideCardStyle: CSSProperties = {
  border: "1px solid #c7d2fe",
  borderRadius: "22px",
  padding: "22px",
  background: "white",
};

const sectionGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.5fr) minmax(280px,0.8fr)",
  gap: "22px",
  marginTop: "24px",
  alignItems: "start",
};

const wideColumnStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
};

const sideColumnStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
};

const summaryCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "22px",
  background: "white",
};

const fullButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "12px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};