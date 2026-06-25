import Link from "next/link";

export default function MasterKnowledgePlan() {
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

      <h1>👑 Growth Master</h1>

      <h2>แผนเพจสายความรู้ (30 วัน+)</h2>

      <p style={{ color: "#555" }}>
        สำหรับคนที่ต้องการสร้างเพจให้เติบโตอย่างจริงจังและต่อยอดในระยะยาว
      </p>

      <div
        style={{
          border: "2px solid #f59e0b",
          borderRadius: "16px",
          padding: "20px",
          background: "#fffaf0",
          marginTop: "20px",
        }}
      >
        <h2>สิ่งที่คุณจะได้รับ</h2>

        <ul>
          <li>✅ ทุกอย่างจาก Creator Pro</li>
          <li>✅ วิธีแก้ยอดวิวต่ำ</li>
          <li>✅ วิธีเพิ่มผู้ติดตาม</li>
          <li>✅ วิธีเพิ่มคอมเมนต์</li>
          <li>✅ วิธีวิเคราะห์ผลลัพธ์</li>
          <li>✅ แผนต่อยอดเดือนถัดไป</li>
          <li>✅ แนวทางการเติบโตระยะยาว</li>
        </ul>

        <h2>ราคา</h2>

        <p
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#d97706",
          }}
        >
          99 บาท
        </p>

        <button>ซื้อแผนนี้</button>
      </div>
    </main>
  );
}