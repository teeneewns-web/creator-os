import Link from "next/link";
import { weeklyMissions } from "../../../data/dashboard/weeklyMissions";
import WeeklyProgressSummary from "../../../components/dashboard/WeeklyProgressSummary";
import WeeklyResultSummary from "../../../components/dashboard/WeeklyResultSummary";
import WeeklyLearningNotes from "../../../components/dashboard/WeeklyLearningNotes";
import WeeklyDraftArchive from "../../../components/dashboard/WeeklyDraftArchive";
import WeeklyReportExport from "../../../components/dashboard/WeeklyReportExport";
import ResetWeeklyDataPanel from "../../../components/dashboard/ResetWeeklyDataPanel";
import WeeklyMissionGrid from "../../../components/dashboard/WeeklyMissionGrid";

export default function WeeklyDashboardPage() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <Link href="/dashboard">
        <button>⬅️ กลับภารกิจวันนี้</button>
      </Link>

      <section style={{ marginTop: "24px" }}>
        <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>
          📅 แผนสร้างเพจ 7 วัน
        </h1>

        <p style={{ color: "#555", fontSize: "18px" }}>
          ภาพรวมภารกิจสำหรับเริ่มต้นเพจสายความรู้จากศูนย์
        </p>
      </section>

      <WeeklyProgressSummary />
      <WeeklyResultSummary />
      <WeeklyLearningNotes />
      <WeeklyDraftArchive />
      <WeeklyReportExport />
      <WeeklyMissionGrid missions={weeklyMissions} />
      <ResetWeeklyDataPanel />
    </main>
  );
}