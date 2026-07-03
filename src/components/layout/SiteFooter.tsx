import type { CSSProperties } from "react";
import Link from "next/link";

const productLinks = [
  { href: "/dashboard", label: "ภารกิจวันนี้" },
  { href: "/dashboard/weekly", label: "แผน 7 วัน" },
  { href: "/search", label: "ค้นหาไอเดีย" },
  { href: "/favorites", label: "บันทึกไว้" },
];

const libraryLinks = [
  { href: "/hooks", label: "คลัง Hook" },
  { href: "/captions", label: "แคปชัน" },
  { href: "/cta", label: "CTA / คำชวนให้ทำ" },
  { href: "/scripts", label: "สคริปต์" },
];

const businessLinks = [
  { href: "/quality", label: "มาตรฐานคุณภาพ" },
  { href: "/quality/hooks", label: "ตรวจคุณภาพ Hook" },
  { href: "/premium", label: "พรีเมียม" },
  { href: "/pricing", label: "ราคาแพ็กเกจ" },
];

export default function SiteFooter() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <section style={brandBoxStyle}>
          <h2 style={brandTitleStyle}>Creator OS</h2>

          <p style={brandTextStyle}>
            ระบบช่วยคนทำคอนเทนต์ ค้นหา Hook บันทึกไอเดีย
            ตรวจคุณภาพ และต่อยอดเป็นแพ็กพรีเมียมในอนาคต
          </p>
        </section>

        <section style={linkColumnStyle}>
          <h3 style={columnTitleStyle}>เครื่องมือหลัก</h3>

          {productLinks.map((item) => (
            <Link key={item.href} href={item.href} style={linkStyle}>
              {item.label}
            </Link>
          ))}
        </section>

        <section style={linkColumnStyle}>
          <h3 style={columnTitleStyle}>คลังคอนเทนต์</h3>

          {libraryLinks.map((item) => (
            <Link key={item.href} href={item.href} style={linkStyle}>
              {item.label}
            </Link>
          ))}
        </section>

        <section style={linkColumnStyle}>
          <h3 style={columnTitleStyle}>สำหรับการขาย</h3>

          {businessLinks.map((item) => (
            <Link key={item.href} href={item.href} style={linkStyle}>
              {item.label}
            </Link>
          ))}
        </section>
      </div>

      <div style={bottomStyle}>
        <p style={{ margin: 0 }}>
          © Creator OS — ระบบช่วยวางแผนและสร้างคอนเทนต์สำหรับ Creator
        </p>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  marginTop: "48px",
  borderTop: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const innerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "32px 24px",
  display: "grid",
  gridTemplateColumns: "minmax(260px, 1.4fr) repeat(3, minmax(160px, 1fr))",
  gap: "24px",
};

const brandBoxStyle: CSSProperties = {
  maxWidth: "420px",
};

const brandTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "10px",
  fontSize: "24px",
};

const brandTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.8",
  margin: 0,
};

const linkColumnStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  alignContent: "start",
};

const columnTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "16px",
};

const linkStyle: CSSProperties = {
  color: "#374151",
  textDecoration: "none",
  fontSize: "14px",
};

const bottomStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "16px 24px 24px",
  color: "#6b7280",
  fontSize: "14px",
};