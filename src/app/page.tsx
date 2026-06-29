import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <section style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "16px" }}>
          🚀 คลังคอนเทนต์สำหรับ Creator
        </h1>

        <p style={{ fontSize: "20px", color: "#555", marginBottom: "24px" }}>
          รวมเครื่องมือช่วยคิดคอนเทนต์ และผู้ช่วยภารกิจรายวันสำหรับคนทำเพจ
        </p>

        <div
          style={{
            border: "2px solid #4f46e5",
            borderRadius: "20px",
            padding: "24px",
            background: "#f8faff",
            marginBottom: "24px",
          }}
        >
          <h2>🏠 เริ่มจากภารกิจวันนี้</h2>

          <p style={{ color: "#555" }}>
            ไม่ต้องคิดเองว่าวันนี้จะทำอะไร เปิดหน้า Dashboard แล้วทำตามภารกิจได้เลย
          </p>

          <Link href="/dashboard">
            <button
              style={{
                padding: "14px 24px",
                borderRadius: "12px",
                border: "none",
                background: "#4f46e5",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              🏠 ไปที่ภารกิจวันนี้
            </button>
          </Link>
        </div>

        <form action="/search" style={{ marginBottom: "24px" }}>
          <input
            name="q"
            placeholder="ค้นหา Hook, CTA, Caption, Script..."
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "14px",
              border: "1px solid #c7d2fe",
              borderRadius: "12px",
              fontSize: "16px",
              marginBottom: "12px",
            }}
          />

          <br />

          <button type="submit">🔍 ค้นหาคอนเทนต์</button>
        </form>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/plans"><button>📅 แผนสร้างคอนเทนต์</button></Link>
          <Link href="/dashboard/weekly"><button>🏠 แผน 7 วัน</button></Link>
          <Link href="/hooks"><button>🎣 คลัง Hook</button></Link>
          <Link href="/captions"><button>📝 คลัง Caption</button></Link>
          <Link href="/cta"><button>📢 คลัง CTA</button></Link>
          <Link href="/scripts"><button>🎬 คลังสคริปต์</button></Link>
          <Link href="/favorites"><button>⭐ รายการโปรด</button></Link>
          <Link href="/pricing"><button>💎 ราคาใช้งาน</button></Link>
          <Link href="/premium"><button>🚀 พรีเมียม</button></Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginTop: "30px",
        }}
      >
        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>🏠</h2>
          <p>ภารกิจรายวัน</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>500+</h2>
          <p>Hook พร้อมใช้</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>60+</h2>
          <p>สคริปต์สำหรับคลิปสั้น</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>50+</h2>
          <p>Caption เพิ่ม Engagement</p>
        </div>
      </section>

      <section
        style={{
          marginTop: "50px",
          border: "1px solid #ddd",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h2>เว็บนี้ช่วยอะไรคุณ?</h2>

        <ul>
          <li>บอกว่าวันนี้ควรทำอะไร</li>
          <li>ช่วยคิด Hook, Caption, CTA และ Script</li>
          <li>มีแผนสร้างคอนเทนต์ให้ทำตาม</li>
          <li>ลดเวลาคิดคอนเทนต์เอง</li>
          <li>บันทึกรายการโปรดไว้ใช้ซ้ำได้</li>
        </ul>
      </section>
    </main>
  );
}