import Link from "next/link";

export default function ScriptsPage() {
  const scriptTypes = [
    {
      title: "Script คลิปสั้น",
      icon: "🎬",
      description: "เหมาะกับ TikTok, Reels, Shorts ที่ต้องดึงคนดูตั้งแต่ 3 วินาทีแรก",
      structure: ["Hook", "ปัญหา", "คำอธิบายสั้น", "CTA"],
    },
    {
      title: "Script ให้ความรู้",
      icon: "📚",
      description: "เหมาะกับคอนเทนต์สอน อธิบาย หรือสรุปเรื่องยากให้ง่าย",
      structure: ["เปิดด้วยคำถาม", "อธิบายทีละข้อ", "ยกตัวอย่าง", "สรุป"],
    },
    {
      title: "Script ขายของ",
      icon: "🛒",
      description: "เหมาะกับรีวิวสินค้า บริการ หรือคอนเทนต์ที่ต้องการปิดการขาย",
      structure: ["ปัญหาของลูกค้า", "ทางออก", "จุดเด่น", "ชวนตัดสินใจ"],
    },
  ];

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          padding: "40px 24px",
          borderRadius: "24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>
          Script Library
        </p>

        <h1
          style={{
            fontSize: "42px",
            lineHeight: "1.15",
            margin: "12px 0",
          }}
        >
          คลัง Script สำหรับวางโครงคลิปและโพสต์
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          Script ช่วยให้ Creator ไม่เริ่มจากหน้าว่าง มีโครงชัดเจนว่าเปิดยังไง
          เล่าอะไร และปิดท้ายแบบไหน
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>🏠 ใช้กับภารกิจวันนี้</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>🎣 ไปคลัง Hook</button>
          </Link>
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "30px" }}>ประเภท Script</h2>

        <p style={{ color: "#555" }}>
          เลือกโครง Script ให้ตรงกับรูปแบบคอนเทนต์
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {scriptTypes.map((item) => (
            <div
              key={item.title}
              style={{
                border: "1px solid #ddd",
                borderRadius: "22px",
                padding: "24px",
                background: "white",
              }}
            >
              <div style={{ fontSize: "34px" }}>{item.icon}</div>

              <h2>{item.title}</h2>

              <p style={{ color: "#555", lineHeight: "1.7" }}>
                {item.description}
              </p>

              <h3>โครงสร้าง</h3>

              <ol style={{ lineHeight: "2" }}>
                {item.structure.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "34px",
          padding: "24px",
          borderRadius: "22px",
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
        }}
      >
        <h2>สูตร Script ง่าย ๆ</h2>

        <p style={{ color: "#555", fontSize: "17px", lineHeight: "1.8" }}>
          เริ่มด้วยประโยคดึงความสนใจ ต่อด้วยปัญหาหรือประโยชน์หลัก
          จากนั้นอธิบายให้เข้าใจง่าย และปิดท้ายด้วย CTA เดียวที่ชัดเจน
        </p>
      </section>
    </main>
  );
}

const primaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};