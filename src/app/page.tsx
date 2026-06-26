import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <section style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "bold", marginBottom: "16px" }}>
          🚀 คลังคอนเทนต์สำหรับ Creator
        </h1>

        <p style={{ fontSize: "20px", color: "#555", marginBottom: "24px" }}>
          รวม Hook, Caption, CTA และ Script พร้อมใช้ ช่วยให้คุณคิดคอนเทนต์ได้เร็วขึ้น
        </p>

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

        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>50+</h2>
          <p>CTA สำหรับปิดท้ายโพสต์</p>
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
        <h2>ทำไม Creator ถึงควรใช้เว็บนี้?</h2>

        <ul>
          <li>ช่วยคิด Hook ได้เร็วขึ้น</li>
          <li>มี Caption พร้อมนำไปปรับใช้</li>
          <li>มี CTA ช่วยเพิ่มคอมเมนต์ แชร์ และการติดตาม</li>
          <li>มี Script สำหรับ TikTok, Reels และ Shorts</li>
          <li>ค้นหาทุกอย่างได้จากช่องเดียว</li>
          <li>บันทึกรายการโปรดไว้ใช้ซ้ำได้</li>
        </ul>
      </section>

      <section style={{ marginTop: "40px", textAlign: "center" }}>
        <h2>เริ่มทำคอนเทนต์ให้เร็วขึ้นวันนี้</h2>

        <p style={{ color: "#555" }}>
          ทดลองใช้คลังคอนเทนต์ฟรี และอัปเกรดเป็น Premium เมื่อพร้อม
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/search"><button>🔍 เริ่มค้นหา</button></Link>
          <Link href="/premium"><button>💎 ดู Premium</button></Link>
          <Link href="/plans">
  <button>แผนสร้างคอนเทนต์</button>
</Link>

        </div>
      </section>
    </main>
  );
}