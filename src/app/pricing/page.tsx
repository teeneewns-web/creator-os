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

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  badge?: string;
  recommended?: boolean;
  features: string[];
  href: string;
  buttonText: string;
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

function loadAllAuditedHooks() {
  const auditedHooks: HookQualityAudit[] = [];

  hookCategoryList.forEach((category) => {
    const hooks = loadHookFile(category.slug);

    hooks.forEach((item, index) => {
      auditedHooks.push(auditHookQuality(item, index + 1));
    });
  });

  return auditedHooks;
}

function countByLevel(items: HookQualityAudit[], level: string) {
  return items.filter((item) => item.level === level).length;
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}

export default function PricingPage() {
  const auditedHooks = loadAllAuditedHooks();

  const totalHooks = auditedHooks.length;
  const premiumReady = countByLevel(auditedHooks, "premium-ready");
  const pro = countByLevel(auditedHooks, "pro");
  const free = countByLevel(auditedHooks, "free");
  const needsRewrite = countByLevel(auditedHooks, "needs-rewrite");

  const sellableHooks = premiumReady + pro;
  const weakHooks = free + needsRewrite;

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "฿0",
      period: "เริ่มต้นใช้งาน",
      description:
        "เหมาะสำหรับคนที่อยากลองระบบก่อน เห็นตัวอย่าง Hook และเริ่มใช้ Dashboard เบื้องต้น",
      features: [
        "ดูตัวอย่าง Hook บางส่วน",
        "ใช้ Search เพื่อค้นหาไอเดียพื้นฐาน",
        "ใช้ Dashboard วางแผนคอนเทนต์เบื้องต้น",
        "เหมาะกับการทดลองก่อนตัดสินใจ",
      ],
      href: "/dashboard",
      buttonText: "เริ่มใช้ฟรี",
    },
    {
      name: "Pro",
      price: "฿149",
      period: "ต่อเดือน",
      description:
        "เหมาะสำหรับ Creator ที่อยากประหยัดเวลา มี Hook, Caption, CTA และ Script ให้ใช้งานจริงมากขึ้น",
      badge: "แนะนำเริ่มต้น",
      recommended: true,
      features: [
        "เข้าถึง Hook ระดับ Pro",
        "ค้นหา Hook, Caption, CTA และ Script ได้สะดวกขึ้น",
        "ใช้ตัวกรองคุณภาพเพื่อเลือกของที่เหมาะกับงาน",
        "เหมาะกับคนทำเพจ TikTok Reels Shorts และโพสต์ขาย",
        "ช่วยลดเวลาคิดคอนเทนต์จากศูนย์",
      ],
      href: "/premium",
      buttonText: "ดูรายละเอียด Pro",
    },
    {
      name: "Premium",
      price: "฿299",
      period: "ต่อเดือน",
      description:
        "เหมาะสำหรับคนที่อยากได้แพ็กคุณภาพสูง คัดเฉพาะ Hook ที่พร้อมใช้จริงและต่อยอดเป็น workflow รายวัน",
      badge: "คุ้มสุด",
      features: [
        "เข้าถึง Hook ระดับ Premium-ready",
        "ใช้ระบบตรวจคุณภาพ Hook ก่อนนำไปขายหรือโพสต์จริง",
        "ดู Rewrite Suggestion สำหรับ Hook ที่ยังอ่อน",
        "เข้าถึงแพ็กเฉพาะหมวด เช่น AI, Finance, Beauty, Gaming",
        "เหมาะกับ Creator เจ้าของร้าน ฟรีแลนซ์ และทีมคอนเทนต์",
      ],
      href: "/premium",
      buttonText: "ดู Premium",
    },
  ];

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Pricing</p>

        <h1 style={titleStyle}>แพ็กเกจ Creator OS สำหรับเริ่มทำคอนเทนต์จริง</h1>

        <p style={subtitleStyle}>
          เลือกแพ็กตามระดับการใช้งาน ตั้งแต่ทดลองฟรี ไปจนถึงแพ็ก Premium
          ที่คัด Hook คุณภาพสูง พร้อมระบบค้นหา ตรวจคุณภาพ และ workflow สำหรับ Creator
        </p>

        <div style={buttonRowStyle}>
          <Link href="/premium">
            <button style={primaryButtonStyle}>ดูหน้า Premium</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>ดูคลัง Hook</button>
          </Link>

          <Link href="/quality/hooks">
            <button style={secondaryButtonStyle}>ตรวจคุณภาพ Hook</button>
          </Link>
        </div>
      </section>

      <section style={proofGridStyle}>
        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={proofNumberStyle}>{totalHooks}</h2>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>พร้อมใช้เชิงสินค้า</p>
          <h2 style={proofNumberStyle}>{sellableHooks}</h2>
          <p style={mutedTextStyle}>
            Premium-ready + Pro รวม {getPercent(sellableHooks, totalHooks)}%
          </p>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>Premium-ready</p>
          <h2 style={proofNumberStyle}>{premiumReady}</h2>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={proofNumberStyle}>{weakHooks}</h2>
          <p style={mutedTextStyle}>
            Free {free} / Needs rewrite {needsRewrite}
          </p>
        </article>
      </section>

      <section style={pricingGridStyle}>
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            style={plan.recommended ? recommendedCardStyle : planCardStyle}
          >
            {plan.badge ? <p style={badgeStyle}>{plan.badge}</p> : null}

            <h2 style={planNameStyle}>{plan.name}</h2>

            <div style={priceRowStyle}>
              <strong style={priceStyle}>{plan.price}</strong>
              <span style={periodStyle}>{plan.period}</span>
            </div>

            <p style={planDescriptionStyle}>{plan.description}</p>

            <ul style={featureListStyle}>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <Link href={plan.href}>
              <button
                style={
                  plan.recommended ? recommendedButtonStyle : planButtonStyle
                }
              >
                {plan.buttonText}
              </button>
            </Link>
          </article>
        ))}
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>How to sell</p>

        <h2 style={{ margin: "6px 0" }}>โครงสร้างการขายที่ควรใช้ตอนเริ่มต้น</h2>

        <div style={stepGridStyle}>
          <article style={stepCardStyle}>
            <h3>1. ให้ใช้ฟรีบางส่วน</h3>
            <p>
              ให้ผู้ใช้เห็นว่าเว็บช่วยประหยัดเวลาได้จริง เช่น ค้น Hook,
              คัดลอกข้อความ และใช้ Dashboard เบื้องต้น
            </p>
          </article>

          <article style={stepCardStyle}>
            <h3>2. ขาย Pro เป็นแพ็กหลัก</h3>
            <p>
              Pro ควรเป็นแพ็กที่คนทั่วไปตัดสินใจง่าย ได้ Hook และเครื่องมือ
              มากพอสำหรับทำงานจริงทุกวัน
            </p>
          </article>

          <article style={stepCardStyle}>
            <h3>3. ใช้ Premium เป็นแพ็กกำไร</h3>
            <p>
              Premium ควรล็อกของที่คัดแล้วดีที่สุด เช่น Premium-ready,
              แพ็กเฉพาะหมวด และระบบช่วยปรับคุณภาพ
            </p>
          </article>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ยังไม่ต้องเก็บเงินทันที</h2>

        <p style={darkTextStyle}>
          ตอนนี้หน้า Pricing ใช้เป็นหน้าวางโครงสร้างสินค้าได้ก่อน
          เมื่อระบบพร้อมค่อยเชื่อมปุ่มจ่ายเงิน สมัครสมาชิก หรือระบบล็อก Premium ภายหลัง
        </p>

        <Link href="/dashboard">
          <button style={darkButtonStyle}>กลับไปเริ่มใช้งาน</button>
        </Link>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "46px 24px",
  borderRadius: "28px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
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
  maxWidth: "920px",
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
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const proofGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const proofCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  background: "white",
};

const proofLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const proofNumberStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "38px",
};

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
};

const pricingGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "28px",
};

const planCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const recommendedCardStyle: CSSProperties = {
  border: "2px solid #4f46e5",
  borderRadius: "24px",
  padding: "24px",
  background: "#eef2ff",
  boxShadow: "0 18px 40px rgba(79, 70, 229, 0.15)",
};

const badgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
  marginTop: 0,
};

const planNameStyle: CSSProperties = {
  fontSize: "28px",
  margin: "12px 0",
};

const priceRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "8px",
};

const priceStyle: CSSProperties = {
  fontSize: "42px",
};

const periodStyle: CSSProperties = {
  color: "#555",
  fontWeight: "bold",
};

const planDescriptionStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.8",
};

const featureListStyle: CSSProperties = {
  paddingLeft: "20px",
  color: "#374151",
  lineHeight: "1.9",
};

const planButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "18px",
  padding: "13px 18px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const recommendedButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "18px",
  padding: "13px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const sectionStyle: CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const stepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "18px",
};

const stepCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.8",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const darkTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "820px",
  margin: "0 auto",
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