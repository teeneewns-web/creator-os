import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { hookCategoryList } from "../../data/hooks/hookCategories";
import {
  auditHookQuality,
  type HookQualityAudit,
  type RawHookItem,
} from "../../lib/content/auditHookQuality";

type HookCategorySummary = {
  slug: string;
  icon: string;
  label: string;
  thaiLabel: string;
  description: string;
  href: string;
  total: number;
  premiumReady: number;
  pro: number;
  free: number;
  needsRewrite: number;
  averageScore: number;
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

function getAverageScore(items: HookQualityAudit[]) {
  if (items.length === 0) return 0;

  const total = items.reduce((sum, item) => sum + item.score, 0);

  return Math.round(total / items.length);
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

function createCategorySummaries() {
  const summaries: HookCategorySummary[] = hookCategoryList.map((category) => {
    const hooks = loadHookFile(category.slug);

    const auditedItems = hooks.map((item, index) => {
      return auditHookQuality(item, index + 1);
    });

    const premiumReady = auditedItems.filter(
      (item) => item.level === "premium-ready"
    ).length;

    const pro = auditedItems.filter((item) => item.level === "pro").length;
    const free = auditedItems.filter((item) => item.level === "free").length;

    const needsRewrite = auditedItems.filter(
      (item) => item.level === "needs-rewrite"
    ).length;

    return {
      slug: category.slug,
      icon: category.icon,
      label: category.label,
      thaiLabel: getThaiCategoryLabel(category.slug, category.label),
      description: getThaiCategoryDescription(category.slug, category.title),
      href: category.href,
      total: auditedItems.length,
      premiumReady,
      pro,
      free,
      needsRewrite,
      averageScore: getAverageScore(auditedItems),
    };
  });

  return summaries;
}

function getTotal(
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
  if (score >= 75) return "คุณภาพดีมาก";
  if (score >= 60) return "ใช้งานได้ดี";
  if (score >= 45) return "พอใช้ ควรคัดก่อนขาย";

  return "ควรปรับคุณภาพ";
}

function getHealthStyle(score: number): CSSProperties {
  if (score >= 75) {
    return {
      ...healthBadgeStyle,
      background: "#ecfdf5",
      color: "#047857",
      border: "1px solid #a7f3d0",
    };
  }

  if (score >= 60) {
    return {
      ...healthBadgeStyle,
      background: "#eef2ff",
      color: "#4f46e5",
      border: "1px solid #c7d2fe",
    };
  }

  if (score >= 45) {
    return {
      ...healthBadgeStyle,
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  return {
    ...healthBadgeStyle,
    background: "#fff7f7",
    color: "#dc2626",
    border: "1px solid #fecaca",
  };
}

export default function HooksPage() {
  const categories = createCategorySummaries();

  const totalHooks = getTotal(categories, "total");
  const premiumReady = getTotal(categories, "premiumReady");
  const pro = getTotal(categories, "pro");
  const free = getTotal(categories, "free");
  const needsRewrite = getTotal(categories, "needsRewrite");

  const sellable = premiumReady + pro;
  const weak = free + needsRewrite;

  const sortedCategories = [...categories].sort(
    (a, b) => b.premiumReady + b.pro - (a.premiumReady + a.pro)
  );

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>คลัง Hook</p>

        <h1 style={titleStyle}>
          รวมประโยคเปิดสำหรับทำคอนเทนต์ แยกหมวดและตรวจคุณภาพให้แล้ว
        </h1>

        <p style={subtitleStyle}>
          หน้านี้คือคลัง Hook หลักของ Creator OS ใช้เลือกหมวดที่ต้องการ
          ดูจำนวนไอเดีย ดูคะแนนคุณภาพ และเปิดเข้าไปคัดลอกหรือบันทึก Hook
          ที่เหมาะกับงานของคุณ
        </p>

        <div style={buttonRowStyle}>
          <Link href="/search">
            <button style={primaryButtonStyle}>ค้นหาไอเดียทั้งหมด</button>
          </Link>

          <Link href="/favorites">
            <button style={secondaryButtonStyle}>ดูไอเดียที่บันทึกไว้</button>
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
          <p style={mutedTextStyle}>รวมทุกหมวดในระบบ</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>พร้อมใช้เชิงสินค้า</p>
          <h2 style={summaryNumberStyle}>{sellable}</h2>
          <p style={mutedTextStyle}>
            ระดับพรีเมียม + ระดับ Pro รวม {getPercent(sellable, totalHooks)}%
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>พร้อมพรีเมียม</p>
          <h2 style={summaryNumberStyle}>{premiumReady}</h2>
          <p style={mutedTextStyle}>เหมาะนำไปใช้ในแพ็กขายก่อน</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={summaryNumberStyle}>{weak}</h2>
          <p style={mutedTextStyle}>แยกไว้เพื่อไม่ให้ของอ่อนปนกับของดี</p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>หมวดทั้งหมด</p>

            <h2 style={{ margin: "6px 0" }}>
              เลือกหมวด Hook ที่ต้องการใช้งาน
            </h2>
          </div>

          <Link href="/search">
            <button style={smallButtonStyle}>ค้นหาข้ามทุกหมวด</button>
          </Link>
        </div>

        <div style={categoryGridStyle}>
          {sortedCategories.map((category) => {
            const categorySellable = category.premiumReady + category.pro;
            const categoryWeak = category.free + category.needsRewrite;

            return (
              <article key={category.slug} style={categoryCardStyle}>
                <div style={categoryTopRowStyle}>
                  <div>
                    <p style={categoryIconStyle}>{category.icon}</p>
                    <h3 style={categoryTitleStyle}>{category.thaiLabel}</h3>
                    <p style={englishNameStyle}>{category.label}</p>
                  </div>

                  <span style={getHealthStyle(category.averageScore)}>
                    {getHealthLabel(category.averageScore)}
                  </span>
                </div>

                <p style={descriptionStyle}>{category.description}</p>

                <div style={scoreRowStyle}>
                  <div>
                    <p style={scoreLabelStyle}>คะแนนเฉลี่ย</p>
                    <strong style={scoreNumberStyle}>
                      {category.averageScore}/100
                    </strong>
                  </div>

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
                    <strong>{category.premiumReady}</strong>
                    <span>พรีเมียม</span>
                  </div>

                  <div style={statBoxStyle}>
                    <strong>{category.pro}</strong>
                    <span>Pro</span>
                  </div>

                  <div style={statBoxStyle}>
                    <strong>{categoryWeak}</strong>
                    <span>ควรปรับ</span>
                  </div>
                </div>

                <p style={mutedTextStyle}>
                  พร้อมใช้เชิงสินค้า {categorySellable} รายการ จากทั้งหมด{" "}
                  {category.total} รายการ
                </p>

                <div style={buttonRowStyle}>
                  <Link href={category.href}>
                    <button style={primaryButtonStyle}>เปิดหมวดนี้</button>
                  </Link>

                  <Link href="/search">
                    <button style={secondaryButtonStyle}>ค้นหาเพิ่ม</button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ไม่รู้จะเริ่มจากหมวดไหน?</h2>

        <p style={bottomTextStyle}>
          เริ่มจากการค้นหาด้วยคำที่เกี่ยวกับงานของคุณ เช่น ขายของ, มือใหม่,
          TikTok, ร้านอาหาร, การเงิน หรือ AI แล้วค่อยบันทึกไอเดียที่ชอบไว้ใช้ต่อ
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/search">
            <button style={darkButtonStyle}>ไปหน้าค้นหาไอเดีย</button>
          </Link>

          <Link href="/favorites">
            <button style={darkSecondaryButtonStyle}>ดูไอเดียที่บันทึกไว้</button>
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
  gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
  gap: "18px",
  marginTop: "20px",
};

const categoryCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
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
  fontSize: "32px",
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

const descriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.75",
  marginTop: "14px",
};

const healthBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "13px",
  whiteSpace: "nowrap",
};

const scoreRowStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  marginTop: "16px",
};

const scoreLabelStyle: CSSProperties = {
  margin: 0,
  color: "#555",
  fontSize: "13px",
  fontWeight: "bold",
};

const scoreNumberStyle: CSSProperties = {
  fontSize: "24px",
};

const progressOuterStyle: CSSProperties = {
  height: "10px",
  borderRadius: "999px",
  background: "#e5e7eb",
  overflow: "hidden",
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
  maxWidth: "780px",
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