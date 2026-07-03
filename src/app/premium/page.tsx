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

type PremiumCategorySummary = {
  slug: string;
  icon: string;
  label: string;
  title: string;
  href: string;
  total: number;
  premiumReady: number;
  pro: number;
  weak: number;
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

function createPremiumSummaries() {
  const summaries: PremiumCategorySummary[] = hookCategoryList.map((category) => {
    const hooks = loadHookFile(category.slug);

    const auditedItems = hooks.map((item, index) => {
      return auditHookQuality(item, index + 1);
    });

    const premiumReady = auditedItems.filter(
      (item) => item.level === "premium-ready"
    ).length;

    const pro = auditedItems.filter((item) => item.level === "pro").length;

    const weak = auditedItems.filter(
      (item) => item.level === "free" || item.level === "needs-rewrite"
    ).length;

    return {
      slug: category.slug,
      icon: category.icon,
      label: category.label,
      title: category.title,
      href: category.href,
      total: auditedItems.length,
      premiumReady,
      pro,
      weak,
      averageScore: getAverageScore(auditedItems),
    };
  });

  return summaries;
}

function getTotal(
  categories: PremiumCategorySummary[],
  key: keyof Pick<
    PremiumCategorySummary,
    "total" | "premiumReady" | "pro" | "weak"
  >
) {
  return categories.reduce((sum, category) => sum + category[key], 0);
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}

export default function PremiumPage() {
  const categories = createPremiumSummaries();

  const totalHooks = getTotal(categories, "total");
  const premiumReady = getTotal(categories, "premiumReady");
  const pro = getTotal(categories, "pro");
  const weak = getTotal(categories, "weak");

  const sellableTotal = premiumReady + pro;

  const topCategories = [...categories]
    .sort((a, b) => b.premiumReady + b.pro - (a.premiumReady + a.pro))
    .slice(0, 6);

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Premium Creator OS</p>

        <h1 style={titleStyle}>
          แพ็ก Premium สำหรับ Creator ที่อยากได้ไอเดียพร้อมใช้ ไม่เสียเวลาคิดเอง
        </h1>

        <p style={subtitleStyle}>
          Creator OS ไม่ได้เป็นแค่คลังข้อความ แต่มีระบบคัดคุณภาพ แยก Hook
          ที่พร้อมใช้จริง ออกจาก Hook ที่ควรปรับก่อนขาย เพื่อให้ผู้ใช้ประหยัดเวลา
          และเลือกข้อความที่มีโอกาสใช้งานได้จริงมากขึ้น
        </p>

        <div style={buttonRowStyle}>
          <Link href="/pricing">
            <button style={primaryButtonStyle}>ดูแพ็กเกจราคา</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>ดูคลัง Hook</button>
          </Link>

          <Link href="/quality/hooks">
            <button style={secondaryButtonStyle}>ดูระบบตรวจคุณภาพ</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Hook ทั้งหมดในระบบ</p>
          <h2 style={summaryNumberStyle}>{totalHooks}</h2>
          <p style={mutedTextStyle}>รวมทุกหมวดที่มีข้อมูลในคลัง</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>พร้อมใช้เชิงสินค้า</p>
          <h2 style={summaryNumberStyle}>{sellableTotal}</h2>
          <p style={mutedTextStyle}>
            Premium-ready + Pro รวม {getPercent(sellableTotal, totalHooks)}%
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>Premium-ready</p>
          <h2 style={summaryNumberStyle}>{premiumReady}</h2>
          <p style={mutedTextStyle}>
            คัดจาก Hook ที่คะแนนสูงสุดและพร้อมขายมากที่สุด
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={summaryNumberStyle}>{weak}</h2>
          <p style={mutedTextStyle}>
            ระบบแยกไว้เพื่อไม่ให้เอาของอ่อนมาขายปนกับของดี
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>Why Premium?</p>

            <h2 style={{ margin: "6px 0" }}>ทำไมคนถึงควรจ่ายเงินให้แพ็กนี้</h2>
          </div>

          <Link href="/pricing">
            <button style={smallButtonStyle}>ไปหน้าราคา</button>
          </Link>
        </div>

        <div style={valueGridStyle}>
          <article style={valueCardStyle}>
            <h3 style={valueTitleStyle}>ประหยัดเวลาคิด Hook</h3>
            <p style={valueTextStyle}>
              ผู้ใช้ไม่ต้องเริ่มจากหน้าว่าง แต่เลือกจาก Hook ที่จัดหมวดและตรวจคุณภาพแล้ว
              ทำให้เริ่มเขียนโพสต์หรือคลิปได้เร็วขึ้น
            </p>
          </article>

          <article style={valueCardStyle}>
            <h3 style={valueTitleStyle}>แยกของดีออกจากของทั่วไป</h3>
            <p style={valueTextStyle}>
              ระบบแบ่งระดับ Premium-ready, Pro, Free และ Needs rewrite
              ทำให้ผู้ใช้รู้ว่าอันไหนควรใช้จริง อันไหนควรปรับก่อน
            </p>
          </article>

          <article style={valueCardStyle}>
            <h3 style={valueTitleStyle}>เหมาะกับ Creator หลายสาย</h3>
            <p style={valueTextStyle}>
              หมวดต่าง ๆ รองรับ Beauty, Finance, Gaming, AI, Food, Travel,
              Fitness และต่อยอดเพิ่มหมวดใหม่ได้เรื่อย ๆ
            </p>
          </article>

          <article style={valueCardStyle}>
            <h3 style={valueTitleStyle}>ต่อยอดเป็นระบบทำงานรายวัน</h3>
            <p style={valueTextStyle}>
              Hook สามารถนำไปใช้ต่อกับ Dashboard, Caption, CTA และ Script
              เพื่อสร้าง workflow สำหรับทำคอนเทนต์จริง
            </p>
          </article>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Premium Candidates</p>

        <h2 style={{ margin: "6px 0" }}>หมวดที่เหมาะนำไปทำแพ็กขายก่อน</h2>

        <p style={mutedTextStyle}>
          ระบบเรียงจากจำนวน Hook ระดับ Premium-ready และ Pro เพื่อดูว่าหมวดไหนพร้อมขายมากที่สุด
        </p>

        <div style={categoryGridStyle}>
          {topCategories.map((category) => {
            const sellable = category.premiumReady + category.pro;

            return (
              <article key={category.slug} style={categoryCardStyle}>
                <div style={categoryTopRowStyle}>
                  <div>
                    <p style={categoryIconStyle}>{category.icon}</p>
                    <h3 style={categoryTitleStyle}>{category.label}</h3>
                  </div>

                  <span style={scoreBadgeStyle}>{category.averageScore}/100</span>
                </div>

                <p style={mutedTextStyle}>{category.title}</p>

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
                    <strong>{sellable}</strong>
                    <span>พร้อมใช้</span>
                  </div>
                </div>

                <div style={buttonRowStyle}>
                  <Link href={category.href}>
                    <button style={primaryButtonStyle}>เปิดหมวดนี้</button>
                  </Link>

                  <Link href="/search">
                    <button style={secondaryButtonStyle}>ค้นหา</button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={pricingTeaserStyle}>
        <div>
          <p style={darkLabelStyle}>Suggested Offer</p>

          <h2 style={{ margin: "8px 0", fontSize: "32px" }}>
            เริ่มขายแบบง่าย: Free Preview + Pro Pack + Premium Pack
          </h2>

          <p style={darkTextStyle}>
            เปิดให้ใช้ฟรีบางส่วนเพื่อให้คนเห็นคุณค่า แล้วล็อก Hook คุณภาพสูง,
            Template, Workflow และแพ็กเฉพาะหมวดไว้ในแพ็กจ่ายเงิน
          </p>
        </div>

        <div style={offerGridStyle}>
          <article style={offerCardStyle}>
            <h3>Free</h3>
            <p>ให้ลองใช้ Hook พื้นฐานบางส่วน</p>
          </article>

          <article style={offerCardStyle}>
            <h3>Pro</h3>
            <p>เข้าถึง Hook ระดับ Pro และเครื่องมือค้นหา</p>
          </article>

          <article style={offerCardStyle}>
            <h3>Premium</h3>
            <p>เข้าถึง Premium-ready, แพ็กเฉพาะหมวด และระบบช่วยคัดคุณภาพ</p>
          </article>
        </div>

        <Link href="/pricing">
          <button style={darkButtonStyle}>ไปจัดแพ็กเกจราคา</button>
        </Link>
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

const darkLabelStyle: CSSProperties = {
  color: "#a5b4fc",
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

const valueGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const valueCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const valueTitleStyle: CSSProperties = {
  marginTop: 0,
  fontSize: "21px",
};

const valueTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.8",
  marginBottom: 0,
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

const scoreBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
  fontSize: "13px",
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

const pricingTeaserStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
};

const darkTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "860px",
};

const offerGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "14px",
  marginTop: "20px",
};

const offerCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "18px",
  background: "#1f2937",
  border: "1px solid #374151",
};

const darkButtonStyle: CSSProperties = {
  marginTop: "18px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};