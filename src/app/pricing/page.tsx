export default function PricingPage() { 
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1>💎 ราคาใช้งาน</h1>

      <p style={{ color: "#666" }}>
        เลือกแพ็กเกจที่เหมาะกับคุณ
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "16px",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        <h2>ฟรี</h2>

        <p>เข้าถึงเนื้อหาบางส่วน</p>

        <ul>
          <li>Hook บางส่วน</li>
          <li>CTA บางส่วน</li>
          <li>Captions บางส่วน</li>
          <li>Scripts บางส่วน</li>
        </ul>

        <h3>0 บาท</h3>
      </div>

      <div
        style={{
          border: "2px solid #4f46e5",
          borderRadius: "16px",
          padding: "20px",
          marginTop: "20px",
          background: "#f8faff",
        }}
      >
        <h2>Premium</h2>

        <p>ปลดล็อกคลังคอนเทนต์ทั้งหมด</p>

        <ul>
          <li>Hook ทั้งหมด</li>
          <li>CTA ทั้งหมด</li>
          <li>Captions ทั้งหมด</li>
          <li>Scripts ทั้งหมด</li>
          <li>อัปเดตเนื้อหาใหม่</li>
        </ul>

        <h3>99 บาท / เดือน</h3>
      </div>
    </main>
  ) ;
}