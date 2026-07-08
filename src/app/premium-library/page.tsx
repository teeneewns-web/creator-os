"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { PremiumHook } from "../../types/premium";
import hooksData from "../../data/premium/hooks/food.json";

const hooks = hooksData as PremiumHook[];

export default function PremiumLibraryPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyContent(item: PremiumHook) {
    const content = `${item.hook}

${item.script}

CTA: ${item.cta}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(item.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      alert("คัดลอกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>Creator OS Premium</p>
        <h1 style={titleStyle}>Premium Hook Library</h1>
        <p style={subtitleStyle}>
          Hook พร้อมเหตุผล สคริปต์ CTA และตัวเลือก A/B
          สำหรับนำไปสร้างคอนเทนต์ได้ทันที
        </p>
      </section>

      <section style={libraryStyle}>
        {hooks.map((item) => (
          <article key={item.id} style={cardStyle}>
            <div style={topRowStyle}>
              <div style={badgeRowStyle}>
                <span style={premiumBadgeStyle}>{item.tier}</span>
                <span style={categoryBadgeStyle}>{item.industry}</span>
                <span style={statusBadgeStyle}>{item.status}</span>
              </div>

              <strong style={scoreStyle}>⭐ {item.score}/100</strong>
            </div>

            <p style={idStyle}>
              {item.id} · Version {item.version}
            </p>

            <h2 style={cardTitleStyle}>{item.title}</h2>

            <div style={contentBoxStyle}>
              <p style={contentLabelStyle}>Hook</p>
              <p style={hookStyle}>{item.hook}</p>
            </div>

            <div style={infoGridStyle}>
              <div style={infoBoxStyle}>
                <p style={contentLabelStyle}>เป้าหมาย</p>
                <p style={normalTextStyle}>{item.goal}</p>
              </div>

              <div style={infoBoxStyle}>
                <p style={contentLabelStyle}>อารมณ์</p>
                <p style={normalTextStyle}>{item.emotion}</p>
              </div>

              <div style={infoBoxStyle}>
                <p style={contentLabelStyle}>ระดับ</p>
                <p style={normalTextStyle}>{item.difficulty}</p>
              </div>
            </div>

            <div style={contentSectionStyle}>
              <h3 style={sectionHeadingStyle}>ทำไม Hook นี้จึงใช้ได้</h3>
              <p style={normalTextStyle}>{item.why}</p>
            </div>

            <div style={contentSectionStyle}>
              <h3 style={sectionHeadingStyle}>ตัวอย่าง Script</h3>
              <p style={normalTextStyle}>{item.script}</p>
            </div>

            <div style={ctaBoxStyle}>
              <h3 style={sectionHeadingStyle}>CTA</h3>
              <p style={normalTextStyle}>{item.cta}</p>
            </div>

            <div style={contentSectionStyle}>
              <h3 style={sectionHeadingStyle}>A/B Test</h3>

              <div style={abGridStyle}>
                <div style={abBoxStyle}>
                  <strong>A</strong>
                  <p style={normalTextStyle}>{item.abTest.a}</p>
                </div>

                <div style={abBoxStyle}>
                  <strong>B</strong>
                  <p style={normalTextStyle}>{item.abTest.b}</p>
                </div>
              </div>
            </div>

            <div style={tagRowStyle}>
              {item.platform.map((platform) => (
                <span key={platform} style={platformTagStyle}>
                  {platform}
                </span>
              ))}

              {item.keywords.map((keyword) => (
                <span key={keyword} style={keywordTagStyle}>
                  #{keyword}
                </span>
              ))}
            </div>

            <button
              type="button"
              style={copyButtonStyle}
              onClick={() => copyContent(item)}
            >
              {copiedId === item.id
                ? "คัดลอกแล้ว ✓"
                : "คัดลอก Hook + Script + CTA"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "24px",
};

const heroStyle: CSSProperties = {
  padding: "36px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const labelStyle: CSSProperties = {
  marginTop: 0,
  color: "#a5b4fc",
  fontWeight: "bold",
};

const titleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "clamp(34px, 8vw, 48px)",
};

const subtitleStyle: CSSProperties = {
  marginBottom: 0,
  maxWidth: "760px",
  color: "#d1d5db",
  lineHeight: "1.8",
};

const libraryStyle: CSSProperties = {
  display: "grid",
  gap: "22px",
  marginTop: "24px",
};

const cardStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
  boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  flexWrap: "wrap",
};

const badgeRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const premiumBadgeStyle: CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontSize: "13px",
  fontWeight: "bold",
};

const categoryBadgeStyle: CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4338ca",
  fontSize: "13px",
  fontWeight: "bold",
};

const statusBadgeStyle: CSSProperties = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#ecfdf5",
  color: "#047857",
  fontSize: "13px",
  fontWeight: "bold",
};

const scoreStyle: CSSProperties = {
  color: "#b45309",
};

const idStyle: CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
};

const cardTitleStyle: CSSProperties = {
  margin: "12px 0 18px",
  fontSize: "26px",
};

const contentBoxStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  background: "#111827",
  color: "white",
};

const contentLabelStyle: CSSProperties = {
  margin: "0 0 7px",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#818cf8",
};

const hookStyle: CSSProperties = {
  margin: 0,
  fontSize: "21px",
  lineHeight: "1.6",
  fontWeight: "bold",
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
  marginTop: "16px",
};

const infoBoxStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const contentSectionStyle: CSSProperties = {
  marginTop: "20px",
};

const sectionHeadingStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: "17px",
};

const normalTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.8",
};

const ctaBoxStyle: CSSProperties = {
  marginTop: "20px",
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const abGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "12px",
};

const abBoxStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const tagRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "20px",
};

const platformTagStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: "999px",
  background: "#111827",
  color: "white",
  fontSize: "13px",
};

const keywordTagStyle: CSSProperties = {
  padding: "7px 10px",
  borderRadius: "999px",
  background: "#f3f4f6",
  color: "#374151",
  fontSize: "13px",
};

const copyButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "22px",
  padding: "13px 18px",
  border: 0,
  borderRadius: "14px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};