import type { CSSProperties } from "react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: "✅",
      title: "รู้ว่าวันนี้ต้องทำอะไร",
      description:
        "เลือกเวลาที่มี 15 / 30 / 60 นาที แล้วระบบจะแนะนำภารกิจที่เหมาะกับคุณ",
    },
    {
      icon: "✍️",
      title: "เขียนโพสต์ได้เร็วขึ้น",
      description:
        "มี Hook โครงโพสต์ CTA Hashtag และช่องร่างโพสต์ที่จำแยกตามแต่ละวัน",
    },
    {
      icon: "📈",
      title: "บันทึกผลลัพธ์หลังโพสต์",
      description:
        "จดไลก์ คอมเมนต์ แชร์ และบทเรียน เพื่อนำไปปรับคอนเทนต์ครั้งต่อไป",
    },
  ];

  const steps = [
    "เลือก Day ที่ต้องการทำ",
    "เลือกเวลาที่มีวันนี้",
    "ทำภารกิจตามระบบ",
    "เขียนโพสต์จากตัวช่วย",
    "บันทึกผลและสรุปบทเรียน",
  ];

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          padding: "52px 28px",
          borderRadius: "28px",
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>
          Creator OS
        </p>

        <h1
          style={{
            fontSize: "48px",
            lineHeight: "1.12",
            margin: "12px 0",
            maxWidth: "850px",
          }}
        >
          ระบบผู้ช่วย Creator ให้รู้ว่าวันนี้ต้องทำอะไร
        </h1>

        <p style={{ fontSize: "19px", color: "#374151", maxWidth: "780px", lineHeight: "1.8" }}>
          ไม่ใช่แค่คลัง Hook แต่เป็นระบบภารกิจรายวันสำหรับวางแผน เขียนโพสต์
          ตรวจคุณภาพ บันทึกผล และสรุปบทเรียนใน 7 วัน
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "26px",
          }}
        >
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>🏠 เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/dashboard/weekly">
            <button style={secondaryButtonStyle}>📅 ดูแผน 7 วัน</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>🔍 ค้นหาไอเดีย</button>
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "18px",
          marginTop: "30px",
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            style={{
              border: "1px solid #ddd",
              borderRadius: "22px",
              padding: "24px",
              background: "white",
            }}
          >
            <div style={{ fontSize: "34px" }}>{feature.icon}</div>

            <h2>{feature.title}</h2>

            <p style={{ color: "#555", lineHeight: "1.7" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <section
        style={{
          marginTop: "34px",
          padding: "28px",
          borderRadius: "24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>
          Workflow
        </p>

        <h2 style={{ fontSize: "34px", margin: "10px 0" }}>
          วิธีใช้ Creator OS ในแต่ละวัน
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "14px",
            marginTop: "20px",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step}
              style={{
                border: "1px solid #ddd",
                borderRadius: "18px",
                padding: "18px",
                background: "white",
              }}
            >
              <p
                style={{
                  color: "#4f46e5",
                  fontWeight: "bold",
                  marginTop: 0,
                }}
              >
                Step {index + 1}
              </p>

              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "34px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "18px",
        }}
      >
        <div style={toolCardStyle}>
          <h2>🎣 Hook Library</h2>
          <p style={{ color: "#555", lineHeight: "1.7" }}>
            รวมประโยคเปิดโพสต์สำหรับดึงความสนใจ
          </p>
          <Link href="/hooks">
            <button style={smallButtonStyle}>เปิดคลัง Hook</button>
          </Link>
        </div>

        <div style={toolCardStyle}>
          <h2>📝 Caption / CTA / Script</h2>
          <p style={{ color: "#555", lineHeight: "1.7" }}>
            มีตัวช่วยสำหรับเขียนโพสต์และปิดท้ายให้คนลงมือทำ
          </p>
          <Link href="/captions">
            <button style={smallButtonStyle}>ดูเครื่องมือเขียนโพสต์</button>
          </Link>
        </div>

        <div style={toolCardStyle}>
          <h2>💰 Pricing</h2>
          <p style={{ color: "#555", lineHeight: "1.7" }}>
            เตรียมโครงสร้างสำหรับขายแพ็กเกจในอนาคต
          </p>
          <Link href="/pricing">
            <button style={smallButtonStyle}>ดูแพ็กเกจ</button>
          </Link>
        </div>
      </section>

      <section
        style={{
          marginTop: "36px",
          padding: "34px 24px",
          borderRadius: "24px",
          background: "#111827",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "34px", marginTop: 0 }}>
          เริ่มทำคอนเทนต์วันนี้แบบไม่ต้องเริ่มจากศูนย์
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "18px", lineHeight: "1.8" }}>
          เปิดระบบ เลือกเวลา แล้วทำตามภารกิจที่แนะนำได้ทันที
        </p>

        <Link href="/dashboard">
          <button style={darkSectionButtonStyle}>เริ่มใช้งาน Creator OS</button>
        </Link>
      </section>
    </main>
  );
}

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const smallButtonStyle: CSSProperties = {
  marginTop: "12px",
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const darkSectionButtonStyle: CSSProperties = {
  marginTop: "16px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const toolCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "22px",
  padding: "24px",
  background: "white",
};