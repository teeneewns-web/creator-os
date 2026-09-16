
"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../dashboard/CopyButton";
import FavoriteButton from "../favorites/FavoriteButton";

export type HookQualityLevel =
  | "premium-ready"
  | "pro"
  | "free"
  | "needs-rewrite";

type LevelFilter = "all" | HookQualityLevel;

export type HookCategoryData = {
  slug: string;
  icon: string;
  label: string;
  title: string;
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

function getThaiCategoryLabel(slug: string, fallback: string) {
  const labels: Record<string, string> = {
    beauty: "ความงาม",
    finance: "การเงิน",
    gaming: "เกม",
    ai: "AI / ปัญญาประดิษฐ์",
    food: "อาหาร",
    travel: "ท่องเที่ยว",
    fitness: "ฟิตเนส",
    business: "ธุรกิจ",
    education: "การเรียนรู้",
    health: "สุขภาพ",
    lifestyle: "ไลฟ์สไตล์",
    marketing: "การตลาด",
    realestate: "อสังหา",
    real_estate: "อสังหา",
    ecommerce: "ขายของออนไลน์",
    career: "อาชีพ",
    productivity: "การทำงาน",
    relationship: "ความสัมพันธ์",
    parenting: "ครอบครัว",
    tech: "เทคโนโลยี",
  };

  return labels[slug] || fallback;
}

function getThaiCategoryDescription(slug: string, fallback: string) {
  const descriptions: Record<string, string> = {
    beauty: "Hook สำหรับคอนเทนต์ความงาม สกินแคร์ แต่งหน้า และการดูแลตัวเอง",
    finance: "Hook สำหรับคอนเทนต์การเงิน การลงทุน การออม และความรู้เรื่องเงิน",
    gaming: "Hook สำหรับคอนเทนต์เกม รีวิวเกม เทคนิคเกม และคอมมูนิตี้เกมเมอร์",
    ai: "Hook สำหรับคอนเทนต์ AI เครื่องมือใหม่ และการใช้ AI ช่วยทำงาน",
    food: "Hook สำหรับคอนเทนต์อาหาร ร้านอาหาร สูตรอาหาร และรีวิวของกิน",
    travel: "Hook สำหรับคอนเทนต์ท่องเที่ยว ที่พัก เส้นทาง และประสบการณ์เดินทาง",
    fitness: "Hook สำหรับคอนเทนต์ออกกำลังกาย ลดน้ำหนัก สุขภาพ และวินัย",
    business: "Hook สำหรับคอนเทนต์ธุรกิจ การขาย การเริ่มต้นกิจการ และเจ้าของร้าน",
    education: "Hook สำหรับคอนเทนต์ความรู้ การเรียน ทักษะ และการพัฒนาตัวเอง",
    health: "Hook สำหรับคอนเทนต์สุขภาพ การดูแลตัวเอง และพฤติกรรมที่ดีขึ้น",
    lifestyle: "Hook สำหรับคอนเทนต์ชีวิตประจำวัน แนวคิด และแรงบันดาลใจ",
    marketing: "Hook สำหรับคอนเทนต์การตลาด การขายออนไลน์ และการสร้างแบรนด์",
    realestate: "Hook สำหรับคอนเทนต์อสังหา บ้าน คอนโด ที่ดิน และนายหน้า",
    real_estate: "Hook สำหรับคอนเทนต์อสังหา บ้าน คอนโด ที่ดิน และนายหน้า",
    ecommerce: "Hook สำหรับคอนเทนต์ขายของออนไลน์ ร้านค้า และสินค้า",
    career: "Hook สำหรับคอนเทนต์งาน อาชีพ ฟรีแลนซ์ และการเติบโตในสายงาน",
    productivity: "Hook สำหรับคอนเทนต์การทำงาน วางแผน เวลา และระบบชีวิต",
    relationship: "Hook สำหรับคอนเทนต์ความสัมพันธ์ ความรัก และการเข้าใจคน",
    parenting: "Hook สำหรับคอนเทนต์ครอบครัว ลูก และการเลี้ยงดู",
    tech: "Hook สำหรับคอนเทนต์เทคโนโลยี แอป เครื่องมือ และดิจิทัล",
  };

  return descriptions[slug] || fallback;
}

function getLevelLabel(level: LevelFilter) {
  if (level === "all") return "ทั้งหมด";
  if (level === "premium-ready") return "พร้อมพรีเมียม";
  if (level === "pro") return "ระดับ Pro";
  if (level === "free") return "ใช้ฟรี";
  if (level === "needs-rewrite") return "ควรเขียนใหม่";

  return level;
}

function getLevelDescription(level: HookQualityLevel) {
  if (level === "premium-ready") {
    return "เหมาะนำไปใช้จริงหรือทำแพ็กขาย";
  }

  if (level === "pro") {
    return "คุณภาพดี เหมาะกับงานจริง";
  }

  if (level === "free") {
    return "เหมาะใช้เป็นตัวอย่างหรือไอเดียตั้งต้น";
  }

  return "ควรปรับถ้อยคำก่อนนำไปใช้จริง";
}

function getAverageScore(hooks: HookDisplayItem[]) {
  if (hooks.length === 0) return 0;

  const total = hooks.reduce((sum, item) => sum + item.score, 0);

  return Math.round(total / hooks.length);
}

function getLevelCount(hooks: HookDisplayItem[], level: HookQualityLevel) {
  return hooks.filter((item) => item.level === level).length;
}

function getLevelBadgeStyle(level: HookQualityLevel): CSSProperties {
  if (level === "premium-ready") {
    return {
      ...levelBadgeStyle,
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    };
  }

  if (level === "pro") {
    return {
      ...levelBadgeStyle,
      background: "#eef2ff",
      color: "#4f46e5",
      border: "1px solid #c7d2fe",
    };
  }

  if (level === "free") {
    return {
      ...levelBadgeStyle,
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  return {
    ...levelBadgeStyle,
    background: "#fff7f7",
    color: "#dc2626",
    border: "1px solid #fecaca",
  };
}

export default function HookCategoryClient({
  categoryData,
  hooks,
}: HookCategoryClientProps) {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  const thaiLabel = getThaiCategoryLabel(categoryData.slug, categoryData.label);
  const thaiDescription = getThaiCategoryDescription(
    categoryData.slug,
    categoryData.title
  );

  const premiumReady = getLevelCount(hooks, "premium-ready");
  const pro = getLevelCount(hooks, "pro");
  const free = getLevelCount(hooks, "free");
  const needsRewrite = getLevelCount(hooks, "needs-rewrite");
  const averageScore = getAverageScore(hooks);

  const filteredHooks = useMemo(() => {
    if (levelFilter === "all") return hooks;

    return hooks.filter((item) => item.level === levelFilter);
  }, [hooks, levelFilter]);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>คลัง Hook รายหมวด</p>

        <h1 style={titleStyle}>
          {categoryData.icon} {thaiLabel}
        </h1>

        <p style={subtitleStyle}>{thaiDescription}</p>

        <div style={buttonRowStyle}>
          <Link href="/hooks">
            <button style={secondaryButtonStyle}>กลับไปหน้าคลัง Hook</button>
          </Link>

          <Link href="/search">
            <button style={primaryButtonStyle}>ค้นหาข้ามทุกหมวด</button>
          </Link>

          <Link href="/favorites">
            <button style={secondaryButtonStyle}>ดูไอเดียที่บันทึกไว้</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={summaryNumberStyle}>{hooks.length}</h2>
          <p style={mutedTextStyle}>ในหมวด {thaiLabel}</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>คะแนนเฉลี่ย</p>
          <h2 style={summaryNumberStyle}>{averageScore}/100</h2>
          <p style={mutedTextStyle}>ใช้ดูภาพรวมคุณภาพของหมวดนี้</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>พร้อมใช้เชิงสินค้า</p>
          <h2 style={summaryNumberStyle}>{premiumReady + pro}</h2>
          <p style={mutedTextStyle}>พร้อมพรีเมียม + ระดับ Pro</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={summaryNumberStyle}>{free + needsRewrite}</h2>
          <p style={mutedTextStyle}>ใช้ฟรี + ควรเขียนใหม่</p>
        </article>
      </section>

      <section style={filterBoxStyle}>
        <p style={filterTitleStyle}>กรองตามระดับคุณภาพ</p>

        <div style={buttonRowStyle}>
          <button
            type="button"
            onClick={() => setLevelFilter("all")}
            style={
              levelFilter === "all" ? activeFilterButtonStyle : filterButtonStyle
            }
          >
            ทั้งหมด ({hooks.length})
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("premium-ready")}
            style={
              levelFilter === "premium-ready"
                ? activeFilterButtonStyle
                : filterButtonStyle
            }
          >
            พร้อมพรีเมียม ({premiumReady})
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("pro")}
            style={
              levelFilter === "pro" ? activeFilterButtonStyle : filterButtonStyle
            }
          >
            ระดับ Pro ({pro})
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("free")}
            style={
              levelFilter === "free" ? activeFilterButtonStyle : filterButtonStyle
            }
          >
            ใช้ฟรี ({free})
          </button>

          <button
            type="button"
            onClick={() => setLevelFilter("needs-rewrite")}
            style={
              levelFilter === "needs-rewrite"
                ? activeFilterButtonStyle
                : filterButtonStyle
            }
          >
            ควรเขียนใหม่ ({needsRewrite})
          </button>
        </div>

        <p style={resultCountStyle}>
          กำลังแสดง <strong>{filteredHooks.length}</strong> จากทั้งหมด{" "}
          <strong>{hooks.length}</strong> รายการ
        </p>
      </section>

      {filteredHooks.length > 0 ? (
        <section style={gridStyle}>
          {filteredHooks.map((item, index) => (
            <article key={item.id + "-" + levelFilter} style={cardStyle}>
              <div style={topRowStyle}>
                <span style={numberStyle}>รายการที่ {index + 1}</span>

                <span style={getLevelBadgeStyle(item.level)}>
                  {getLevelLabel(item.level)}
                </span>
              </div>

              <h2 style={hookTextStyle}>{item.text}</h2>

              <p style={descriptionTextStyle}>
                {getLevelDescription(item.level)}
              </p>

              <div style={tagRowStyle}>
                <span style={tagStyle}>คะแนน {item.score}/100</span>

                {item.type ? <span style={tagStyle}>ประเภท: {item.type}</span> : null}

                {item.emotion ? (
                  <span style={tagStyle}>อารมณ์: {item.emotion}</span>
                ) : null}

                {item.platform ? (
                  <span style={tagStyle}>แพลตฟอร์ม: {item.platform}</span>
                ) : null}

                {item.language ? (
                  <span style={tagStyle}>ภาษา: {item.language}</span>
                ) : null}
              </div>

              {item.level === "free" || item.level === "needs-rewrite" ? (
                <div style={rewriteBoxStyle}>
                  <p style={rewriteLabelStyle}>คำแนะนำสำหรับเขียนใหม่</p>
                  <p style={rewriteTextStyle}>{item.rewriteText}</p>
                </div>
              ) : null}

              <div style={buttonRowStyle}>
                <CopyButton text={item.text} />

                <FavoriteButton
                  item={{
                    id: "hook-" + categoryData.slug + "-" + item.id,
                    text: item.text,
                    source: "hooks",
                    category: thaiLabel,
                    href: categoryData.href,
                    level: item.level,
                    score: item.score,
                  }}
                />

                {item.level === "free" || item.level === "needs-rewrite" ? (
                  <CopyButton text={item.rewriteText} />
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ไม่พบ Hook ในระดับที่เลือก</h2>

          <p style={{ color: "#555", lineHeight: "1.7" }}>
            ลองเลือก “ทั้งหมด” หรือเปลี่ยนระดับคุณภาพอื่น
          </p>

          <button
            type="button"
            onClick={() => setLevelFilter("all")}
            style={primaryButtonStyle}
          >
            แสดงทั้งหมด
          </button>
        </section>
      )}
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "42px 24px",
  borderRadius: "24px",
  background: "#111827",
  color: "white",
};

const labelStyle: CSSProperties = {
  color: "#a5b4fc",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "44px",
  lineHeight: "1.15",
  margin: "12px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "820px",
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
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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

const summaryNumberStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "38px",
};

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
};

const filterBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const filterTitleStyle: CSSProperties = {
  marginTop: 0,
  fontWeight: "bold",
};

const filterButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#374151",
};

const activeFilterButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #4f46e5",
  background: "#eef2ff",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#4f46e5",
};

const resultCountStyle: CSSProperties = {
  marginBottom: 0,
  color: "#555",
  lineHeight: "1.7",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
  gap: "18px",
  marginTop: "22px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  background: "white",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const numberStyle: CSSProperties = {
  color: "#777",
  fontWeight: "bold",
  fontSize: "14px",
};

const levelBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "13px",
};

const hookTextStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: "1.55",
};

const descriptionTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
};

const tagRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const tagStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  fontWeight: "bold",
};

const rewriteBoxStyle: CSSProperties = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "16px",
  background: "#fffbeb",
  border: "1px solid #fde68a",
};

const rewriteLabelStyle: CSSProperties = {
  margin: "0 0 8px",
  fontWeight: "bold",
  color: "#92400e",
};

const rewriteTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  background: "white",
  textAlign: "center",
};