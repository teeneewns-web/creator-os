import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <section
        style={{
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          🚀 Content Resource Hub
        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          รวม Hook, Caption, CTA และ Script
          สำหรับ Creator ไว้ในที่เดียว
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/hooks">
            <button>🎣 Hook Library</button>
          </Link>

          <Link href="/pricing">
            <button>💎 ราคาใช้งาน</button>
          </Link>

          <Link href="/premium">
            <button>⭐ Premium</button>
          </Link>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>500+</h2>
          <p>Hooks</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>60</h2>
          <p>Scripts</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>50</h2>
          <p>Captions</p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>50</h2>
          <p>CTA</p>
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
        <h2>ทำไมต้องใช้ Content Resource Hub?</h2>

        <ul>
          <li>ช่วยคิด Hook ได้เร็วขึ้น</li>
          <li>มี Caption พร้อมใช้งาน</li>
          <li>มี CTA สำหรับเพิ่ม Engagement</li>
          <li>มี Script สำหรับ TikTok และ Reels</li>
          <li>ประหยัดเวลาในการทำคอนเทนต์</li>
        </ul>
      </section>

      <section
        style={{
          marginTop: "40px",
          textAlign: "center",
        }}
      >
        <h2>พร้อมเริ่มหรือยัง?</h2>

        <Link href="/premium">
          <button
            style={{
              padding: "12px 24px",
              fontSize: "18px",
            }}
          >
            🚀 เริ่มใช้งาน Premium
          </button>
        </Link>
      <Link href="/search">
  <button>🔍 ค้นหา Hook</button>
</Link>

<Link href="/captions">
  <button>📝 คลัง Caption</button>
</Link>

<Link href="/cta">
  <button>📢 คลัง CTA</button>
</Link>

<Link href="/scripts">
  <button>🎬 คลังสคริปต์</button>
</Link>

<Link href="/favorites">
  <button>⭐ รายการโปรด</button>
</Link>

<Link href="/trending">
  <button>🔥 มาแรง</button>
</Link>
      </section>
    </main>
  );
}