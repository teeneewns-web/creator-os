import Link from "next/link";

export default function MasterKnowledgePlan() {
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <Link href="/plans/new-page/knowledge">
        <button>⬅️ กลับ</button>
      </Link>

      <h1>👑 Growth Master</h1>

      <p style={{ color: "#666", fontSize: "18px", marginBottom: "24px" }}>
        สำหรับ Creator ที่ต้องการเติบโตอย่างจริงจัง พร้อมวิเคราะห์ผลลัพธ์และวางแผนระยะยาว
      </p>

      <div
        style={{
          border: "2px solid #f59e0b",
          borderRadius: "18px",
          padding: "24px",
          background: "#fffaf0",
        }}
      >
        <h2>สิ่งที่คุณจะได้รับ</h2>

        <ul>
          <li>✅ ทุกอย่างจาก Creator Pro</li>
          <li>✅ แผนวิเคราะห์เพจ</li>
          <li>✅ วิธีแก้ยอดวิวตก</li>
          <li>✅ วิธีเพิ่มผู้ติดตาม</li>
          <li>✅ วิธีเพิ่ม Engagement</li>
          <li>✅ วิธีต่อยอดคอนเทนต์ที่ทำผลงานดี</li>
          <li>✅ แผนสร้างคอนเทนต์เดือนถัดไป</li>
          <li>✅ แนวทางเติบโตระยะยาว</li>
        </ul>

        <h2>เหมาะกับใคร?</h2>

        <ul>
          <li>Creator ที่โพสต์ต่อเนื่องแล้ว</li>
          <li>คนที่อยากทำเพจเป็นอาชีพ</li>
          <li>คนที่อยากมีระบบในการเติบโต</li>
        </ul>

        <h2>ราคา</h2>

        <p
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            color: "#d97706",
          }}
        >
          99 บาท
        </p>

        <button
          style={{
            padding: "12px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#d97706",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          ซื้อแผน Master
        </button>
      </div>
    </main>
  );
}