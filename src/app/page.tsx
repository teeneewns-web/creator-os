import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        Content Resource Hub
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "24px" }}>
        ระบบคลังคอนเทนต์สำหรับ Creator
      </p>

      <div
        style={{
          border: "1px solid #c7d2fe",
          borderRadius: "16px",
          padding: "20px",
          backgroundColor: "#f8faff",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "28px", color: "#4f46e5" }}>
          2600+ Hooks Available
        </h2>

        <p style={{ color: "#555" }}>
          มี Hook พร้อมใช้งานหลายหมวด เช่น Beauty, Finance, AI, Gaming, Sales,
          TikTok และ YouTube
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
       
       <Link href="/hooks">
  <button>Hook Library</button>
</Link>

<Link href="/search">
  <button>Search Hooks</button>
</Link>

<Link href="/captions">
  <button>Captions Library</button>
</Link>

<Link href="/cta">
  <button>CTA Library</button>
</Link>

<Link href="/scripts">
  <button>Scripts Library</button>
</Link>

<Link href="/favorites">
  <button>⭐ Favorites</button>
</Link>

<Link href="/trending">
  <button>🔥 Trending</button>
</Link>
<Link href="/pricing">
  <button>💎 ราคาใช้งาน</button>
</Link>

<Link href="/premium">
  <button>Premium</button>
</Link>

      </div>
    </main>
  );
}