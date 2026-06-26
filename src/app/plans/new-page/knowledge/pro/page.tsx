import Link from "next/link";

export default function PlusKnowledgePlan() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <Link href="/plans/new-page/knowledge">
        <button>⬅️ กลับ</button>
      </Link>

      <h1>🚀 Creator Plus</h1>

      <p style={{ color: "#666", fontSize: "18px", marginBottom: "24px" }}>
        แผนสร้างเพจสายความรู้ 15 วัน สำหรับคนที่อยากทำต่อเนื่องแบบไม่ต้องคิดเองทุกวัน
      </p>

      <div
        style={{
          border: "2px solid #3b82f6",
          borderRadius: "18px",
          padding: "24px",
          background: "#f8fbff",
        }}
      >
        <h2>คุณจะได้อะไรในแผนนี้</h2>

        <ul>
          <li>✅ แผนโพสต์ 15 วัน</li>
          <li>✅ ภารกิจรายวัน</li>
          <li>✅ โครงสร้างโพสต์</li>
          <li>✅ Hook เปิดโพสต์</li>
          <li>✅ Hashtag แนะนำ</li>
          <li>✅ เวลาโพสต์แนะนำ</li>
          <li>✅ เช็กลิสต์รายวัน</li>
          <li>✅ เคล็ดลับเพิ่มการมองเห็น</li>
        </ul>

        <h2>เหมาะกับใคร?</h2>

        <ul>
          <li>คนที่เพิ่งเริ่มทำเพจสายความรู้</li>
          <li>คนที่คิดไม่ออกว่าวันนี้จะโพสต์อะไร</li>
          <li>คนที่อยากเริ่มทำเพจแบบมีระบบ</li>
        </ul>

        <h2>ราคา</h2>

        <p style={{ fontSize: "30px", fontWeight: "bold", color: "#2563eb" }}>
          29 บาท
        </p>

        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ซื้อแผน Plus
        </button>
      </div>
    </main>
  );
}