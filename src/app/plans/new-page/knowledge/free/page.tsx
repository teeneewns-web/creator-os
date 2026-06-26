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

      <h1>🌱 แผนเริ่มต้น (ฟรี)</h1>

      <p
        style={{
          color: "#666",
          fontSize: "18px",
          marginBottom: "24px",
        }}
      >
        ทดลองใช้งานแผนสร้างเพจสายความรู้ 7 วัน
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "30px",
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

      <div
        style={{
          border: "2px solid #22c55e",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <h2>🎯 Day 1 : ทำให้คนรู้ว่าเพจนี้เกี่ยวกับอะไร</h2>

        <hr />

        <h3>📌 ภารกิจวันนี้</h3>

        <p>
          โพสต์แนะนำเพจให้คนใหม่เข้าใจภายใน 10 วินาทีว่าเพจนี้ให้ความรู้อะไร
        </p>

        <h3>📝 โครงสร้างโพสต์</h3>

        <ol>
          <li>เปิดด้วยปัญหาที่คนส่วนใหญ่เจอ</li>
          <li>แนะนำว่าคุณคือใคร</li>
          <li>บอกว่าคนติดตามจะได้อะไร</li>
          <li>ชวนกดติดตาม</li>
        </ol>

        <h3>🎣 Hook แนะนำ</h3>

        <ul>
          <li>90% ของคนทำผิดเรื่องนี้</li>
          <li>ผมเสียเวลาเป็นปีเพราะไม่รู้สิ่งนี้</li>
          <li>ถ้าคุณเพิ่งเริ่ม อย่าพลาดเรื่องนี้</li>
        </ul>

        <h3>⏰ เวลาโพสต์</h3>

        <p>18:00 - 20:00</p>

        <h3>#️⃣ Hashtag แนะนำ</h3>

        <p>#ความรู้ #พัฒนาตัวเอง #สาระ #แชร์ความรู้</p>

        <h3>✅ เช็กลิสต์</h3>

        <ul>
          <li>⬜ โพสต์แล้ว</li>
          <li>⬜ ตอบคอมเมนต์ 5 คน</li>
          <li>⬜ แชร์เข้ากลุ่มที่เกี่ยวข้อง 1 กลุ่ม</li>
        </ul>

        <h3>💡 เคล็ดลับ</h3>

        <p>
          คนติดตามไม่ได้สนใจว่า "คุณคือใคร" แต่สนใจว่า
          "คุณช่วยเขาเรื่องอะไรได้"
        </p>
      </div>

      <div
        style={{
          marginTop: "30px",
          border: "2px dashed #3b82f6",
          borderRadius: "18px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>🚀 อยากได้ครบทั้ง 15 วัน?</h2>

        <p>
          Creator Plus มีภารกิจรายวัน, Hook, Hashtag,
          แนวทางโพสต์ และเช็กลิสต์ครบทุกวัน
        </p>

        <Link href="/plans/new-page/knowledge/plus">
          <button>อัปเกรดเป็น Plus</button>
        </Link>
      </div>
    </main>
  );
}