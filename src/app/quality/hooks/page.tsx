import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { hookCategoryList } from "../../../data/hooks/hookCategories";
import {
  auditHookQuality,
  getQualityLevelLabel,
  type HookQualityAudit,
  type HookQualityLevel,
  type RawHookItem,
} from "../../../lib/content/auditHookQuality";

type CategoryAudit = {
  slug: string;
  label: string;
  title: string;
  href: string;
  total: number;
  premiumReady: number;
  pro: number;
  free: number;
  needsRewrite: number;
  weakItems: HookQualityAudit[];
};

function loadHookFile(slug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hooks",
    slug + ".json"
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const hooks: RawHookItem[] = JSON.parse(fileContent);

  return hooks;
}

function countLevel(items: HookQualityAudit[], level: HookQualityLevel) {
  return items.filter((item) => item.level === level).length;
}

function createCategoryAudits() {
  const results: CategoryAudit[] = [];

  hookCategoryList.forEach((category) => {
    const hooks = loadHookFile(category.slug);

    const auditedItems = hooks.map((item, index) => {
      return auditHookQuality(item, index + 1);
    });

    const weakItems = auditedItems
      .filter((item) => item.level === "needs-rewrite" || item.level === "free")
      .slice(0, 12);

    results.push({
      slug: category.slug,
      label: category.label,
      title: category.title,
      href: category.href,
      total: auditedItems.length,
      premiumReady: countLevel(auditedItems, "premium-ready"),
      pro: countLevel(auditedItems, "pro"),
      free: countLevel(auditedItems, "free"),
      needsRewrite: countLevel(auditedItems, "needs-rewrite"),
      weakItems,
    });
  });

  return results;
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}

function getOverallTotal(categories: CategoryAudit[]) {
  return categories.reduce((sum, category) => sum + category.total, 0);
}

function getOverallPremium(categories: CategoryAudit[]) {
  return categories.reduce((sum, category) => sum + category.premiumReady, 0);
}

function getOverallWeak(categories: CategoryAudit[]) {
  return categories.reduce(
    (sum, category) => sum + category.free + category.needsRewrite,
    0
  );
}

