import Link from "next/link";

export default function HomePage() {
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
          Creator OS
        </p>

        <h1
          style={{
            fontSize: "44px",
            lineHeight: "1.15",
            margin: "12px 0",
          }}
        >
          ระบบผู้ช่วย Creator ให้รู้ว่าวันนี้ต้องทำอะไร
        </h1>

        <p style={{ fontSize: "18px", color: "#555", maxWidth: "720px" }}>
          ไม่ใช่แค่คลัง Hook แต่เป็นระบบภารกิจรายวันสำหรับวางแผน เขียนโพสต์
          ตรวจคุณภาพ บันทึกผล และสรุปบทเรียนใน 7 วัน
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
            <button
              style={{
                padding: "12px 18px",
                borderRadius: "14px",
                border: "1px solid #4f46e5",
                background: "#4f46e5",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🏠 เริ่มภารกิจวันนี้
            </button>
          </Link>

          <Link href="/dashboard/weekly">
            <button
              style={{
                padding: "12px 18px",
                borderRadius: "14px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📅 ดูแผน 7 วัน
            </button>
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "16px",
          marginTop: "28px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "18px",
            padding: "20px",
            background: "white",
          }}
        >
          <h2>✅ ภารกิจรายวัน</h2>
          <p style={{ color: "#555" }}>
            เลือกเวลาที่มี 15 / 30 / 60 นาที แล้วทำตามภารกิจที่ระบบแนะนำ
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "18px",
            padding: "20px",
            background: "white",
          }}
        >
          <h2>✍️ เขียนโพสต์</h2>
          <p style={{ color: "#555" }}>
            มี Hook โครงโพสต์ CTA Hashtag และช่องร่างโพสต์ที่จำแยกตาม Day
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "18px",
            padding: "20px",
            background: "white",
          }}
        >
          <h2>📈 บันทึกผลลัพธ์</h2>
          <p style={{ color: "#555" }}>
            จดไลก์ คอมเมนต์ แชร์ และบทเรียน เพื่อนำไปปรับคอนเทนต์ต่อ
          </p>
        </div>
      </section>

      <section style={{ marginTop: "32px" }}>
        <h2>เมนูอื่น ๆ</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "14px",
          }}
        >
          <Link href="/hooks"><button>🎣 คลัง Hook</button></Link>
          <Link href="/captions"><button>📝 Caption</button></Link>
          <Link href="/cta"><button>📣 CTA</button></Link>
          <Link href="/scripts"><button>🎬 Script</button></Link>
          <Link href="/search"><button>🔍 ค้นหา</button></Link>
          <Link href="/pricing"><button>💰 ราคา</button></Link>
        </div>
      </section>
    </main>
  );
}