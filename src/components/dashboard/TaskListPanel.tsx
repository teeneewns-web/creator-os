"use client";

import TaskCard from "./TaskCard";

type TaskItem = {
  id: string;
  priority: string;
  title: string;
  time: string;
  detail: string;
};

type TaskListPanelProps = {
  tasks: TaskItem[];
  checkedTasks: string[];
  onToggleTask: (taskId: string) => void;
};

export default function TaskListPanel({
  tasks,
  checkedTasks,
  onToggleTask,
}: TaskListPanelProps) {
  return (
    <section style={{ marginTop: "30px" }}>
      <h2>✅ ภารกิจที่ต้องทำ</h2>

      <div style={{ display: "grid", gap: "16px" }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            priority={task.priority}
            title={task.title}
            time={task.time}
            detail={task.detail}
            checked={checkedTasks.includes(task.id)}
            onToggle={onToggleTask}
          />
        ))}
      </div>
    </section>
  );
}