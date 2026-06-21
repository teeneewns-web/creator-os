import ctas from "../../data/cta/comment.json";
import CopyButton from "../../components/CopyButton";
import FavoriteButton from "../../components/FavoriteButton";

export default function CTAPage() {
  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>📢 คลัง CTA</h1>

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
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "#e0e7ff",
                color: "#3730a3",
                fontSize: "12px",
                marginBottom: "10px",
              }}
            >
              {item.type}
            </div>

            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {item.cta}
            </p>

            <small style={{ color: "#555" }}>
              หมวด: {item.category}
            </small>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              <CopyButton text={item.cta} />
              <FavoriteButton hook={item.cta} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}