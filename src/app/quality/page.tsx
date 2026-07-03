import type { CSSProperties } from "react";
import Link from "next/link";
import {
  premiumContentChecklist,
  premiumLevels,
  premiumQualityRules,
} from "../../data/content/premiumQualityRules";

function getLevelThaiName(level: string, label: string) {
  const cleanLevel = level.toLowerCase();
  const cleanLabel = label.toLowerCase();

  if (cleanLevel === "free" || cleanLabel === "free") return "ใช้ฟรี";
  if (cleanLevel === "pro" || cleanLabel === "pro") return "ระดับ Pro";
  if (cleanLevel === "premium" || cleanLabel === "premium") return "พรีเมียม";

  return label;
}

function getLevelBadgeText(level: string, label: string) {
  const cleanLevel = level.toLowerCase();
  const cleanLabel = label.toLowerCase();

  if (cleanLevel === "free" || cleanLabel === "free") {
    return "เหมาะสำหรับให้ทดลอง";
  }

  if (cleanLevel === "pro" || cleanLabel === "pro") {
    return "เหมาะสำหรับผู้ใช้งานจริง";
  }

  if (cleanLevel === "premium" || cleanLabel === "premium") {
    return "เหมาะสำหรับแพ็กขาย";
  }

  return "ระดับเนื้อหา";
}

function getLevelCardStyle(level: string): CSSProperties {
  const cleanLevel = level.toLowerCase();

  if (cleanLevel === "premium") {
    return {
      ...levelCardStyle,
      border: "2px solid #4f46e5",
      background: "#eef2ff",
    };
  }

  return levelCardStyle;
}

