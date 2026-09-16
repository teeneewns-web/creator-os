import type { CSSProperties } from "react";
import Link from "next/link";

const groups = [
  {
    title: "Creator OS",
    links: [
      { href: "/start", label: "เริ่มสร้างแผน" },
      { href: "/samples", label: "ตัวอย่างแผน" },
      { href: "/pricing", label: "ราคา Paid Beta" },
      { href: "/faq", label: "คำถามที่พบบ่อย" },
    ],
  },
  {
    title: "ช่วยเหลือ",
    links: [
      { href: "/contact", label: "ติดต่อและแจ้งปัญหา" },
      { href: "/quality", label: "มาตรฐานคุณภาพ" },
      { href: "/privacy", label: "นโยบายความเป็นส่วนตัว" },
      { href: "/terms", label: "เงื่อนไขการใช้งาน" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <section style={brandSectionStyle}>
          <Link href="/" style={brandStyle}>Creator OS</Link>
          <p style={brandTextStyle}>
            บริการสร้างแผนคอนเทนต์ 7 วันจากข้อมูลจริงของสินค้า บริการ หรือครีเอเตอร์
            พร้อมตรวจความตรง ความซ้ำ และความเป็นไปได้ก่อนส่งมอบ
          </p>
          <div style={badgeRowStyle}>
            <span style={badgeStyle}>แผนเฉพาะบุคคล</span>
            <span style={badgeStyle}>พร้อมทำ 7 วัน</span>
            <span style={badgeStyle}>Quality Gate</span>
          </div>
        </section>

        <section style={groupGridStyle}>
          {groups.map((group) => (
            <div key={group.title}>
              <h3 style={groupTitleStyle}>{group.title}</h3>
              <nav style={linkListStyle}>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} style={linkStyle}>{link.label}</Link>
                ))}
              </nav>
            </div>
          ))}
        </section>
      </div>
      <div style={bottomStyle}>
        © Creator OS — แผนคอนเทนต์ 7 วันพร้อมทำจริง
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = { marginTop: "56px", background: "#111827", color: "white" };
const innerStyle: CSSProperties = { maxWidth: "1180px", margin: "0 auto", padding: "38px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "34px" };
const brandSectionStyle: CSSProperties = { display: "grid", gap: "12px" };
const brandStyle: CSSProperties = { color: "white", textDecoration: "none", fontSize: "26px", fontWeight: 900 };
const brandTextStyle: CSSProperties = { margin: 0, color: "#d1d5db", lineHeight: 1.8 };
const badgeRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "8px" };
const badgeStyle: CSSProperties = { padding: "7px 10px", borderRadius: "999px", background: "#1f2937", border: "1px solid #374151", color: "#d1d5db", fontSize: "13px", fontWeight: 800 };
const groupGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: "24px" };
const groupTitleStyle: CSSProperties = { margin: "0 0 12px", fontSize: "17px" };
const linkListStyle: CSSProperties = { display: "grid", gap: "10px" };
const linkStyle: CSSProperties = { color: "#d1d5db", textDecoration: "none", lineHeight: 1.5 };
const bottomStyle: CSSProperties = { borderTop: "1px solid #1f2937", padding: "16px 24px", color: "#9ca3af", fontSize: "14px", textAlign: "center" };
