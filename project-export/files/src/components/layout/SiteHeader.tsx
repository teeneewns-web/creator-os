import type { CSSProperties } from "react";
import Link from "next/link";

const navItems = [
  { href: "/samples", label: "ตัวอย่างแผน" },
  { href: "/pricing", label: "ราคา" },
  { href: "/faq", label: "คำถาม" },
];

export default function SiteHeader() {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Link href="/" style={brandStyle}>
          <span style={brandMarkStyle}>C</span>
          <span style={brandTextStyle}>Creator OS</span>
        </Link>

        <nav style={navStyle} aria-label="เมนูหลัก">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={navLinkStyle}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/start" style={ctaStyle}>เริ่มสร้างแผน</Link>
      </div>
    </header>
  );
}

const headerStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e5e7eb", backdropFilter: "blur(12px)" };
const innerStyle: CSSProperties = { maxWidth: "1180px", margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px" };
const brandStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "8px", minWidth: 0, color: "#111827", textDecoration: "none", fontSize: "18px", fontWeight: 900, marginRight: "auto" };
const brandMarkStyle: CSSProperties = { width: "34px", height: "34px", borderRadius: "11px", background: "#4f46e5", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" };
const brandTextStyle: CSSProperties = { whiteSpace: "nowrap" };
const navStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "4px", overflowX: "auto" };
const navLinkStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "38px", padding: "0 10px", borderRadius: "10px", color: "#4b5563", textDecoration: "none", fontSize: "14px", fontWeight: 800, whiteSpace: "nowrap" };
const ctaStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "40px", padding: "0 13px", borderRadius: "12px", background: "#4f46e5", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 900, whiteSpace: "nowrap", flex: "0 0 auto" };
