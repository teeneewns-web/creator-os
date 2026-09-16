"use client";

import { useEffect,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DaySelector from "../../components/dashboard/DaySelector";
import ProgressPanel from "../../components/dashboard/ProgressPanel";
import GoalPanel from "../../components/dashboard/GoalPanel";
import TaskListPanel from "../../components/dashboard/TaskListPanel";
import TodayToolsPanel from "../../components/dashboard/TodayToolsPanel";
import PostDraftPanel from "../../components/dashboard/PostDraftPanel";
import PostQualityPanel from "../../components/dashboard/PostQualityPanel";
import PostResultPanel from "../../components/dashboard/PostResultPanel";
import WhyPanel from "../../components/dashboard/WhyPanel";
import MissionActionPanel from "../../components/dashboard/MissionActionPanel";
import CompletionPanel from "../../components/dashboard/CompletionPanel";
import { weeklyMissions } from "../../data/dashboard/weeklyMissions";
import { useDashboardProgress } from "../../hooks/useDashboardProgress";
import { getVisibleTasks } from "../../lib/dashboard/getVisibleTasks";

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dayFromUrl = Number(searchParams.get("day"));

  const initialDay = weeklyMissions.some(
    (mission) => mission.day === dayFromUrl
  )
    ? dayFromUrl
    : 1;

 const [currentDay, setCurrentDay] = useState(initialDay);

useEffect(() => {
  setCurrentDay(initialDay);
}, [initialDay]);

const currentMission =
  weeklyMissions.find((mission) => mission.day === currentDay) ||
  weeklyMissions[0];

  function handleSelectDay(day: number) {
    setCurrentDay(day);
    router.push("/dashboard?day=" + day);
  }

  const {
  timeMode,
  setTimeMode,
  checkedTasks,
  completedToday,
  completedDays,
  streak,
  toggleTask,
  finishTodayMission,
  resetToday,
} = useDashboardProgress(currentMission.day);

  const visibleTasks = getVisibleTasks(currentMission.tasks, timeMode);

  const completedTasks = visibleTasks.filter((task) =>
    checkedTasks.includes(task.id)
  ).length;

  const progress =
    visibleTasks.length === 0
      ? 0
      : Math.round((completedTasks / visibleTasks.length) * 100);

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <DashboardHeader
        title={"🏠 Day " + currentMission.day + " : " + currentMission.title}
        subtitle="เลือกเวลาที่คุณมี แล้วทำตามภารกิจที่ระบบแนะนำ"
      />

      <DaySelector
        missions={weeklyMissions}
        currentDay={currentMission.day}
        completedDays={completedDays}
        onSelectDay={handleSelectDay}
      />

      <ProgressPanel
        timeMode={timeMode}
        onChangeTimeMode={setTimeMode}
        progress={progress}
        completedTasks={completedTasks}
        totalTasks={visibleTasks.length}
        streak={streak}
      />

      <GoalPanel
        title={currentMission.goal.title}
        description={currentMission.goal.description}
      />

      <TaskListPanel
        tasks={visibleTasks}
        checkedTasks={checkedTasks}
        onToggleTask={toggleTask}
      />

      <TodayToolsPanel
        hooks={currentMission.hooks}
        postStructure={currentMission.postStructure}
        cta={currentMission.cta}
        hashtags={currentMission.hashtags}
      />

      <PostDraftPanel
  day={currentMission.day}
  hooks={currentMission.hooks}
  postStructure={currentMission.postStructure}
  cta={currentMission.cta}
  hashtags={currentMission.hashtags}
/>

      <PostQualityPanel day={currentMission.day} />
      <PostResultPanel day={currentMission.day} />

      <WhyPanel text={currentMission.why} />

      <MissionActionPanel
        progress={progress}
        completedToday={completedToday}
        onFinish={() => finishTodayMission(progress)}
        onReset={resetToday}
      />

      <CompletionPanel completedToday={completedToday} streak={streak} day={currentMission.day} />
    </main>
  );
}