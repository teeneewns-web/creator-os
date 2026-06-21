import ctas from "../../data/cta/comment.json";

export default function CTAPage() {
  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>CTA Library</h1>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        จำนวนทั้งหมด {ctas.length} รายการ
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        {ctas.map((item: any) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #c7d2fe",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "#f8faff",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {item.cta}
            </p>

            <small style={{ color: "#555" }}>
              หมวด: {item.category} | ประเภท: {item.type}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}