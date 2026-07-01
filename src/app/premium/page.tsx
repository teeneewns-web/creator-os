import Link from "next/link";

export default function PremiumPage() {
  const features = [
    {
      title: "คลังไอเดียเพิ่มขึ้น",
      description: "เข้าถึง Hook, Caption, CTA และ Script หลายรูปแบบมากกว่าเวอร์ชันฟรี",
    },
    {
      title: "แผนทำคอนเทนต์หลายสาย",
      description: "เหมาะกับเพจความรู้ เพจขายของ เพจรีวิว เพจสร้างตัวตน และครีเอเตอร์มือใหม่",
    },
    {
      title: "ระบบช่วยคิดรายวัน",
      description: "ไม่ต้องเริ่มจากศูนย์ เปิดเว็บแล้วรู้ทันทีว่าวันนี้ควรทำอะไร",
    },
    {
      title: "สรุปผลเพื่อปรับปรุง",
      description: "บันทึกผลลัพธ์หลังโพสต์ แล้วนำไปใช้พัฒนาคอนเทนต์รอบต่อไป",
    },
  ];

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          padding: "44px 24px",
          borderRadius: "24px",
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>Creator OS Premium</p>

        <h1 style={{ fontSize: "42px", lineHeight: "1.15", margin: "12px 0" }}>
          ระบบช่วย Creator ที่อยากทำคอนเทนต์จริงจังมากขึ้น
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          Premium ถูกออกแบบสำหรับคนที่ไม่อยากเสียเวลาคิดเองทุกวัน
          แต่ต้องการระบบช่วยวางแผน เขียนโพสต์ และติดตามผลแบบเป็นขั้นตอน
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link href="/pricing">
            <button style={primaryButtonStyle}>ดูแพ็กเกจ</button>
          </Link>

          <Link href="/dashboard">
            <button style={secondaryButtonStyle}>ทดลองระบบฟรี</button>
          </Link>
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "30px" }}>สิ่งที่ Premium จะช่วยคุณ</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                border: "1px solid #ddd",
                borderRadius: "22px",
                padding: "22px",
                background: "white",
              }}
            >
              <h2>{feature.title}</h2>

              <p style={{ color: "#555", lineHeight: "1.7" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "34px",
          padding: "24px",
          borderRadius: "22px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <h2>ตอนนี้ยังเป็นเวอร์ชันทดสอบ</h2>

        <p style={{ color: "#555", fontSize: "17px" }}>
          ระบบชำระเงินยังไม่เปิดใช้งาน หน้านี้เตรียมไว้สำหรับการขายในอนาคต
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