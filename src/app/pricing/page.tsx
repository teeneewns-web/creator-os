import Link from "next/link";

export default function PricingPage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          textAlign: "center",
          padding: "40px 20px",
          borderRadius: "24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>Pricing</p>

        <h1 style={{ fontSize: "42px", margin: "12px 0" }}>
          เลือกแผนที่เหมาะกับการทำคอนเทนต์ของคุณ
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "720px", margin: "0 auto" }}>
          Creator OS ช่วยให้คุณรู้ว่าวันนี้ต้องทำอะไร เขียนโพสต์ได้เร็วขึ้น
          และมีระบบติดตามผลลัพธ์แบบเป็นขั้นตอน
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "18px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "22px",
            padding: "24px",
            background: "white",
          }}
        >
          <h2>Free</h2>

          <p style={{ fontSize: "34px", fontWeight: "bold", margin: "12px 0" }}>
            ฿0
          </p>

          <p style={{ color: "#555" }}>
            เหมาะสำหรับทดลองใช้และเริ่มวางระบบทำคอนเทนต์
          </p>

          <ul style={{ lineHeight: "2" }}>
            <li>ใช้แผนภารกิจ 7 วัน</li>
            <li>ดู Hook และโครงโพสต์พื้นฐาน</li>
            <li>บันทึกโพสต์ร่างในเครื่อง</li>
            <li>บันทึกผลลัพธ์หลังโพสต์</li>
          </ul>

          <Link href="/dashboard">
            <button style={secondaryButtonStyle}>เริ่มใช้ฟรี</button>
          </Link>
        </div>

        <div
          style={{
            border: "2px solid #4f46e5",
            borderRadius: "22px",
            padding: "24px",
            background: "#eef2ff",
            position: "relative",
          }}
        >
          <p
            style={{
              position: "absolute",
              top: "-14px",
              right: "20px",
              background: "#4f46e5",
              color: "white",
              padding: "6px 10px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            แนะนำ
          </p>

          <h2>Creator Pro</h2>

          <p style={{ fontSize: "34px", fontWeight: "bold", margin: "12px 0" }}>
            ฿199
            <span style={{ fontSize: "16px", color: "#555" }}> / เดือน</span>
          </p>

          <p style={{ color: "#555" }}>
            เหมาะสำหรับคนทำเพจจริงจัง ต้องการระบบช่วยคิดและลงมือทุกวัน
          </p>

          <ul style={{ lineHeight: "2" }}>
            <li>แผนภารกิจรายวันหลายรูปแบบ</li>
            <li>คลัง Hook / Caption / CTA เพิ่มเติม</li>
            <li>เทมเพลตโพสต์สำหรับหลายสายคอนเทนต์</li>
            <li>ระบบสรุปบทเรียนรายสัปดาห์</li>
            <li>เหมาะกับเพจความรู้ ขายของ และสร้างตัวตน</li>
          </ul>

          <Link href="/dashboard">
            <button style={primaryButtonStyle}>ทดลองใช้ระบบ</button>
          </Link>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "22px",
            padding: "24px",
            background: "white",
          }}
        >
          <h2>Business</h2>

          <p style={{ fontSize: "34px", fontWeight: "bold", margin: "12px 0" }}>
            ฿499
            <span style={{ fontSize: "16px", color: "#555" }}> / เดือน</span>
          </p>

          <p style={{ color: "#555" }}>
            เหมาะสำหรับทีมเล็ก แอดมินเพจ หรือคนที่ต้องทำคอนเทนต์หลายเพจ
          </p>

          <ul style={{ lineHeight: "2" }}>
            <li>แผนคอนเทนต์สำหรับหลายแบรนด์</li>
            <li>ชุดไอเดียโพสต์จำนวนมาก</li>
            <li>ระบบสรุปผลเพื่อปรับแผน</li>
            <li>เหมาะกับฟรีแลนซ์และทีมการตลาด</li>
          </ul>

          <Link href="/dashboard/weekly">
            <button style={secondaryButtonStyle}>ดูระบบตัวอย่าง</button>
          </Link>
        </div>
      </section>

      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          borderRadius: "22px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <h2>ตอนนี้เป็นเวอร์ชันทดสอบ</h2>

        <p style={{ color: "#555", fontSize: "17px" }}>
          ระบบชำระเงินยังไม่เปิดใช้งาน หน้านี้ใช้สำหรับโชว์แพ็กเกจและเตรียมโครงสร้างการขายก่อน
        </p>
      </section>
    </main>
  );
}

const primaryButtonStyle = {
  width: "100%",
  marginTop: "14px",
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle = {
  width: "100%",
  marginTop: "14px",
  padding: "12px 16px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};