import type { CSSProperties } from "react";
import Link from "next/link";

const mainNavItems = [
  { href: "/", label: "หน้าแรก" },
  { href: "/guide", label: "คู่มือ" },
  { href: "/dashboard", label: "ภารกิจวันนี้" },
  { href: "/search", label: "ค้นหา" },
  { href: "/hooks", label: "คลัง Hook" },
  { href: "/pricing", label: "ราคา" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function SiteHeader() {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <div style={topRowStyle}>
          <Link href="/" style={brandStyle}>
            <span style={brandMarkStyle}>C</span>
            <span>Creator OS</span>
          </Link>

          <Link href="/dashboard" style={ctaLinkStyle}>
            เริ่มใช้งาน
          </Link>
        </div>

        <nav style={navStyle}>
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href} style={navLinkStyle}>
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
  overflow: "hidden",
};

const innerStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "12px 16px 10px",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const brandStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  color: "#111827",
  textDecoration: "none",
  fontSize: "20px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const brandMarkStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "12px",
  background: "#4f46e5",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  flex: "0 0 auto",
};

const ctaLinkStyle: CSSProperties = {
  color: "white",
  background: "#4f46e5",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "10px 14px",
  borderRadius: "999px",
  whiteSpace: "nowrap",
  flex: "0 0 auto",
};

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  paddingTop: "10px",
  paddingBottom: "2px",
};

const navLinkStyle: CSSProperties = {
  color: "#374151",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "9px 12px",
  borderRadius: "999px",
  flex: "0 0 auto",
};