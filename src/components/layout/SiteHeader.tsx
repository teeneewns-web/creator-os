import type { CSSProperties } from "react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "หน้าแรก" },
  { href: "/about", label: "เกี่ยวกับเว็บ" },
  { href: "/dashboard", label: "ภารกิจวันนี้" },
  { href: "/dashboard/weekly", label: "แผน 7 วัน" },
  { href: "/search", label: "ค้นหา" },
  { href: "/hooks", label: "คลัง Hook" },
  { href: "/favorites", label: "บันทึกไว้" },
  { href: "/captions", label: "แคปชัน" },
  { href: "/cta", label: "CTA" },
  { href: "/scripts", label: "สคริปต์" },
  { href: "/quality", label: "คุณภาพ" },
  { href: "/quality/hooks", label: "ตรวจ Hook" },
  { href: "/premium", label: "พรีเมียม" },
  { href: "/pricing", label: "ราคาแพ็กเกจ" },
];

export default function SiteHeader() {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Link href="/" style={brandStyle}>
          <span style={logoStyle}>Creator OS</span>
          <span style={taglineStyle}>ระบบผู้ช่วยทำคอนเทนต์</span>
        </Link>

        <nav style={navStyle}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={item.href === "/favorites" ? favoriteLinkStyle : linkStyle}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

const headerStyle: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "rgba(255,255,255,0.95)",
  borderBottom: "1px solid #e5e7eb",
  backdropFilter: "blur(10px)",
};

const innerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "14px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap",
};

const brandStyle: CSSProperties = {
  display: "grid",
  gap: "2px",
  color: "#111827",
  textDecoration: "none",
};

const logoStyle: CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
};

const taglineStyle: CSSProperties = {
  fontSize: "13px",
  color: "#6b7280",
};

const navStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  alignItems: "center",
};

const linkStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: "999px",
  color: "#374151",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
};

const favoriteLinkStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: "999px",
  color: "#4f46e5",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 700,
};