export default function QualityPage() {
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>มาตรฐานคุณภาพ</p>

        <h1 style={titleStyle}>
          เกณฑ์คัดเนื้อหาว่าอะไรควรใช้ฟรี อะไรควรขายเป็นพรีเมียม
        </h1>

        <p style={subtitleStyle}>
          หน้านี้คือมาตรฐานกลางของ Creator OS ใช้บอกว่า Hook, แคปชัน, CTA
          หรือสคริปต์แบบไหนที่ควรปล่อยให้ใช้ฟรี แบบไหนควรอยู่ในระดับ Pro
          และแบบไหนควรเก็บไว้ในแพ็กพรีเมียม
        </p>

        <div style={buttonRowStyle}>
          <Link href="/quality/hooks">
            <button style={primaryButtonStyle}>ตรวจคุณภาพ Hook</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>เป้าหมายหลัก</p>
          <h2 style={summaryTitleStyle}>ขายได้จริง</h2>
          <p style={mutedTextStyle}>
            เนื้อหาต้องช่วยให้ผู้ใช้ประหยัดเวลา และนำไปใช้กับงานจริงได้
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ต้องแยกคุณภาพ</p>
          <h2 style={summaryTitleStyle}>Free / Pro / Premium</h2>
          <p style={mutedTextStyle}>
            ของใช้ฟรีต้องไม่ปนกับของที่ควรขาย เพื่อให้แพ็กพรีเมียมมีคุณค่าชัด
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ต้องตรวจซ้ำได้</p>
          <h2 style={summaryTitleStyle}>มีเกณฑ์ชัดเจน</h2>
          <p style={mutedTextStyle}>
            ทีมงานหรือเจ้าของเว็บต้องใช้เกณฑ์เดียวกันในการคัดเนื้อหา
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>ระดับเนื้อหา</p>

            <h2 style={{ margin: "6px 0" }}>
              แบ่งเนื้อหาออกเป็น 3 ระดับ
            </h2>
          </div>

          <Link href="/premium">
            <button style={smallButtonStyle}>ดูหน้าแพ็กพรีเมียม</button>
          </Link>
        </div>

        <div style={levelGridStyle}>
          {premiumLevels.map((level) => (
            <article key={level.level} style={getLevelCardStyle(level.level)}>
              <span style={levelBadgeStyle}>
                {getLevelBadgeText(level.level, level.label)}
              </span>

              <h3 style={levelTitleStyle}>
                {getLevelThaiName(level.level, level.label)}
              </h3>

              <p style={levelSubLabelStyle}>{level.label}</p>

              <p style={levelDescriptionStyle}>{level.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>กฎคัดคุณภาพ</p>

        <h2 style={{ margin: "6px 0" }}>
          เนื้อหาที่ดีควรผ่านกฎเหล่านี้
        </h2>

        <p style={mutedTextStyle}>
          กฎเหล่านี้ใช้ตัดสินว่าเนื้อหาควรอยู่ระดับไหน
          และช่วยป้องกันไม่ให้เว็บเต็มไปด้วยข้อความกว้าง ๆ ที่เหมือน AI เขียนทั่วไป
        </p>

        <div style={ruleGridStyle}>
          {premiumQualityRules.map((rule, index) => (
            <article key={rule.title} style={ruleCardStyle}>
              <p style={ruleNumberStyle}>ข้อที่ {index + 1}</p>

              <h3 style={ruleTitleStyle}>{rule.title}</h3>

              <p style={ruleDescriptionStyle}>{rule.description}</p>

              <div style={exampleGridStyle}>
                <div style={goodExampleStyle}>
                  <p style={exampleLabelStyle}>ตัวอย่างที่ดี</p>
                  <p style={exampleTextStyle}>{rule.goodExample}</p>
                </div>

                <div style={badExampleStyle}>
                  <p style={exampleLabelStyle}>ตัวอย่างที่ควรเลี่ยง</p>
                  <p style={exampleTextStyle}>{rule.badExample}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>เช็กลิสต์ก่อนนำไปใช้จริง</p>

            <h2 style={{ margin: "6px 0" }}>
              ก่อนใส่เนื้อหาในระบบ ควรตอบคำถามเหล่านี้
            </h2>
          </div>

          <Link href="/quality/hooks">
            <button style={smallButtonStyle}>ตรวจ Hook ทั้งระบบ</button>
          </Link>
        </div>

        <div style={checklistGridStyle}>
          {premiumContentChecklist.map((item, index) => (
            <article key={item} style={checklistItemStyle}>
              <span style={checkNumberStyle}>{index + 1}</span>
              <p style={checkTextStyle}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ใช้หน้านี้เป็นมาตรฐานก่อนขายจริง</h2>

        <p style={bottomTextStyle}>
          ก่อนทำระบบสมาชิกหรือเก็บเงิน ควรคัดเนื้อหาให้ชัดก่อนว่าอะไรใช้ฟรี
          อะไรเป็น Pro และอะไรเป็นพรีเมียม เพื่อให้ผู้ใช้รู้สึกว่าการจ่ายเงินคุ้มค่า
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/quality/hooks">
            <button style={darkButtonStyle}>ตรวจคุณภาพ Hook</button>
          </Link>

          <Link href="/pricing">
            <button style={darkSecondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "46px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "46px",
  lineHeight: "1.12",
  margin: "12px 0",
  maxWidth: "980px",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "880px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const buttonRowCenterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
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
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const summaryCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  background: "white",
};

const summaryLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const summaryTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "28px",
};

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
};

const sectionStyle: CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const sectionTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const smallButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const levelGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const levelCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const levelBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontSize: "13px",
  fontWeight: "bold",
};

const levelTitleStyle: CSSProperties = {
  margin: "14px 0 4px",
  fontSize: "28px",
};

const levelSubLabelStyle: CSSProperties = {
  margin: 0,
  color: "#6b7280",
  fontWeight: "bold",
};

const levelDescriptionStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
};

const ruleGridStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  marginTop: "20px",
};

const ruleCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "22px",
  background: "#f8fafc",
};

const ruleNumberStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const ruleTitleStyle: CSSProperties = {
  fontSize: "24px",
  margin: "8px 0",
};

const ruleDescriptionStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
};

const exampleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "12px",
  marginTop: "14px",
};

const goodExampleStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "16px",
  background: "#ecfdf5",
  border: "1px solid #a7f3d0",
};

const badExampleStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "16px",
  background: "#fff7f7",
  border: "1px solid #fecaca",
};

const exampleLabelStyle: CSSProperties = {
  margin: "0 0 8px",
  fontWeight: "bold",
};

const exampleTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const checklistGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "14px",
  marginTop: "20px",
};

const checklistItemStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  padding: "16px",
  borderRadius: "18px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const checkNumberStyle: CSSProperties = {
  width: "30px",
  height: "30px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  flexShrink: 0,
};

const checkTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const bottomTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "820px",
  margin: "0 auto",
};

const darkButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const darkSecondaryButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};