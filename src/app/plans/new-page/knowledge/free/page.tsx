import Link from "next/link";

export default function FreeKnowledgePlan() {
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

      <h1>📚 แผนเพจสายความรู้ (ฟรี)</h1>

      <p style={{ color: "#555" }}>
        แผนเริ่มต้น 7 วัน สำหรับคนที่กำลังสร้างเพจสายความรู้
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "16px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>📅 Day 1</h2>

        <p>
          <strong>ภารกิจ:</strong>
          โพสต์แนะนำตัวตนของเพจ
        </p>

        <p>
          <strong>สิ่งที่ควรโพสต์:</strong>
          เล่าว่าคุณคือใคร และเพจนี้จะช่วยคนติดตามเรื่องอะไร
        </p>

        <p>
          <strong>ตัวอย่าง:</strong>
          "ผมเคยพลาดเรื่องนี้มาก่อน วันนี้เลยอยากแบ่งปันประสบการณ์ให้คนอื่นไม่ต้องพลาดเหมือนผม"
        </p>

        <p>
          <strong>เวลาที่แนะนำ:</strong>
          18:00 - 20:00
        </p>

        <ul>
          <li>✅ โพสต์แล้ว</li>
          <li>✅ ตอบคอมเมนต์อย่างน้อย 5 คน</li>
          <li>✅ แชร์โพสต์เข้ากลุ่ม 1 กลุ่ม</li>
        </ul>
      </div>
    </main>
  );
}