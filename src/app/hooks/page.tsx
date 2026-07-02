import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { hookCategoryList } from "../../data/hooks/hookCategories";
import {
  auditHookQuality,
  type HookQualityAudit,
  type HookQualityLevel,
  type RawHookItem,
} from "../../lib/content/auditHookQuality";

type HookCategorySummary = {
  slug: string;
  icon: string;
  label: string;
  title: string;
  description: string;
  href: string;
  total: number;
  premiumReady: number;
  pro: number;
  free: number;
  needsRewrite: number;
  healthScore: number;
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

function calculateHealthScore(items: HookQualityAudit[]) {
  if (items.length === 0) return 0;

  const totalScore = items.reduce((sum, item) => sum + item.score, 0);

  return Math.round(totalScore / items.length);
}

function createCategorySummaries() {
  const summaries: HookCategorySummary[] = hookCategoryList.map((category) => {
    const hooks = loadHookFile(category.slug);

    const auditedItems = hooks.map((item, index) => {
      return auditHookQuality(item, index + 1);
    });

    return {
      slug: category.slug,
      icon: category.icon,
      label: category.label,
      title: category.title,
      description: category.description,
      href: category.href,
      total: auditedItems.length,
      premiumReady: countLevel(auditedItems, "premium-ready"),
      pro: countLevel(auditedItems, "pro"),
      free: countLevel(auditedItems, "free"),
      needsRewrite: countLevel(auditedItems, "needs-rewrite"),
      healthScore: calculateHealthScore(auditedItems),
    };
  });

  return summaries;
}

function getTotalValue(
  categories: HookCategorySummary[],
  key: keyof Pick<
    HookCategorySummary,
    "total" | "premiumReady" | "pro" | "free" | "needsRewrite"
  >
) {
  return categories.reduce((sum, category) => sum + category[key], 0);
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}

function getHealthLabel(score: number) {
  if (score >= 80) return "พร้อมขายดี";
  if (score >= 60) return "ใช้ได้ แต่ยังควรคัด";
  if (score >= 40) return "ต้องปรับหลายส่วน";

  return "ควรยกระดับก่อนขาย";
}

export default function HooksPage() {
  const categories = createCategorySummaries();

  const totalHooks = getTotalValue(categories, "total");
  const totalPremium = getTotalValue(categories, "premiumReady");
  const totalPro = getTotalValue(categories, "pro");
  const totalFree = getTotalValue(categories, "free");
  const totalNeedsRewrite = getTotalValue(categories, "needsRewrite");
  const totalWeak = totalFree + totalNeedsRewrite;

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Hook Library</p>

        <h1 style={titleStyle}>คลัง Hook พร้อมตรวจคุณภาพรายหมวด</h1>

        <p style={subtitleStyle}>
          เลือกหมวด Hook เพื่อคัดลอกไปใช้กับโพสต์ คลิป หรือแคมเปญคอนเทนต์
          พร้อมดูภาพรวมว่าแต่ละหมวดมี Hook ระดับ Premium-ready, Pro, Free
          และ Needs rewrite เท่าไหร่
        </p>

        <div style={buttonRowStyle}>
          <Link href="/search">
            <button style={primaryButtonStyle}>🔍 ค้นหา Hook ทั้งหมด</button>
          </Link>

          <Link href="/quality/hooks">
            <button style={secondaryButtonStyle}>ตรวจคุณภาพ Hook</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={summaryNumberStyle}>{totalHooks}</h2>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Premium-ready</p>
          <h2 style={summaryNumberStyle}>{totalPremium}</h2>
          <p style={mutedTextStyle}>
            {getPercent(totalPremium, totalHooks)}% ของทั้งหมด
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Pro</p>
          <h2 style={summaryNumberStyle}>{totalPro}</h2>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={summaryNumberStyle}>{totalWeak}</h2>
          <p style={mutedTextStyle}>
            {getPercent(totalWeak, totalHooks)}% ของทั้งหมด
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>Categories</p>

            <h2 style={{ margin: "6px 0" }}>หมวด Hook ทั้งหมด</h2>
          </div>

          <Link href="/search">
            <button style={smallButtonStyle}>ค้นหาข้ามหมวด</button>
          </Link>
        </div>

        <div style={categoryGridStyle}>
          {categories.map((category) => {
            const weakTotal = category.free + category.needsRewrite;

            return (
              <article key={category.slug} style={categoryCardStyle}>
                <div style={categoryTopRowStyle}>
                  <div>
                    <p style={categoryIconStyle}>{category.icon}</p>
                    <h3 style={categoryTitleStyle}>{category.label}</h3>
                  </div>

                  <span style={healthBadgeStyle(category.healthScore)}>
                    {category.healthScore}/100
                  </span>
                </div>

                <p style={categoryDescriptionStyle}>{category.description}</p>

                <div style={healthBoxStyle}>
                  <div style={healthTopRowStyle}>
                    <strong>{getHealthLabel(category.healthScore)}</strong>
                    <span>{category.healthScore}%</span>
                  </div>

                  <div style={progressTrackStyle}>
                    <div
                      style={{
                        ...progressFillStyle,
                        width: category.healthScore + "%",
                      }}
                    />
                  </div>
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
                    <strong>{weakTotal}</strong>
                    <span>ควรปรับ</span>
                  </div>
                </div>

                <div style={miniSummaryStyle}>
                  <span>Free: {category.free}</span>
                  <span>Needs rewrite: {category.needsRewrite}</span>
                </div>

                <div style={buttonRowStyle}>
                  <Link href={category.href}>
                    <button style={primaryButtonStyle}>เปิดหมวดนี้</button>
                  </Link>

                  <Link href={"/search"}>
                    <button style={secondaryButtonStyle}>ค้นหา</button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ขั้นต่อไปของสินค้า Premium</h2>

        <p style={{ color: "#d1d5db", lineHeight: "1.8", fontSize: "17px" }}>
          ใช้หน้านี้ดูว่าหมวดไหนพร้อมขาย และหมวดไหนควรปรับก่อน
          จากนั้นค่อยคัด Premium-ready ไปทำแพ็กขายจริง
        </p>

        <Link href="/quality/hooks">
          <button style={darkButtonStyle}>ไปหน้าตรวจคุณภาพ Hook</button>
        </Link>
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

const categoryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "20px",
};

const categoryCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  background: "#f8fafc",
};

const categoryTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "flex-start",
};

const categoryIconStyle: CSSProperties = {
  fontSize: "30px",
  margin: "0 0 8px",
};

const categoryTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "24px",
};

const categoryDescriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  minHeight: "54px",
};

function healthBadgeStyle(score: number): CSSProperties {
  const isGood = score >= 70;
  const isMedium = score >= 45 && score < 70;

  return {
    display: "inline-block",
    padding: "7px 11px",
    borderRadius: "999px",
    background: isGood ? "#f0fdf4" : isMedium ? "#fffbeb" : "#fff7f7",
    color: isGood ? "#166534" : isMedium ? "#92400e" : "#dc2626",
    border: isGood
      ? "1px solid #bbf7d0"
      : isMedium
        ? "1px solid #fde68a"
        : "1px solid #fecaca",
    fontWeight: "bold",
    fontSize: "13px",
  };
}

const healthBoxStyle: CSSProperties = {
  marginTop: "14px",
  padding: "12px",
  borderRadius: "16px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const healthTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  color: "#374151",
  fontSize: "14px",
};

const progressTrackStyle: CSSProperties = {
  height: "10px",
  borderRadius: "999px",
  background: "#e5e7eb",
  marginTop: "10px",
  overflow: "hidden",
};

const progressFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#4f46e5",
};

const statGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "8px",
  marginTop: "14px",
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

const miniSummaryStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "12px",
  color: "#555",
  fontSize: "13px",
  fontWeight: "bold",
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