import Link from "next/link";
export default function KnowledgePlanPage() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <h1>📚 แผนเพจสายความรู้</h1>
      
      
      <p style={{ color: "#555", marginBottom: "24px" }}>
        เลือกแผนที่เหมาะกับคุณ เริ่มจากฟรี แล้วค่อยอัปเกรดเมื่ออยากได้แผนที่ละเอียดขึ้น
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        <div style={{ border: "2px solid #22c55e", borderRadius: "16px", padding: "20px" }}>
          <h2>🟢 ฟรี</h2>
          <h3>แผนเริ่มต้น 7 วัน</h3>
          <p>เหมาะกับคนที่อยากลองเริ่มทำเพจก่อน</p>

          <ul>
            <li>✅ บอกว่าวันนี้ควรโพสต์อะไร</li>
            <li>✅ มีแนวทางโพสต์แบบเข้าใจง่าย</li>
            <li>✅ มีเช็กลิสต์ให้ทำตาม</li>
          </ul>
          
           <Link href="/plans/new-page/knowledge/free">
  <button>เริ่มใช้ฟรี</button>
</Link>
           </div>

        <div style={{ border: "2px solid #3b82f6", borderRadius: "16px", padding: "20px" }}>
          <h2>🔵 Plus</h2>
          <h3>แผน 15 วัน</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>29 บาท</p>
          <p>เหมาะกับคนที่อยากทำต่อเนื่องและไม่อยากคิดเองทุกวัน</p>

          <ul>
            <li>✅ ภารกิจรายวัน</li>
            <li>✅ แนวทางโพสต์</li>
            <li>✅ Hook เปิดโพสต์</li>
            <li>✅ Hashtag แนะนำ</li>
            <li>✅ เวลาโพสต์แนะนำ</li>
          </ul>

          <button>ดูแผน Plus</button>
        </div>

        <div style={{ border: "2px solid #8b5cf6", borderRadius: "16px", padding: "20px" }}>
          <h2>🟣 Pro</h2>
          <h3>แผน 30 วัน</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>59 บาท</p>
          <p>เหมาะกับคนที่อยากทำทั้งโพสต์และคลิปสั้น</p>

          <ul>
            <li>✅ ทุกอย่างจาก Plus</li>
            <li>✅ ไอเดีย Reels</li>
            <li>✅ Hook เปิดคลิป</li>
            <li>✅ CTA ปิดคลิป</li>
            <li>✅ KPI ที่ควรดู</li>
          </ul>

          <button>ดูแผน Pro</button>
        </div>
       
        <div style={{ border: "2px solid #f59e0b", borderRadius: "16px", padding: "20px" }}>
          <h2>🟡 Master</h2>
          <h3>แผน 30 วัน+</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>99 บาท</p>
          <p>เหมาะกับคนที่อยากจริงจังและอยากมีแผนแก้ปัญหาเวลาคอนเทนต์ไม่โต</p>

          <ul>
            <li>✅ ทุกอย่างจาก Pro</li>
            <li>✅ วิธีแก้ยอดวิวต่ำ</li>
            <li>✅ วิธีเพิ่มคอมเมนต์</li>
            <li>✅ วิธีเพิ่มผู้ติดตาม</li>
            <li>✅ แผนต่อยอดเดือนถัดไป</li>
          </ul>

          <button>ดูแผน Master</button>
        </div>
      </div>
    </main>
  );
}