import Link from "next/link";

export default function CtaPage() {
  const ctaTypes = [
    {
      title: "CTA ให้คอมเมนต์",
      icon: "💬",
      description: "ใช้เมื่อต้องการให้คนมีส่วนร่วมกับโพสต์",
      examples: ["คุณเคยเจอแบบนี้ไหม?", "คอมเมนต์คำว่า สนใจ ถ้าอยากได้ตัวอย่าง", "คุณคิดว่าข้อไหนจริงที่สุด?"],
    },
    {
      title: "CTA ให้แชร์",
      icon: "🔁",
      description: "ใช้กับโพสต์ความรู้หรือโพสต์ที่มีประโยชน์",
      examples: ["ส่งให้เพื่อนที่ควรรู้เรื่องนี้", "แชร์เก็บไว้ดูทีหลัง", "แท็กคนที่กำลังเจอปัญหานี้"],
    },
    {
      title: "CTA ขายของ",
      icon: "🛍️",
      description: "ใช้เมื่อต้องการพาคนไปสู่การซื้อหรือสอบถาม",
      examples: ["ทักแชทเพื่อดูรายละเอียด", "กดดูตัวอย่างก่อนตัดสินใจ", "สนใจเริ่มต้นวันนี้ กดติดต่อได้เลย"],
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
          CTA Library
        </p>

        <h1
          style={{
            fontSize: "42px",
            lineHeight: "1.15",
            margin: "12px 0",
          }}
        >
          คลัง CTA สำหรับปิดท้ายโพสต์ให้คนลงมือทำ
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          CTA คือประโยคชวนให้คนอ่านทำบางอย่างต่อ เช่น คอมเมนต์ แชร์ กดติดตาม
          ทักแชท หรือซื้อสินค้า
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

          <Link href="/captions">
            <button style={secondaryButtonStyle}>📝 ไปคลัง Caption</button>
          </Link>
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "30px" }}>ประเภท CTA</h2>

        <p style={{ color: "#555" }}>
          เลือก CTA ให้ตรงกับเป้าหมายของโพสต์
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {ctaTypes.map((item) => (
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

              <ul style={{ lineHeight: "2" }}>
                {item.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
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
        <h2>หลักการใช้ CTA</h2>

        <p style={{ color: "#555", fontSize: "17px", lineHeight: "1.8" }}>
          CTA ที่ดีควรบอกให้ชัดว่าคนอ่านควรทำอะไรต่อ ไม่ควรใส่หลายคำสั่งในโพสต์เดียว
          เช่น ให้คอมเมนต์อย่างเดียว หรือให้ทักแชทอย่างเดียว
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