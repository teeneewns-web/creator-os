import type { CSSProperties } from "react";
import {
  premiumContentChecklist,
  premiumLevels,
  premiumQualityRules,
} from "../../data/content/premiumQualityRules";

export default function QualityPage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Product Quality Standard</p>

        <h1 style={titleStyle}>มาตรฐานคุณภาพสินค้าของ Creator OS</h1>

        <p style={subtitleStyle}>
          หน้านี้คือเกณฑ์กลางสำหรับตรวจ Hook, Caption, CTA และ Script
          เพื่อให้ข้อมูลในเว็บไม่ใช่แค่มีจำนวนเยอะ แต่ต้องเป็นของที่ Creator
          เอาไปใช้จริงและยอมจ่ายได้
        </p>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Quality Rules</p>

        <h2 style={{ margin: "6px 0" }}>กฎคุณภาพที่ต้องยึดทุกครั้ง</h2>

        <div style={gridStyle}>
          {premiumQualityRules.map((rule) => (
            <article key={rule.title} style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>{rule.title}</h3>

              <p style={descriptionStyle}>{rule.description}</p>

              <div style={exampleGoodStyle}>
                <p style={exampleLabelStyle}>ตัวอย่างที่ดี</p>
                <p style={exampleTextStyle}>{rule.goodExample}</p>
              </div>

              <div style={exampleBadStyle}>
                <p style={exampleLabelStyle}>ตัวอย่างที่ยังไม่พอขาย</p>
                <p style={exampleTextStyle}>{rule.badExample}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Premium Levels</p>

        <h2 style={{ margin: "6px 0" }}>ระดับสินค้า</h2>

        <div style={levelGridStyle}>
          {premiumLevels.map((item) => (
            <article key={item.level} style={levelCardStyle}>
              <p style={levelBadgeStyle}>{item.label}</p>

              <p style={descriptionStyle}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={darkSectionStyle}>
        <p style={{ color: "#c7d2fe", fontWeight: "bold", marginTop: 0 }}>
          Checklist
        </p>

        <h2 style={{ margin: "6px 0" }}>ก่อนเพิ่มข้อมูลใหม่ ต้องเช็กอะไรบ้าง</h2>

        <div style={checklistGridStyle}>
          {premiumContentChecklist.map((item, index) => (
            <div key={item} style={checkItemStyle}>
              <strong>{index + 1}.</strong> {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "42px 24px",
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
  maxWidth: "820px",
};

const sectionStyle: CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
  gap: "18px",
  marginTop: "18px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  background: "#f8fafc",
};

const descriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.75",
};

const exampleGoodStyle: CSSProperties = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #bbf7d0",
  background: "#f0fdf4",
};

const exampleBadStyle: CSSProperties = {
  marginTop: "12px",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid #fecaca",
  background: "#fff7f7",
};

const exampleLabelStyle: CSSProperties = {
  marginTop: 0,
  fontWeight: "bold",
  color: "#111827",
};

const exampleTextStyle: CSSProperties = {
  marginBottom: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const levelGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "18px",
};

const levelCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
  background: "#f8fafc",
};

const levelBadgeStyle: CSSProperties = {
  display: "inline-block",
  marginTop: 0,
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontWeight: "bold",
};

const darkSectionStyle: CSSProperties = {
  marginTop: "28px",
  padding: "26px",
  borderRadius: "24px",
  background: "#111827",
  color: "white",
};

const checklistGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "12px",
  marginTop: "18px",
};

const checkItemStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "16px",
  background: "#1f2937",
  lineHeight: "1.7",
};