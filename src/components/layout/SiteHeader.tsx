import type { CSSProperties } from "react";
import Link from "next/link";

const mainNavItems = [
  {
    href: "/dashboard/weekly",
    label: "ตัวอย่างแผน",
  },
  {
    href: "/pricing",
    label: "ราคา",
  },
  {
    href: "/contact",
    label: "ติดต่อ",
  },
];

export default function SiteHeader() {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <div style={topRowStyle}>
          <Link href="/" style={brandStyle}>
            <span style={brandMarkStyle}>C</span>
            <span style={brandTextStyle}>Creator OS</span>
          </Link>

          <Link href="/start" style={ctaLinkStyle}>
            เริ่มสร้างแผน
          </Link>
        </div>

        <nav style={navStyle} aria-label="เมนูหลัก">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={navLinkStyle}
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
  background: "rgba(255,255,255,0.97)",
  borderBottom: "1px solid #e5e7eb",
  backdropFilter: "blur(12px)",
};

const innerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "10px 16px",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  minWidth: 0,
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
  color: "#111827",
  textDecoration: "none",
  fontSize: "18px",
  fontWeight: 800,
};

const brandTextStyle: CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const brandMarkStyle: CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: "10px",
  background: "#4f46e5",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  flex: "0 0 auto",
};

const ctaLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40px",
  padding: "0 13px",
  borderRadius: "12px",
  background: "#4f46e5",
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 800,
  whiteSpace: "nowrap",
  flex: "0 0 auto",
};

const navStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "7px",
  marginTop: "9px",
};

const navLinkStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "36px",
  padding: "0 6px",
  borderRadius: "10px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: 800,
  textAlign: "center",
  whiteSpace: "nowrap",
};