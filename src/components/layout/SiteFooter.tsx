import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      style={{
        marginTop: "48px",
        borderTop: "1px solid #e5e7eb",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "28px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div>
          <h3 style={{ marginTop: 0 }}>Creator OS</h3>

          <p style={{ color: "#555", lineHeight: "1.7" }}>
            ระบบผู้ช่วย Creator ให้รู้ว่าวันนี้ต้องทำอะไร วางแผน เขียนโพสต์
            ตรวจคุณภาพ และสรุปผลใน 7 วัน
          </p>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>เมนูหลัก</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Link href="/dashboard" style={footerLinkStyle}>
              ภารกิจวันนี้
            </Link>

            <Link href="/dashboard/weekly" style={footerLinkStyle}>
              แผน 7 วัน
            </Link>

            <Link href="/hooks" style={footerLinkStyle}>
              คลัง Hook
            </Link>

            <Link href="/pricing" style={footerLinkStyle}>
              ราคา
            </Link>
          </div>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>เหมาะสำหรับ</h3>

          <p style={{ color: "#555", lineHeight: "1.7" }}>
            คนเริ่มทำเพจ ครีเอเตอร์มือใหม่ คนไม่มีไอเดียโพสต์
            และคนที่อยากมีระบบช่วยทำคอนเทนต์ทุกวัน
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "14px 24px",
          textAlign: "center",
          color: "#777",
          fontSize: "14px",
        }}
      >
        © 2026 Creator OS. All rights reserved.
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  color: "#374151",
  textDecoration: "none",
};