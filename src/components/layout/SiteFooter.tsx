import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      style={{
        marginTop: "56px",
        borderTop: "1px solid #e5e7eb",
        background: "#111827",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "36px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "28px",
        }}
      >
        <div>
          <h3 style={{ marginTop: 0, fontSize: "22px" }}>Creator OS</h3>

          <p style={{ color: "#d1d5db", lineHeight: "1.8" }}>
            ระบบผู้ช่วย Creator ให้รู้ว่าวันนี้ต้องทำอะไร
            ตั้งแต่การวางแผน เขียนโพสต์ ตรวจคุณภาพ บันทึกผล
            และสรุปบทเรียนใน 7 วัน
          </p>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>เริ่มต้นใช้งาน</h3>

          <div style={linkGroupStyle}>
            <Link href="/dashboard" style={footerLinkStyle}>
              ภารกิจวันนี้
            </Link>

            <Link href="/dashboard/weekly" style={footerLinkStyle}>
              แผน 7 วัน
            </Link>

            <Link href="/plans" style={footerLinkStyle}>
              แผนคอนเทนต์
            </Link>
          </div>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>เครื่องมือ Creator</h3>

          <div style={linkGroupStyle}>
            <Link href="/search" style={footerLinkStyle}>
              ค้นหาไอเดีย
            </Link>

            <Link href="/hooks" style={footerLinkStyle}>
              Hook Library
            </Link>

            <Link href="/captions" style={footerLinkStyle}>
              Caption Library
            </Link>

            <Link href="/cta" style={footerLinkStyle}>
              CTA Library
            </Link>

            <Link href="/scripts" style={footerLinkStyle}>
              Script Library
            </Link>
          </div>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>สำหรับอนาคต</h3>

          <div style={linkGroupStyle}>
            <Link href="/pricing" style={footerLinkStyle}>
              แพ็กเกจราคา
            </Link>

            <Link href="/premium" style={footerLinkStyle}>
              Premium
            </Link>

            <Link href="/favorites" style={footerLinkStyle}>
              รายการโปรด
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #374151",
          padding: "16px 24px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "14px",
        }}
      >
        © 2026 Creator OS — Built for creators who want to take action every day.
      </div>
    </footer>
  );
}

const linkGroupStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const footerLinkStyle = {
  color: "#d1d5db",
  textDecoration: "none",
};