import Link from "next/link";

export default function ProKnowledgePlan() {
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

      <h1>💎 Creator Pro</h1>

      <h2>แผนเพจสายความรู้ (30 วัน)</h2>

      <p style={{ color: "#555" }}>
        สำหรับคนที่ต้องการเติบโตจริงจัง ทั้งโพสต์และคลิปสั้น
      </p>

      <div
        style={{
          border: "2px solid #8b5cf6",
          borderRadius: "16px",
          padding: "20px",
          background: "#faf7ff",
          marginTop: "20px",
        }}
      >
        <h2>สิ่งที่คุณจะได้รับ</h2>

        <ul>
          <li>✅ แผน 30 วัน</li>
          <li>✅ ภารกิจรายวัน</li>
          <li>✅ แนวทางโพสต์</li>
          <li>✅ Hook เปิดโพสต์</li>
          <li>✅ Hook เปิดคลิป</li>
          <li>✅ CTA ปิดโพสต์</li>
          <li>✅ CTA ปิดคลิป</li>
          <li>✅ Hashtag แนะนำ</li>
          <li>✅ เวลาโพสต์ที่แนะนำ</li>
          <li>✅ เช็กลิสต์รายวัน</li>
          <li>✅ KPI ที่ควรติดตาม</li>
        </ul>

        <h2>ราคา</h2>

        <p
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#7c3aed",
          }}
        >
          59 บาท
        </p>

        <button>ซื้อแผนนี้</button>
      </div>
    </main>
  );
}