import Link from "next/link";

export default function NewPagePlans() {
  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <h1>🆕 แผนสำหรับเพจใหม่</h1>

      <Link href="/plans">
  <button>⬅️ กลับ</button>
</Link>

      <p style={{ color: "#555", marginBottom: "30px" }}>
        เลือกแนวทางของเพจที่คุณอยากเริ่มทำ
      </p>

      <div style={{ display: "grid", gap: "16px" }}>
        <Link href="/plans/new-page/knowledge">
          <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
            <h2>📚 เพจสายความรู้</h2>
            <p>เหมาะกับคนที่อยากสร้างเพจให้ความรู้ แชร์ประสบการณ์ หรือสอนเรื่องที่ตัวเองถนัด</p>
          </div>
        </Link>

        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>😂 เพจสายตลก</h2>
          <p>สำหรับคอนเทนต์บันเทิง มีม เรื่องขำ หรือคอนเทนต์ไวรัล</p>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "16px", padding: "20px" }}>
          <h2>💰 เพจสร้างรายได้</h2>
          <p>สำหรับคนที่อยากทำเพจเพื่อสร้างโอกาสทางรายได้ในอนาคต</p>
        </div>
      </div>
    </main>
  );
}