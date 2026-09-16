import type { CSSProperties } from "react";
import TaskCard from "./TaskCard";

type Task = {
  id: string;
  title: string;
  time: string;
  detail: string;
};

type TaskListPanelProps = {
  tasks: Task[];
  checkedTasks: string[];
  onToggleTask: (taskId: string) => void;
};

export default function TaskListPanel({
  tasks,
  checkedTasks,
  onToggleTask,
}: TaskListPanelProps) {
  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Mission Tasks</p>

      <h2 style={{ margin: "6px 0" }}>ภารกิจที่ต้องทำ</h2>

      <p style={{ color: "#555" }}>
        ติ๊กทีละข้อเมื่อทำเสร็จ ระบบจะคำนวณความคืบหน้าให้อัตโนมัติ
      </p>

      <div style={listStyle}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            time={task.time}
            detail={task.detail}
            checked={checkedTasks.includes(task.id)}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
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

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};