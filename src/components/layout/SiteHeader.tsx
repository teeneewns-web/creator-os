import type { CSSProperties } from "react";
import Link from "next/link";

const navItems = [
  { href: "/samples", label: "Samples" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteHeader() {
  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Link href="/" style={brandStyle}>
          <span style={brandMarkStyle}>C</span>
          <span style={brandTextStyle}>Creator OS</span>
        </Link>

        <nav style={navStyle} aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={navLinkStyle}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/start" style={ctaStyle}>Create my plan →</Link>
      </div>
    </header>
  );
}

const headerStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 50, background: "rgba(250,247,242,0.85)", borderBottom: "1px solid #E8E1D6", backdropFilter: "blur(12px)" };
const innerStyle: CSSProperties = { maxWidth: "1180px", margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px" };
const brandStyle: CSSProperties = { display: "inline-flex", alignItems: "center", gap: "8px", minWidth: 0, color: "#1A1614", textDecoration: "none", fontSize: "18px", fontWeight: 900, marginRight: "auto" };
const brandMarkStyle: CSSProperties = { width: "34px", height: "34px", borderRadius: "11px", background: "#1A1614", color: "#FAF7F2", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" };
const brandTextStyle: CSSProperties = { whiteSpace: "nowrap" };
const navStyle: CSSProperties = { display: "flex", alignItems: "center", gap: "4px", overflowX: "auto" };
const navLinkStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "38px", padding: "0 10px", borderRadius: "10px", color: "#6B6259", textDecoration: "none", fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap" };
const ctaStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "40px", padding: "0 16px", borderRadius: "12px", background: "#D97757", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", flex: "0 0 auto", boxShadow: "0 2px 8px rgba(217,119,87,0.25)" };