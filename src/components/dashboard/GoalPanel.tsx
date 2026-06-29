type GoalPanelProps = {
  title: string;
  description: string;
};

export default function GoalPanel({ title, description }: GoalPanelProps) {
  return (
    <section style={{ marginTop: "30px" }}>
      <h2>🎯 เป้าหมายวันนี้</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "18px",
          padding: "20px",
          background: "white",
        }}
      >
        <h3>{title}</h3>

        <p style={{ color: "#555" }}>{description}</p>
      </div>
    </section>
  );
}