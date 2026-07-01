import Link from "next/link";

export default function CaptionsPage() {
  const captionTypes = [
    {
      title: "Caption สั้น",
      icon: "⚡",
      description: "เหมาะกับโพสต์ไว คลิปสั้น และคอนเทนต์ที่ต้องการความกระชับ",
      examples: ["รู้แบบนี้ตั้งนานแล้ว", "เรื่องนี้หลายคนมองข้าม", "ลองเช็กตัวเองดู"],
    },
    {
      title: "Caption ให้ความรู้",
      icon: "📚",
      description: "เหมาะกับเพจความรู้ การเงิน ความงาม สุขภาพ และธุรกิจ",
      examples: ["สิ่งที่มือใหม่ควรรู้", "สรุปให้เข้าใจง่ายในโพสต์เดียว", "ถ้าคุณกำลังเริ่มต้น ต้องอ่าน"],
    },
    {
      title: "Caption ขายของ",
      icon: "🛒",
      description: "เหมาะกับสินค้าหรือบริการที่ต้องการปิดการขายแบบไม่ยัดเยียด",
      examples: ["เหมาะกับคนที่กำลังเจอปัญหานี้", "ตัวช่วยเล็ก ๆ ที่ทำให้ชีวิตง่ายขึ้น", "ก่อนตัดสินใจซื้อ ลองอ่านสิ่งนี้"],
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
          Caption Library
        </p>

        <h1
          style={{
            fontSize: "42px",
            lineHeight: "1.15",
            margin: "12px 0",
          }}
        >
          คลัง Caption สำหรับเขียนโพสต์ให้เร็วขึ้น
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          รวมแนวทาง Caption สำหรับ Creator ที่อยากเขียนโพสต์ได้ง่ายขึ้น
          ใช้เป็นไอเดียตั้งต้น แล้วปรับให้เข้ากับสไตล์ของเพจคุณ
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
        <h2 style={{ fontSize: "30px" }}>ประเภท Caption</h2>

        <p style={{ color: "#555" }}>
          เลือกแนว Caption ให้ตรงกับเป้าหมายของโพสต์
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {captionTypes.map((item) => (
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
        <h2>วิธีใช้ Caption ให้ดีขึ้น</h2>

        <p style={{ color: "#555", fontSize: "17px", lineHeight: "1.8" }}>
          เริ่มจาก Hook เพื่อดึงความสนใจ จากนั้นใช้ Caption อธิบายเนื้อหาให้ชัด
          แล้วปิดท้ายด้วย CTA เพื่อให้คนอ่านรู้ว่าควรทำอะไรต่อ
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