export default function HookQualityPage() {
  const categories = createCategoryAudits();

  const total = getOverallTotal(categories);
  const premiumReady = getOverallPremium(categories);
  const weakTotal = getOverallWeak(categories);

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Hook Quality Audit</p>

        <h1 style={titleStyle}>ตรวจคุณภาพ Hook ก่อนทำเป็นสินค้าขาย</h1>

        <p style={subtitleStyle}>
          หน้านี้อ่าน Hook ทุกหมวดจากไฟล์ JSON แล้วประเมินเบื้องต้นว่าอันไหนพร้อมขาย
          อันไหนควรปรับคำ เพิ่ม tag หรือเขียนใหม่ก่อนนำไปทำแพ็ก Premium
        </p>

        <div style={buttonRowStyle}>
          <Link href="/quality">
            <button style={secondaryButtonStyle}>← กลับไปมาตรฐานคุณภาพ</button>
          </Link>

          <Link href="/hooks">
            <button style={primaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={summaryNumberStyle}>{total}</h2>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>พร้อมขายแบบ Premium</p>
          <h2 style={summaryNumberStyle}>{premiumReady}</h2>
          <p style={mutedTextStyle}>{getPercent(premiumReady, total)}% ของทั้งหมด</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={summaryNumberStyle}>{weakTotal}</h2>
          <p style={mutedTextStyle}>{getPercent(weakTotal, total)}% ของทั้งหมด</p>
        </article>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Category Score</p>

        <h2 style={{ margin: "6px 0" }}>คะแนนภาพรวมรายหมวด</h2>

        <div style={categoryGridStyle}>
          {categories.map((category) => (
            <article key={category.slug} style={categoryCardStyle}>
              <div style={categoryTopRowStyle}>
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>{category.label}</h3>
                  <p style={mutedTextStyle}>{category.title}</p>
                </div>

                <Link href={category.href}>
                  <button style={smallButtonStyle}>เปิดหมวด</button>
                </Link>
              </div>

              <div style={statGridStyle}>
                <div style={statBoxStyle}>
                  <strong>{category.total}</strong>
                  <span>ทั้งหมด</span>
                </div>

                <div style={statBoxStyle}>
                  <strong>{category.premiumReady}</strong>
                  <span>Premium</span>
                </div>

                <div style={statBoxStyle}>
                  <strong>{category.pro}</strong>
                  <span>Pro</span>
                </div>

                <div style={statBoxStyle}>
                  <strong>{category.free + category.needsRewrite}</strong>
                  <span>ควรปรับ</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Items to Improve</p>

        <h2 style={{ margin: "6px 0" }}>รายการที่ควรปรับก่อนทำเป็นของขาย</h2>

        <p style={mutedTextStyle}>
          แสดงสูงสุด 12 รายการต่อหมวด เพื่อให้เริ่มแก้จากจุดที่กระทบคุณภาพสินค้ามากที่สุดก่อน
        </p>

        <div style={weakSectionGridStyle}>
          {categories.map((category) => (
            <article key={category.slug} style={weakCategoryStyle}>
              <h3 style={{ marginTop: 0 }}>{category.label}</h3>

              {category.weakItems.length > 0 ? (
                <div style={weakListStyle}>
                  {category.weakItems.map((item) => (
                    <div key={category.slug + "-" + item.id} style={weakItemStyle}>
                      <div style={weakTopRowStyle}>
                        <span style={levelBadgeStyle(item.level)}>
                          {getQualityLevelLabel(item.level)}
                        </span>

                        <strong>{item.score}/100</strong>
                      </div>

                      <p style={hookTextStyle}>{item.text || "ไม่มีข้อความ"}</p>

                      {item.issues.length > 0 ? (
                        <div style={miniBoxStyle}>
                          <p style={miniTitleStyle}>ปัญหา</p>

                          <ul style={listStyle}>
                            {item.issues.map((issue) => (
                              <li key={issue}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {item.suggestions.length > 0 ? (
                        <div style={miniBoxStyle}>
                          <p style={miniTitleStyle}>ควรปรับ</p>

                          <ul style={listStyle}>
                            {item.suggestions.map((suggestion) => (
                              <li key={suggestion}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={mutedTextStyle}>
                  หมวดนี้ยังไม่พบรายการอ่อนมากจากเกณฑ์เบื้องต้น
                </p>
              )}
            </article>
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
  maxWidth: "860px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "22px",
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

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginTop: "24px",
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
  fontSize: "36px",
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

const categoryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "16px",
  marginTop: "18px",
};

const categoryCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "18px",
  background: "#f8fafc",
};

const categoryTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
};

const smallButtonStyle: CSSProperties = {
  padding: "8px 12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const statGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "8px",
  marginTop: "16px",
};

const statBoxStyle: CSSProperties = {
  padding: "10px",
  borderRadius: "14px",
  background: "white",
  display: "grid",
  gap: "4px",
  fontSize: "13px",
  color: "#555",
};

const weakSectionGridStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
  marginTop: "18px",
};

const weakCategoryStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "18px",
  background: "#f8fafc",
};

const weakListStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
  gap: "14px",
};

const weakItemStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "white",
};

const weakTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "center",
};

function levelBadgeStyle(level: HookQualityLevel): CSSProperties {
  const isBad = level === "needs-rewrite";
  const isFree = level === "free";

  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: isBad ? "#fff7f7" : isFree ? "#fffbeb" : "#eef2ff",
    color: isBad ? "#dc2626" : isFree ? "#92400e" : "#4f46e5",
    fontWeight: "bold",
    fontSize: "13px",
  };
}

const hookTextStyle: CSSProperties = {
  color: "#111827",
  lineHeight: "1.7",
  fontWeight: "bold",
};

const miniBoxStyle: CSSProperties = {
  marginTop: "10px",
  padding: "12px",
  borderRadius: "14px",
  background: "#f8fafc",
};

const miniTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "6px",
  fontWeight: "bold",
  color: "#374151",
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: "18px",
  color: "#555",
  lineHeight: "1.7",
};