export default function PremiumPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1>💎 Premium Creator Toolkit</h1>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        ปลดล็อกคลังคอนเทนต์สำหรับ Creator ที่ต้องการทำคอนเทนต์เร็วขึ้น
      </p>

      <div
        style={{
          border: "2px solid #4f46e5",
          borderRadius: "16px",
          padding: "20px",
          background: "#f8faff",
        }}
      >
        <h2>สิ่งที่จะได้ใน Premium</h2>

        <ul>
          <li>Hook ทั้งหมด</li>
          <li>CTA ทั้งหมด</li>
          <li>Caption ทั้งหมด</li>
          <li>Script ทั้งหมด</li>
          <li>ชุดคอนเทนต์สำหรับ TikTok / Reels / Shorts</li>
          <li>อัปเดตเนื้อหาใหม่ในอนาคต</li>
        </ul>

        <h2>ราคา 99 บาท / เดือน</h2>

        <button
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#4f46e5",
            color: "white",
            cursor: "pointer",
            marginTop: "12px",
          }}
        >
          สมัคร Premium
        </button>
      </div>
    </main>
  );
}