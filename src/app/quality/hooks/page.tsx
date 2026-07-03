import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import CopyButton from "../../../components/dashboard/CopyButton";
import { hookCategoryList } from "../../../data/hooks/hookCategories";
import {
  auditHookQuality,
  getQualityLevelLabel,
  type HookQualityAudit,
  type RawHookItem,
} from "../../../lib/content/auditHookQuality";

type WeakHookItem = HookQualityAudit & {
  categorySlug: string;
  categoryName: string;
  categoryHref: string;
};

type CategoryQualitySummary = {
  slug: string;
  icon: string;
  label: string;
  thaiLabel: string;
  href: string;
  total: number;
  premiumReady: number;
  pro: number;
  free: number;
  needsRewrite: number;
  averageScore: number;
  weakItems: WeakHookItem[];
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

function getAverageScore(items: HookQualityAudit[]) {
  if (items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + item.score, 0);

  return Math.round(total / items.length);
}

function getLevelCount(items: HookQualityAudit[], level: string) {
  return items.filter((item) => item.level === level).length;
}

function createCategorySummaries() {
  const summaries: CategoryQualitySummary[] = hookCategoryList.map(
    (category) => {
      const hooks = loadHookFile(category.slug);

      const auditedItems = hooks.map((item, index) => {
        return auditHookQuality(item, index + 1);
      });

      const thaiLabel = getThaiCategoryLabel(category.slug, category.label);

      const weakItems: WeakHookItem[] = auditedItems
        .filter((item) => item.level === "free" || item.level === "needs-rewrite")
        .slice(0, 12)
        .map((item) => {
          return {
            ...item,
            categorySlug: category.slug,
            categoryName: thaiLabel,
            categoryHref: category.href,
          };
        });

      return {
        slug: category.slug,
        icon: category.icon,
        label: category.label,
        thaiLabel,
        href: category.href,
        total: auditedItems.length,
        premiumReady: getLevelCount(auditedItems, "premium-ready"),
        pro: getLevelCount(auditedItems, "pro"),
        free: getLevelCount(auditedItems, "free"),
        needsRewrite: getLevelCount(auditedItems, "needs-rewrite"),
        averageScore: getAverageScore(auditedItems),
        weakItems,
      };
    }
  );

  return summaries;
}

function getTotal(
  categories: CategoryQualitySummary[],
  key: keyof Pick<
    CategoryQualitySummary,
    "total" | "premiumReady" | "pro" | "free" | "needsRewrite"
  >
) {
  return categories.reduce((sum, category) => sum + category[key], 0);
}

function getLevelLabel(level: string) {
  if (level === "premium-ready") return "พร้อมพรีเมียม";
  if (level === "pro") return "ระดับ Pro";
  if (level === "free") return "ใช้ฟรี";
  if (level === "needs-rewrite") return "ควรเขียนใหม่";

  return getQualityLevelLabel(level as never);
}

function getLevelDescription(level: string) {
  if (level === "premium-ready") return "พร้อมนำไปใช้จริงหรือทำแพ็กขาย";
  if (level === "pro") return "คุณภาพดี ใช้กับงานจริงได้";
  if (level === "free") return "ใช้เป็นตัวอย่างได้ แต่ยังไม่ควรขายเป็นของหลัก";
  if (level === "needs-rewrite") return "ควรปรับถ้อยคำก่อนนำไปใช้จริง";

  return "ยังไม่มีคำอธิบายระดับ";
}

function translateIssue(issue: string) {
  const lowerIssue = issue.toLowerCase();

  if (lowerIssue.includes("short") || lowerIssue.includes("length")) {
    return "ข้อความสั้นหรือบางเกินไป อาจยังไม่ดึงดูดพอ";
  }

  if (lowerIssue.includes("generic") || lowerIssue.includes("basic")) {
    return "ข้อความยังกว้างเกินไป ยังไม่เจาะปัญหาชัด";
  }

  if (lowerIssue.includes("angle")) {
    return "ยังไม่มีมุมนำเสนอที่ชัด เช่น เตือน สงสัย รีวิว หรือขาย";
  }

  if (lowerIssue.includes("metadata") || lowerIssue.includes("tag")) {
    return "ข้อมูลประกอบยังไม่พอ เช่น ประเภท อารมณ์ แพลตฟอร์ม หรือกลุ่มเป้าหมาย";
  }

  if (lowerIssue.includes("direct") || lowerIssue.includes("audience")) {
    return "ยังพูดกับกลุ่มเป้าหมายไม่ชัด";
  }

  return issue;
}

function translateSuggestion(suggestion: string) {
  const lowerSuggestion = suggestion.toLowerCase();

  if (lowerSuggestion.includes("specific")) {
    return "ทำให้ข้อความเฉพาะเจาะจงขึ้น เช่น ระบุปัญหา กลุ่มเป้าหมาย หรือสถานการณ์";
  }

  if (lowerSuggestion.includes("angle")) {
    return "เพิ่มมุมที่ชัด เช่น ความผิดพลาด ความลับ คำเตือน หรือผลลัพธ์ที่คนอยากได้";
  }

  if (lowerSuggestion.includes("audience")) {
    return "ระบุให้ชัดว่าข้อความนี้พูดกับใคร";
  }

  if (lowerSuggestion.includes("platform")) {
    return "เพิ่มบริบทแพลตฟอร์ม เช่น TikTok, Reels, Shorts หรือโพสต์ขาย";
  }

  return suggestion;
}

function getQualityBadgeStyle(score: number): CSSProperties {
  if (score >= 80) {
    return {
      ...qualityBadgeStyle,
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    };
  }

  if (score >= 60) {
    return {
      ...qualityBadgeStyle,
      background: "#eef2ff",
      color: "#4f46e5",
      border: "1px solid #c7d2fe",
    };
  }

  if (score >= 40) {
    return {
      ...qualityBadgeStyle,
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  return {
    ...qualityBadgeStyle,
    background: "#fff7f7",
    color: "#dc2626",
    border: "1px solid #fecaca",
  };
}

function getHealthLabel(score: number) {
  if (score >= 80) return "ดีมาก";
  if (score >= 60) return "ดี";
  if (score >= 40) return "พอใช้";

  return "ควรปรับ";
}

export default function HookQualityPage() {
  const categories = createCategorySummaries();

  const totalHooks = getTotal(categories, "total");
  const premiumReady = getTotal(categories, "premiumReady");
  const pro = getTotal(categories, "pro");
  const free = getTotal(categories, "free");
  const needsRewrite = getTotal(categories, "needsRewrite");

  const weakTotal = free + needsRewrite;
  const sellableTotal = premiumReady + pro;

  const sortedCategories = [...categories].sort(
    (a, b) => b.needsRewrite + b.free - (a.needsRewrite + a.free)
  );

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>ตรวจคุณภาพ Hook</p>

        <h1 style={titleStyle}>
          ตรวจว่า Hook ไหนพร้อมใช้ และ Hook ไหนควรปรับก่อนขายจริง
        </h1>

        <p style={subtitleStyle}>
          หน้านี้ช่วยดูคุณภาพของ Hook ทั้งระบบ แยกออกว่าอันไหนพร้อมใช้เชิงสินค้า
          อันไหนเหมาะใช้ฟรี และอันไหนควรเขียนใหม่ก่อนนำไปใช้จริงหรือใส่ในแพ็กพรีเมียม
        </p>

        <div style={buttonRowStyle}>
          <Link href="/hooks">
            <button style={primaryButtonStyle}>กลับไปคลัง Hook</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดีย</button>
          </Link>

          <Link href="/premium">
            <button style={secondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={summaryNumberStyle}>{totalHooks}</h2>
          <p style={mutedTextStyle}>รวมทุกหมวดในระบบ</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>พร้อมใช้เชิงสินค้า</p>
          <h2 style={summaryNumberStyle}>{sellableTotal}</h2>
          <p style={mutedTextStyle}>พร้อมพรีเมียม + ระดับ Pro</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ใช้ฟรี</p>
          <h2 style={summaryNumberStyle}>{free}</h2>
          <p style={mutedTextStyle}>ใช้เป็นตัวอย่างได้ แต่ยังไม่ควรขายเป็นของหลัก</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ควรเขียนใหม่</p>
          <h2 style={summaryNumberStyle}>{needsRewrite}</h2>
          <p style={mutedTextStyle}>ควรปรับก่อนนำไปใช้จริง</p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>ภาพรวมรายหมวด</p>

            <h2 style={{ margin: "6px 0" }}>
              หมวดไหนควรปรับคุณภาพก่อนขาย
            </h2>
          </div>

          <Link href="/pricing">
            <button style={smallButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>
        </div>

        <div style={categoryGridStyle}>
          {sortedCategories.map((category) => {
            const weak = category.free + category.needsRewrite;
            const sellable = category.premiumReady + category.pro;

            return (
              <article key={category.slug} style={categoryCardStyle}>
                <div style={categoryTopRowStyle}>
                  <div>
                    <p style={categoryIconStyle}>{category.icon}</p>
                    <h3 style={categoryTitleStyle}>{category.thaiLabel}</h3>
                    <p style={englishNameStyle}>{category.label}</p>
                  </div>

                  <span style={getQualityBadgeStyle(category.averageScore)}>
                    {getHealthLabel(category.averageScore)}
                  </span>
                </div>

                <div style={scoreBoxStyle}>
                  <p style={scoreLabelStyle}>คะแนนเฉลี่ย</p>
                  <strong style={scoreNumberStyle}>
                    {category.averageScore}/100
                  </strong>

                  <div style={progressOuterStyle}>
                    <div
                      style={{
                        ...progressInnerStyle,
                        width: category.averageScore + "%",
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
                    <strong>{sellable}</strong>
                    <span>พร้อมใช้</span>
                  </div>

                  <div style={statBoxStyle}>
                    <strong>{category.free}</strong>
                    <span>ใช้ฟรี</span>
                  </div>

                  <div style={statBoxStyle}>
                    <strong>{category.needsRewrite}</strong>
                    <span>เขียนใหม่</span>
                  </div>
                </div>

                <p style={mutedTextStyle}>
                  มี Hook ที่ควรตรวจเพิ่ม {weak} รายการ
                </p>

                <Link href={category.href}>
                  <button style={primaryButtonStyle}>เปิดหมวดนี้</button>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>รายการที่ควรตรวจ</p>

        <h2 style={{ margin: "6px 0" }}>
          ตัวอย่าง Hook ที่ควรปรับก่อนขายหรือใช้จริง
        </h2>

        <p style={mutedTextStyle}>
          ระบบแสดงบางรายการจากแต่ละหมวด เพื่อให้เห็นว่าควรแก้ตรงไหน
          และมีคำแนะนำสำหรับเขียนใหม่ให้คัดลอกได้ทันที
        </p>

        <div style={weakGridStyle}>
          {sortedCategories.map((category) => {
            if (category.weakItems.length === 0) {
              return null;
            }

            return (
              <section key={category.slug} style={weakCategoryBoxStyle}>
                <div style={weakCategoryHeaderStyle}>
                  <div>
                    <p style={labelStyle}>
                      {category.icon} {category.thaiLabel}
                    </p>

                    <h3 style={{ margin: "4px 0" }}>
                      รายการที่ควรปรับในหมวดนี้
                    </h3>
                  </div>

                  <Link href={category.href}>
                    <button style={smallButtonStyle}>เปิดหมวด</button>
                  </Link>
                </div>

                <div style={weakItemListStyle}>
                  {category.weakItems.map((item) => (
                    <article key={item.id} style={weakItemCardStyle}>
                      <div style={topRowStyle}>
                        <span style={getQualityBadgeStyle(item.score)}>
                          {getLevelLabel(item.level)}
                        </span>

                        <span style={scorePillStyle}>คะแนน {item.score}/100</span>
                      </div>

                      <h4 style={hookTextStyle}>{item.text}</h4>

                      <p style={levelDescriptionStyle}>
                        {getLevelDescription(item.level)}
                      </p>

                      {item.issues.length > 0 ? (
                        <div style={noteBoxStyle}>
                          <p style={noteTitleStyle}>จุดที่ควรดู</p>

                          <ul style={listStyle}>
                            {item.issues.map((issue) => (
                              <li key={issue}>{translateIssue(issue)}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {item.suggestions.length > 0 ? (
                        <div style={noteBoxStyle}>
                          <p style={noteTitleStyle}>คำแนะนำ</p>

                          <ul style={listStyle}>
                            {item.suggestions.map((suggestion) => (
                              <li key={suggestion}>
                                {translateSuggestion(suggestion)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div style={rewriteBoxStyle}>
                        <p style={rewriteLabelStyle}>ตัวอย่างเขียนใหม่</p>

                        <p style={rewriteTextStyle}>{item.rewriteText}</p>

                        {item.rewriteReason ? (
                          <p style={rewriteReasonStyle}>{item.rewriteReason}</p>
                        ) : null}
                      </div>

                      <div style={buttonRowStyle}>
                        <CopyButton text={item.text} />

                        <CopyButton text={item.rewriteText} />

                        <Link href={item.categoryHref}>
                          <button style={secondaryButtonStyle}>เปิดต้นทาง</button>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
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

const englishNameStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "bold",
};

const qualityBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const scoreBoxStyle: CSSProperties = {
  marginTop: "16px",
};

const scoreLabelStyle: CSSProperties = {
  margin: 0,
  color: "#555",
  fontSize: "13px",
  fontWeight: "bold",
};

const scoreNumberStyle: CSSProperties = {
  display: "inline-block",
  fontSize: "28px",
  marginTop: "6px",
};

const progressOuterStyle: CSSProperties = {
  height: "10px",
  borderRadius: "999px",
  background: "#e5e7eb",
  overflow: "hidden",
  marginTop: "10px",
};

const progressInnerStyle: CSSProperties = {
  height: "100%",
  borderRadius: "999px",
  background: "#4f46e5",
};

const statGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "8px",
  marginTop: "16px",
  marginBottom: "14px",
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

const weakGridStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
  marginTop: "20px",
};

const weakCategoryBoxStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "20px",
  background: "#f8fafc",
};

const weakCategoryHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

const weakItemListStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "16px",
  marginTop: "16px",
};

const weakItemCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "18px",
  background: "white",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const scorePillStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  fontWeight: "bold",
};

const hookTextStyle: CSSProperties = {
  fontSize: "20px",
  lineHeight: "1.55",
};

const levelDescriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
};

const noteBoxStyle: CSSProperties = {
  marginTop: "12px",
  padding: "12px",
  borderRadius: "14px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const noteTitleStyle: CSSProperties = {
  margin: "0 0 8px",
  fontWeight: "bold",
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: "20px",
  color: "#374151",
  lineHeight: "1.75",
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

const rewriteReasonStyle: CSSProperties = {
  margin: "8px 0 0",
  color: "#6b7280",
  lineHeight: "1.6",
  fontSize: "14px",
};