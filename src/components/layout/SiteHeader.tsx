"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    if (href === "/dashboard/weekly") {
      return pathname === "/dashboard/weekly";
    }

    return pathname.startsWith(href);
  }

  function getLinkStyle(href: string) {
    const active = isActive(href);

    return {
      textDecoration: "none",
      color: active ? "#4f46e5" : "#374151",
      fontSize: "15px",
      fontWeight: active ? "bold" : "500",
      background: active ? "#eef2ff" : "transparent",
      padding: "8px 10px",
      borderRadius: "10px",
    };
  }

  return (
    <header
      style={{
        borderBottom: "1px solid #e5e7eb",
        background: "white",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          Creator OS
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link href="/" style={getLinkStyle("/")}>
            หน้าแรก
          </Link>

          <Link href="/dashboard" style={getLinkStyle("/dashboard")}>
            ภารกิจวันนี้
          </Link>

          <Link href="/dashboard/weekly" style={getLinkStyle("/dashboard/weekly")}>
            แผน 7 วัน
          </Link>

          <Link href="/search" style={getLinkStyle("/search")}>
            ค้นหา
          </Link>

          <Link href="/hooks" style={getLinkStyle("/hooks")}>
            Hook
          </Link>

          <Link href="/captions" style={getLinkStyle("/captions")}>
            Caption
          </Link>

          <Link href="/cta" style={getLinkStyle("/cta")}>
            CTA
          </Link>

          <Link href="/scripts" style={getLinkStyle("/scripts")}>
            Script
          </Link>

          <Link href="/plans" style={getLinkStyle("/plans")}>
            แผน
          </Link>

          <Link href="/premium" style={getLinkStyle("/premium")}>
            Premium
          </Link>

          <Link href="/pricing" style={getLinkStyle("/pricing")}>
            ราคา
          </Link>
        </nav>
      </div>
    </header>
  );
}