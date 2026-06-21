import scripts from "../../data/scripts/tiktok.json";

export default function ScriptsPage() {
  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Scripts Library</h1>

      <p style={{ color: "#555", marginBottom: "20px" }}>
        จำนวนทั้งหมด {scripts.length} รายการ
      </p>

      <div style={{ display: "grid", gap: "12px" }}>
        {scripts.map((item: any) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #c7d2fe",
              borderRadius: "14px",
              padding: "16px",
              backgroundColor: "#f8faff",
            }}
          >
            <h3>{item.title}</h3>

            <p style={{ fontSize: "18px" }}>
              {item.script}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}