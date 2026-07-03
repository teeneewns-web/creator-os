import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { hookCategoryList } from "../data/hooks/hookCategories";
import {
  auditHookQuality,
  type HookQualityAudit,
  type RawHookItem,
} from "../lib/content/auditHookQuality";

type HomeStat = {
  totalHooks: number;
  premiumReady: number;
  pro: number;
  weak: number;
  sellable: number;
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

function getHomeStats(): HomeStat {
  const auditedHooks = loadAllAuditedHooks();

  const premiumReady = countByLevel(auditedHooks, "premium-ready");
  const pro = countByLevel(auditedHooks, "pro");
  const free = countByLevel(auditedHooks, "free");
  const needsRewrite = countByLevel(auditedHooks, "needs-rewrite");

  return {
    totalHooks: auditedHooks.length,
    premiumReady,
    pro,
    weak: free + needsRewrite,
    sellable: premiumReady + pro,
  };
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;

  return Math.round((value / total) * 100);
}

export default function HomePage() {
  const stats = getHomeStats();

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Creator OS</p>

        <h1 style={titleStyle}>
          ระบบช่วย Creator คิดคอนเทนต์ ค้นหา Hook และคัดคุณภาพก่อนนำไปใช้จริง
        </h1>

        <p style={subtitleStyle}>
          Creator OS รวม Hook, Caption, CTA, Script, Dashboard และระบบตรวจคุณภาพ
          ไว้ในที่เดียว เพื่อช่วยให้คุณเริ่มทำคอนเทนต์ได้เร็วขึ้น
          ไม่ต้องเริ่มจากหน้าว่าง และเลือกใช้ข้อความที่เหมาะกับงานจริงมากขึ้น
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดีย</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูแพ็กเกจ</button>
          </Link>
        </div>
      </section>

      <section style={proofGridStyle}>
        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={proofNumberStyle}>{stats.totalHooks}</h2>
          <p style={mutedTextStyle}>รวมทุกหมวดในระบบ</p>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>พร้อมใช้เชิงสินค้า</p>
          <h2 style={proofNumberStyle}>{stats.sellable}</h2>
          <p style={mutedTextStyle}>
            Premium-ready + Pro รวม{" "}
            {getPercent(stats.sellable, stats.totalHooks)}%
          </p>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>Premium-ready</p>
          <h2 style={proofNumberStyle}>{stats.premiumReady}</h2>
          <p style={mutedTextStyle}>Hook ที่เหมาะนำไปทำแพ็กขายก่อน</p>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>ควรปรับก่อนขาย</p>
          <h2 style={proofNumberStyle}>{stats.weak}</h2>
          <p style={mutedTextStyle}>แยกออกมาเพื่อไม่ให้ของอ่อนปนกับของดี</p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>How it works</p>

            <h2 style={{ margin: "6px 0" }}>เริ่มทำคอนเทนต์จากระบบเดียว</h2>
          </div>

          <Link href="/dashboard">
            <button style={smallButtonStyle}>เปิด Dashboard</button>
          </Link>
        </div>

        <div style={stepGridStyle}>
          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>01</p>
            <h3>เลือก Hook</h3>
            <p>
              ค้นหา Hook ตามหมวดหรือคำค้น แล้วดูระดับคุณภาพว่าเป็น
              Premium-ready, Pro, Free หรือ Needs rewrite
            </p>
          </article>

          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>02</p>
            <h3>ต่อเป็น Caption / CTA / Script</h3>
            <p>
              นำ Hook ที่เลือกไปต่อยอดเป็นข้อความโพสต์ คำชวนกดติดตาม
              หรือสคริปต์คลิปสั้น
            </p>
          </article>

          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>03</p>
            <h3>ใช้ Dashboard ทำงานรายวัน</h3>
            <p>
              ใช้แผนรายวันและแผน 7 วันช่วยบอกว่าควรทำอะไรต่อ
              ไม่ต้องคิดทุกอย่างใหม่เอง
            </p>
          </article>

          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>04</p>
            <h3>ตรวจคุณภาพก่อนขายหรือโพสต์จริง</h3>
            <p>
              ใช้หน้าตรวจ Hook เพื่อดูคะแนน ปัญหา และ Rewrite Suggestion
              ก่อนนำไปทำเป็นแพ็ก Premium
            </p>
          </article>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Creator Tools</p>

        <h2 style={{ margin: "6px 0" }}>เครื่องมือหลักใน Creator OS</h2>

        <div style={toolGridStyle}>
          <Link href="/hooks" style={toolCardStyle}>
            <span style={toolIconStyle}>⚡</span>
            <h3>Hook Library</h3>
            <p>คลัง Hook แยกหมวด พร้อมคะแนนคุณภาพและตัวกรองระดับ</p>
          </Link>

          <Link href="/search" style={toolCardStyle}>
            <span style={toolIconStyle}>🔍</span>
            <h3>Search Library</h3>
            <p>ค้นหา Hook, Caption, CTA และ Script จากจุดเดียว</p>
          </Link>

          <Link href="/quality/hooks" style={toolCardStyle}>
            <span style={toolIconStyle}>✅</span>
            <h3>Hook Quality Audit</h3>
            <p>ตรวจ Hook ที่ควรปรับ พร้อม Rewrite Suggestion</p>
          </Link>

          <Link href="/premium" style={toolCardStyle}>
            <span style={toolIconStyle}>💎</span>
            <h3>Premium</h3>
            <p>หน้าขายที่ใช้ข้อมูลจริงจากระบบเพื่ออธิบายคุณค่าแพ็ก</p>
          </Link>

          <Link href="/pricing" style={toolCardStyle}>
            <span style={toolIconStyle}>💰</span>
            <h3>Pricing</h3>
            <p>โครงสร้างแพ็ก Free / Pro / Premium สำหรับเตรียมขาย</p>
          </Link>

          <Link href="/dashboard/weekly" style={toolCardStyle}>
            <span style={toolIconStyle}>📅</span>
            <h3>7-Day Plan</h3>
            <p>แผนทำงาน 7 วันสำหรับ Creator ที่ต้องการลงมือทำจริง</p>
          </Link>
        </div>
      </section>

      <section style={premiumSectionStyle}>
        <div>
          <p style={darkLabelStyle}>Built for selling later</p>

          <h2 style={darkTitleStyle}>
            ไม่ใช่แค่เว็บรวมข้อความ แต่เป็นระบบที่เริ่มแยกของฟรีกับของขายได้
          </h2>

          <p style={darkTextStyle}>
            ตอนนี้ระบบเริ่มรู้แล้วว่า Hook ไหนพร้อมใช้ Hook ไหนควรปรับ
            และหมวดไหนเหมาะนำไปทำแพ็กขายก่อน นี่คือพื้นฐานสำคัญก่อนต่อยอดเป็นระบบสมาชิก
            ระบบล็อก Premium หรือหน้าชำระเงินในอนาคต
          </p>

          <div style={buttonRowStyle}>
            <Link href="/premium">
              <button style={darkButtonStyle}>ดูหน้า Premium</button>
            </Link>

            <Link href="/quality/hooks">
              <button style={darkSecondaryButtonStyle}>ดูระบบตรวจคุณภาพ</button>
            </Link>
          </div>
        </div>

        <div style={darkStatBoxStyle}>
          <p style={darkStatLabelStyle}>Premium-ready</p>
          <h3 style={darkStatNumberStyle}>{stats.premiumReady}</h3>

          <p style={darkStatLabelStyle}>Pro</p>
          <h3 style={darkStatNumberStyle}>{stats.pro}</h3>

          <p style={darkStatLabelStyle}>Sellable Hooks</p>
          <h3 style={darkStatNumberStyle}>{stats.sellable}</h3>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>เริ่มจากภารกิจวันนี้ก่อน</h2>

        <p style={bottomTextStyle}>
          ถ้ายังไม่รู้จะเริ่มตรงไหน ให้เปิด Dashboard แล้วทำตามภารกิจรายวัน
          จากนั้นค่อยใช้ Hook, Caption, CTA และ Script มาต่อเป็นคอนเทนต์จริง
        </p>

        <Link href="/dashboard">
          <button style={darkButtonStyle}>เริ่มภารกิจวันนี้</button>
        </Link>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "54px 24px",
  borderRadius: "30px",
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
  fontSize: "50px",
  lineHeight: "1.1",
  margin: "12px 0",
  maxWidth: "1000px",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "19px",
  lineHeight: "1.8",
  maxWidth: "900px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "20px",
};

const primaryButtonStyle: CSSProperties = {
  padding: "13px 20px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "13px 20px",
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

const stepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const stepCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.8",
};

const stepNumberStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const toolGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const toolCardStyle: CSSProperties = {
  display: "block",
  padding: "20px",
  borderRadius: "22px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  textDecoration: "none",
  color: "#111827",
};

const toolIconStyle: CSSProperties = {
  fontSize: "30px",
};

const premiumSectionStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) minmax(240px,320px)",
  gap: "24px",
  alignItems: "center",
};

const darkTitleStyle: CSSProperties = {
  fontSize: "34px",
  lineHeight: "1.2",
  margin: "10px 0",
};

const darkTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "820px",
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

const darkStatBoxStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  background: "#1f2937",
  border: "1px solid #374151",
};

const darkStatLabelStyle: CSSProperties = {
  color: "#a5b4fc",
  fontWeight: "bold",
  marginBottom: "6px",
};

const darkStatNumberStyle: CSSProperties = {
  fontSize: "34px",
  margin: "0 0 16px",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  textAlign: "center",
};

const bottomTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "780px",
  margin: "0 auto",
};