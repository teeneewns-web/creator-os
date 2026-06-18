import Link from "next/link";
import fs from "fs";
import path from "path";
import CopyButton from "../components/CopyButton";

export default function HomePage() {
  const filePath = path.join(process.cwd(), "src/data/hooks/ai.json");
  const hooks = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const today = new Date();
  const dayNumber =
    today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();

  const hookOfTheDay = hooks[dayNumber % hooks.length];

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
          marginBottom: "24px",
          background: "#f8faff",
        }}
      >
        <h2>🔥 Hook of the Day</h2>

        <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "12px" }}>
          {hookOfTheDay.hook}
        </p>

        <div style={{ marginTop: "12px" }}>
          <CopyButton text={hookOfTheDay.hook} />
        </div>
      </div>

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
          500+ Hooks Available
        </h2>

        <p style={{ color: "#555" }}>
          มี Hook พร้อมใช้งานหลายหมวด เช่น Beauty, Finance, AI, Gaming และ Sales
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link href="/hooks">
          <button
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "white",
              cursor: "pointer",
            }}
          >
            Hook Library
          </button>
        </Link>

        <Link href="/search">
          <button
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #4f46e5",
              backgroundColor: "white",
              color: "#4f46e5",
              cursor: "pointer",
            }}
          >
            Search Hooks
          </button>
        </Link>

        <Link href="/favorites">
          <button
            style={{
              padding: "12px 18px",
              borderRadius: "10px",
              border: "1px solid #f59e0b",
              backgroundColor: "white",
              color: "#f59e0b",
              cursor: "pointer",
            }}
          >
            ⭐ Favorites
          </button>
        </Link>
        <Link href="/trending">
  <button
    style={{
      padding: "12px 18px",
      borderRadius: "10px",
      border: "1px solid #ef4444",
      backgroundColor: "white",
      color: "#ef4444",
      cursor: "pointer",
    }}
  >
    🔥 Trending
  </button>
</Link>
      </div>
    </main>
  );
}