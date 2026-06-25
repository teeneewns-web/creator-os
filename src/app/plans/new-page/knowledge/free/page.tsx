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

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button>✅ Day 1</button>
        <button disabled>Day 2</button>
        <button disabled>Day 3</button>
        <button disabled>Day 4</button>
        <button disabled>Day 5</button>
        <button disabled>Day 6</button>
        <button disabled>Day 7</button>
      </div>

      <p style={{ color: "#555" }}>
        แผนเริ่มต้น 7 วัน สำหรับคนที่กำลังสร้างเพจสายความรู้
      </p>

      <div
        style={{
          backgroundColor: "#f8faff",
          border: "1px solid #c7d2fe",
          borderRadius: "16px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>🎯 วันที่ 1 : สร้างความประทับใจแรก</h2>

        <p>
          <strong>เป้าหมาย</strong>
        </p>

        <p>
          ทำให้คนที่เข้ามาเห็นเพจครั้งแรกรู้ทันทีว่า เพจนี้ให้ความรู้อะไร
          และทำไมควรกดติดตาม
        </p>

        <hr />

        <p>
          <strong>ภารกิจวันนี้</strong>
        </p>

        <p>โพสต์แนะนำตัวตนของเพจ</p>

        <hr />

        <p>
          <strong>สิ่งที่ควรโพสต์</strong>
        </p>

        <p>
          เล่าว่าคุณคือใคร มีประสบการณ์อะไร และเพจนี้จะช่วยผู้ติดตามด้านไหน
        </p>

        <hr />

        <p>
          <strong>ตัวอย่างแนวทาง</strong>
        </p>

        <p>
          "เมื่อก่อนผมเคยทำผิดเรื่องนี้มาตลอด จนวันหนึ่งผมค้นพบวิธีที่ถูกต้อง
          วันนี้ผมเลยสร้างเพจนี้ขึ้นมา เพื่อแบ่งปันสิ่งที่เรียนรู้ให้ทุกคน"
        </p>

        <hr />

        <p>
          <strong>เวลาที่แนะนำ</strong>
        </p>

        <p>18:00 - 20:00</p>

        <hr />

        <p>
          <strong>เช็กลิสต์</strong>
        </p>

        <ul>
          <li>✅ โพสต์เรียบร้อย</li>
          <li>⬜ ตอบคอมเมนต์อย่างน้อย 5 คน</li>
          <li>⬜ แชร์โพสต์เข้ากลุ่มที่เกี่ยวข้อง 1 กลุ่ม</li>
        </ul>

        <hr />

        <p>
          <strong>💡 เคล็ดลับ</strong>
        </p>

        <p>
          อย่าเขียนประวัติตัวเองยาวเกินไป ให้เน้นว่า "ผู้ติดตามจะได้อะไร"
          มากกว่า "คุณคือใคร"
        </p>
      </div>
    </main>
  );
}