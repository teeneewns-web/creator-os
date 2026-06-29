type WhyPanelProps = {
  text: string;
};

export default function WhyPanel({ text }: WhyPanelProps) {
  return (
    <section
      style={{
        marginTop: "30px",
        border: "1px solid #ddd",
        borderRadius: "22px",
        padding: "24px",
      }}
    >
      <h2>💡 ทำไมต้องทำภารกิจนี้?</h2>

      <p style={{ color: "#555", lineHeight: "1.8" }}>{text}</p>
    </section>
  );
}