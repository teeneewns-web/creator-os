export default function PremiumPage() 
{
  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1>💎 Premium Creator Toolkit</h1>

      <p style={{ color: "#555", fontSize: "18px", marginBottom: "24px" }}>
        สำหรับ Creator ที่อยากทำคอนเทนต์ให้เร็วขึ้น โดยไม่ต้องเริ่มคิดจากศูนย์ทุกครั้ง
      </p>

      <div
        style={{
          border: "2px solid #4f46e5",
          borderRadius: "18px",
          padding: "24px",
          background: "#f8faff",
          marginBottom: "24px",
        }}
      >
        <h2>สิ่งที่คุณจะได้</h2>

        <ul>
          <li>🎣 Hook สำหรับเปิดคลิป / เปิดโพสต์</li>
          <li>📝 Caption สำหรับเพิ่มการมีส่วนร่วม</li>
          <li>📢 CTA สำหรับปิดท้ายโพสต์ให้คนกด คอมเมนต์ แชร์</li>
          <li>🎬 Script สำหรับ TikTok, Reels และ Shorts</li>
          <li>🔍 ระบบค้นหาคอนเทนต์ทั้งหมดในเว็บ</li>
          <li>⭐ บันทึกรายการโปรดไว้ใช้ซ้ำ</li>
        </ul>

        <h2>เหมาะกับใคร?</h2>

        <ul>
          <li>Creator มือใหม่</li>
          <li>คนทำ TikTok / Reels / Shorts</li>
          <li>แม่ค้าออนไลน์ / Affiliate</li>
          <li>คนที่คิดคอนเทนต์ไม่ออก</li>
          <li>คนที่อยากประหยัดเวลาในการทำโพสต์</li>
        </ul>

        <h2>ราคาเริ่มต้น 99 บาท / เดือน</h2>

        <p style={{ color: "#555" }}>
          ตอนนี้ยังเป็นช่วงทดลองเปิดใช้งาน หากสนใจ Premium ให้ติดต่อผู้ดูแลเว็บโดยตรง
        </p>

        <a href="https://facebook.com" target="_blank">
          <button
            style={{
              padding: "12px 22px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "12px",
            }}
          >
            ติดต่อเพื่อสมัคร Premium
          </button>
        </a>
      </div>
    </main>
  );
}