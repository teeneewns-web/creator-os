"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../dashboard/CopyButton";

export type HookQualityLevel =
  | "premium-ready"
  | "pro"
  | "free"
  | "needs-rewrite";

export type HookCategoryData = {
  slug: string;
  icon: string;
  label: string;
  title: string;
  description: string;
  href: string;
};

export type HookDisplayItem = {
  id: string;
  text: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
  level: HookQualityLevel;
  score: number;
  levelLabel: string;
  rewriteText: string;
};

type HookCategoryClientProps = {
  categoryData: HookCategoryData;
  hooks: HookDisplayItem[];
};

const levelOptions = [
  {
    value: "all",
    label: "ทั้งหมด",
  },
  {
    value: "premium-ready",
    label: "Premium-ready",
  },
  {
    value: "pro",
    label: "Pro",
  },
  {
    value: "free",
    label: "Free",
  },
  {
    value: "needs-rewrite",
    label: "Needs rewrite",
  },
];

function countLevel(hooks: HookDisplayItem[], level: HookQualityLevel) {
  return hooks.filter((item) => item.level === level).length;
}

export default function HookCategoryClient({
  categoryData,
  hooks,
}: HookCategoryClientProps) {
  const [levelFilter, setLevelFilter] = useState("all");

  const filteredHooks = useMemo(() => {
    if (levelFilter === "all") {
      return hooks;
    }

    return hooks.filter((item) => item.level === levelFilter);
  }, [hooks, levelFilter]);

  const premiumReadyCount = countLevel(hooks, "premium-ready");
  const proCount = countLevel(hooks, "pro");
  const freeCount = countLevel(hooks, "free");
  const needsRewriteCount = countLevel(hooks, "needs-rewrite");

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>
          {categoryData.icon} {categoryData.label}
        </p>

        <h1 style={titleStyle}>{categoryData.title}</h1>

        <p style={subtitleStyle}>{categoryData.description}</p>

        <div style={buttonRowStyle}>
          <Link href="/hooks">
            <button style={secondaryButtonStyle}>← กลับไปคลัง Hook</button>
          </Link>

          <Link href="/search">
            <button style={primaryButtonStyle}>🔍 ค้นหา Hook เพิ่ม</button>
          </Link>

          <Link href="/dashboard">
            <button style={secondaryButtonStyle}>🏠 ใช้กับ Dashboard</button>
          </Link>
        </div>
      </section>

      <section style={qualitySummaryGridStyle}>
        <button
          type="button"
          onClick={() => setLevelFilter("all")}
          style={summaryButtonStyle(levelFilter === "all")}
        >
          <p style={summaryLabelStyle}>ทั้งหมด</p>
          <h2 style={summaryNumberStyle}>{hooks.length}</h2>
        </button>

        <button
          type="button"
          onClick={() => setLevelFilter("premium-ready")}
          style={summaryButtonStyle(levelFilter === "premium-ready")}
        >
          <p style={summaryLabelStyle}>Premium-ready</p>
          <h2 style={summaryNumberStyle}>{premiumReadyCount}</h2>
        </button>

        <button
          type="button"
          onClick={() => setLevelFilter("pro")}
          style={summaryButtonStyle(levelFilter === "pro")}
        >
          <p style={summaryLabelStyle}>Pro</p>
          <h2 style={summaryNumberStyle}>{proCount}</h2>
        </button>

        <button
          type="button"
          onClick={() => setLevelFilter("free")}
          style={summaryButtonStyle(levelFilter === "free")}
        >
          <p style={summaryLabelStyle}>Free</p>
          <h2 style={summaryNumberStyle}>{freeCount}</h2>
        </button>

        <button
          type="button"
          onClick={() => setLevelFilter("needs-rewrite")}
          style={summaryButtonStyle(levelFilter === "needs-rewrite")}
        >
          <p style={summaryLabelStyle}>Needs rewrite</p>
          <h2 style={summaryNumberStyle}>{needsRewriteCount}</h2>
        </button>
      </section>

      <section style={filterRowStyle}>
        {levelOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setLevelFilter(option.value)}
            style={{
              border:
                levelFilter === option.value
                  ? "1px solid #4f46e5"
                  : "1px solid #ddd",
              background: levelFilter === option.value ? "#eef2ff" : "white",
              color: levelFilter === option.value ? "#4f46e5" : "#374151",
              padding: "8px 12px",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {option.label}
          </button>
        ))}
      </section>

      <section style={resultSummaryStyle}>
        <p style={{ margin: 0, color: "#555" }}>
          กำลังแสดง <strong>{filteredHooks.length}</strong> รายการ
        </p>
      </section>

      {filteredHooks.length > 0 ? (
        <section style={gridStyle}>
          {filteredHooks.map((item, index) => (
            <article key={item.id} style={cardStyle}>
              <p style={cardLabelStyle}>
                {categoryData.label} Hook #{index + 1}
              </p>

              <h2 style={hookTextStyle}>{item.text}</h2>

              <div style={qualityRowStyle}>
                <span style={levelBadgeStyle(item.level)}>
                  {item.levelLabel}
                </span>

                <span style={scorePillStyle}>{item.score}/100</span>
              </div>

              <div style={tagRowStyle}>
                {item.type ? <span style={tagStyle}>{item.type}</span> : null}
                {item.emotion ? (
                  <span style={tagStyle}>{item.emotion}</span>
                ) : null}
                {item.platform ? (
                  <span style={tagStyle}>{item.platform}</span>
                ) : null}
                {item.language ? (
                  <span style={tagStyle}>{item.language}</span>
                ) : null}
              </div>

              {item.level === "free" || item.level === "needs-rewrite" ? (
                <div style={rewriteNoticeStyle}>
                  <p style={rewriteNoticeTitleStyle}>ควรปรับก่อนขาย</p>

                  <p style={rewriteNoticeTextStyle}>{item.rewriteText}</p>
                </div>
              ) : null}

              <div style={buttonRowStyle}>
                <CopyButton text={item.text} />

                {item.level === "free" || item.level === "needs-rewrite" ? (
                  <CopyButton text={item.rewriteText} />
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ไม่พบ Hook ในระดับนี้</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            ลองเลือกตัวกรองระดับอื่น หรือเลือก “ทั้งหมด”
          </p>
        </section>
      )}

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>อยากเอา Hook ไปเขียนโพสต์ต่อ?</h2>

        <p style={{ color: "#d1d5db", lineHeight: "1.8", fontSize: "17px" }}>
          คัดลอก Hook ที่ชอบ แล้วนำไปต่อกับ Caption, CTA และร่างโพสต์ใน Dashboard
        </p>

        <Link href="/dashboard">
          <button style={darkButtonStyle}>เปิด Dashboard</button>
        </Link>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "40px 24px",
  borderRadius: "24px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "42px",
  lineHeight: "1.15",
  margin: "12px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#374151",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "760px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #c7d2fe",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const qualitySummaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
  gap: "12px",
  marginTop: "20px",
};

function summaryButtonStyle(active: boolean): CSSProperties {
  return {
    textAlign: "left",
    border: active ? "1px solid #4f46e5" : "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "16px",
    background: active ? "#eef2ff" : "white",
    cursor: "pointer",
  };
}

const summaryLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const summaryNumberStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "30px",
};

const filterRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const resultSummaryStyle: CSSProperties = {
  marginTop: "16px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "20px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "22px",
  padding: "20px",
  background: "white",
};

const cardLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const hookTextStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: "1.55",
};

const qualityRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: "12px",
};

function levelBadgeStyle(level: HookQualityLevel): CSSProperties {
  const isPremium = level === "premium-ready";
  const isPro = level === "pro";
  const isFree = level === "free";
  const isBad = level === "needs-rewrite";

  return {
    display: "inline-block",
    padding: "7px 11px",
    borderRadius: "999px",
    background: isPremium
      ? "#eef2ff"
      : isPro
        ? "#f0fdf4"
        : isFree
          ? "#fffbeb"
          : isBad
            ? "#fff7f7"
            : "#f8fafc",
    color: isPremium
      ? "#4f46e5"
      : isPro
        ? "#166534"
        : isFree
          ? "#92400e"
          : isBad
            ? "#dc2626"
            : "#374151",
    border: isPremium
      ? "1px solid #c7d2fe"
      : isPro
        ? "1px solid #bbf7d0"
        : isFree
          ? "1px solid #fde68a"
          : isBad
            ? "1px solid #fecaca"
            : "1px solid #e5e7eb",
    fontWeight: "bold",
    fontSize: "13px",
  };
}

const scorePillStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontWeight: "bold",
  fontSize: "13px",
};

const tagRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const tagStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "bold",
};

const rewriteNoticeStyle: CSSProperties = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
};

const rewriteNoticeTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  color: "#4f46e5",
  fontWeight: "bold",
};

const rewriteNoticeTextStyle: CSSProperties = {
  marginBottom: 0,
  color: "#374151",
  lineHeight: "1.7",
  fontWeight: "bold",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  background: "white",
  textAlign: "center",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "24px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const darkButtonStyle: CSSProperties = {
  marginTop: "12px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};