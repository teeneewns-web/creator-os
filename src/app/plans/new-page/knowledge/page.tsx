import Link from "next/link";

export default function KnowledgePlanPage() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <Link href="/plans/new-page">
        <button>⬅️ กลับ</button>
      </Link>

      <h1>📚 แผนเพจสายความรู้</h1>

      <p
        style={{
          color: "#555",
          marginBottom: "24px",
        }}
      >
        เลือกแผนที่เหมาะกับคุณ เริ่มจากฟรี แล้วค่อยอัปเกรดเมื่ออยากได้แผนที่ละเอียดขึ้น
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        {/* ฟรี */}
        <div
          style={{
            border: "2px solid #22c55e",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>🟢 ฟรี</h2>

          <h3>แผนเริ่มต้น 7 วัน</h3>

          <p>เหมาะกับคนที่อยากลองเริ่มทำเพจก่อน</p>

          <ul>
            <li>✅ บอกว่าวันนี้ควรโพสต์อะไร</li>
            <li>✅ แนวทางโพสต์แบบเข้าใจง่าย</li>
            <li>✅ เช็กลิสต์รายวัน</li>
          </ul>

          <Link href="/plans/new-page/knowledge/free">
            <button>เริ่มใช้ฟรี</button>
          </Link>
        </div>

        {/* Plus */}
        <div
          style={{
            border: "2px solid #3b82f6",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>🔵 Creator Plus</h2>

          <h3>แผน 15 วัน</h3>

          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            29 บาท
          </p>

          <p>เหมาะกับคนที่อยากทำต่อเนื่องและไม่อยากคิดเองทุกวัน</p>

          <ul>
            <li>✅ ภารกิจรายวัน</li>
            <li>✅ แนวทางโพสต์</li>
            <li>✅ Hook เปิดโพสต์</li>
            <li>✅ Hashtag แนะนำ</li>
            <li>✅ เวลาโพสต์</li>
          </ul>

          <Link href="/plans/new-page/knowledge/plus">
            <button>ดูแผน Plus</button>
          </Link>
        </div>

        {/* Pro */}
        <div
          style={{
            border: "2px solid #8b5cf6",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>🟣 Creator Pro</h2>

          <h3>แผน 30 วัน</h3>

          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            59 บาท
          </p>

          <p>เหมาะกับคนที่อยากทำทั้งโพสต์และคลิปสั้น</p>

          <ul>
            <li>✅ ทุกอย่างจาก Plus</li>
            <li>✅ ไอเดีย Reels</li>
            <li>✅ Hook เปิดคลิป</li>
            <li>✅ CTA ปิดคลิป</li>
            <li>✅ KPI ที่ควรดู</li>
          </ul>

          <Link href="/plans/new-page/knowledge/pro">
  <button>ดูแผน Pro</button>
</Link>
        </div>

        {/* Master */}
        <div
          style={{
            border: "2px solid #f59e0b",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>🟡 Growth Master</h2>

          <h3>แผน 30 วัน+</h3>

          <p
            style={{
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            99 บาท
          </p>

          <p>เหมาะกับคนที่อยากจริงจังและต้องการเติบโตระยะยาว</p>

          <ul>
            <li>✅ ทุกอย่างจาก Pro</li>
            <li>✅ วิธีแก้ยอดวิวต่ำ</li>
            <li>✅ วิธีเพิ่มคอมเมนต์</li>
            <li>✅ วิธีเพิ่มผู้ติดตาม</li>
            <li>✅ แผนต่อยอดเดือนถัดไป</li>
          </ul>

          <Link href="/plans/new-page/knowledge/master">
  <button>ดูแผน Master</button>
</Link>
        </div>
      </div>
    </main>
  );
}