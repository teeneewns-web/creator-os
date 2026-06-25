import Link from "next/link";

export default function PlusKnowledgePlan() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Link href="/plans/new-page/knowledge">
        <button>⬅️ กลับ</button>
      </Link>

      <h1>🚀 Creator Plus</h1>

      <h2>แผนเพจสายความรู้ (15 วัน)</h2>

      <p
        style={{
          color: "#555",
          marginBottom: "20px",
        }}
      >
        สำหรับคนที่อยากทำเพจอย่างต่อเนื่อง โดยมีแนวทางและภารกิจในแต่ละวัน
      </p>

      <div
        style={{
          border: "2px solid #3b82f6",
          borderRadius: "16px",
          padding: "20px",
          background: "#f8fbff",
        }}
      >
        <h2>สิ่งที่คุณจะได้รับ</h2>

        <ul>
          <li>✅ แผนโพสต์ 15 วัน</li>
          <li>✅ ภารกิจรายวัน</li>
          <li>✅ แนวทางเขียนโพสต์</li>
          <li>✅ Hook เปิดโพสต์</li>
          <li>✅ Hashtag แนะนำ</li>
          <li>✅ เวลาโพสต์แนะนำ</li>
          <li>✅ เช็กลิสต์รายวัน</li>
          <li>✅ เคล็ดลับในแต่ละวัน</li>
        </ul>

        <h2>ราคา</h2>

        <p
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#2563eb",
          }}
        >
          29 บาท
        </p>

        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ซื้อแผนนี้
        </button>
      </div>
    </main>
  );
}