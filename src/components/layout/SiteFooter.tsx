import type { CSSProperties } from "react";
import Link from "next/link";

const footerGroups = [
  {
    title: "เริ่มใช้งาน",
    links: [
      { href: "/", label: "หน้าแรก" },
      { href: "/about", label: "เกี่ยวกับเว็บ" },
      { href: "/faq", label: "FAQ / คำถามที่พบบ่อย" },
      { href: "/contact", label: "ติดต่อ / ข้อเสนอแนะ" },
      { href: "/guide", label: "คู่มือเริ่มใช้งาน" },
      { href: "/roadmap", label: "Roadmap / แผนพัฒนาต่อ" },
      { href: "/dashboard", label: "ภารกิจวันนี้" },
      { href: "/dashboard/weekly", label: "แผน 7 วัน" },
      { href: "/privacy", label: "นโยบายความเป็นส่วนตัว" },
      { href: "/terms", label: "เงื่อนไขการใช้งาน" },
    ],
  },
  {
    title: "คลังคอนเทนต์",
    links: [
      { href: "/hooks", label: "คลัง Hook" },
      { href: "/search", label: "ค้นหาไอเดีย" },
      { href: "/favorites", label: "บันทึกไว้" },
      { href: "/captions", label: "แคปชัน" },
      { href: "/cta", label: "CTA / คำชวนให้ทำ" },
      { href: "/scripts", label: "สคริปต์" },
    ],
  },
  {
    title: "คุณภาพและแพ็กเกจ",
    links: [
      { href: "/quality", label: "มาตรฐานคุณภาพ" },
      { href: "/quality/hooks", label: "ตรวจคุณภาพ Hook" },
      { href: "/samples", label: "ตัวอย่างแพ็ก / Samples" },
      { href: "/premium", label: "แพ็กพรีเมียม" },
      { href: "/pricing", label: "ราคาแพ็กเกจ" },
      
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <section style={brandSectionStyle}>
          <Link href="/" style={brandLinkStyle}>
            Creator OS
          </Link>

          <p style={brandTextStyle}>
            ระบบผู้ช่วยทำคอนเทนต์สำหรับ Creator เจ้าของเพจ เจ้าของร้าน
            และคนที่อยากเริ่มทำคอนเทนต์โดยไม่ต้องเริ่มจากหน้าว่าง
          </p>

          <div style={badgeRowStyle}>
            <span style={badgeStyle}>Hook Library</span>
            <span style={badgeStyle}>Dashboard</span>
            <span style={badgeStyle}>Premium-ready</span>
          </div>
        </section>

        <section style={linkGridStyle}>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 style={groupTitleStyle}>{group.title}</h3>

              <nav style={linkListStyle}>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} style={footerLinkStyle}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </section>
      </div>

      <div style={bottomBarStyle}>
        <p style={bottomTextStyle}>
          © Creator OS — ระบบช่วยวางแผน หาไอเดีย และตรวจคุณภาพคอนเทนต์
        </p>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  marginTop: "48px",
  background: "#111827",
  color: "white",
  overflowX: "hidden",
};

const innerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "34px 24px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
  gap: "34px",
};

const brandSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const brandLinkStyle: CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: "26px",
  fontWeight: "bold",
};

const brandTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  margin: 0,
};

const badgeRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const badgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 10px",
  borderRadius: "999px",
  background: "#1f2937",
  border: "1px solid #374151",
  color: "#d1d5db",
  fontSize: "13px",
  fontWeight: "bold",
};

const linkGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
  gap: "24px",
};

const groupTitleStyle: CSSProperties = {
  margin: "0 0 12px",
  fontSize: "17px",
};

const linkListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const footerLinkStyle: CSSProperties = {
  color: "#d1d5db",
  textDecoration: "none",
  lineHeight: "1.5",
};

const bottomBarStyle: CSSProperties = {
  borderTop: "1px solid #1f2937",
  padding: "16px 24px",
};

const bottomTextStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  color: "#9ca3af",
  fontSize: "14px",
};