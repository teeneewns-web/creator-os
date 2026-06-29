import { type TimeMode } from "../../hooks/useDashboardProgress";

type TaskItem = {
  id: string;
  priority: string;
  title: string;
  time: string;
  detail: string;
};

export function getVisibleTasks(tasks: TaskItem[], timeMode: TimeMode) {
  if (timeMode === "15") {
    return tasks.filter((task) => task.priority === "must");
  }

  if (timeMode === "30") {
    return tasks.filter(
      (task) => task.priority === "must" || task.priority === "should"
    );
  }

  return tasks;
}