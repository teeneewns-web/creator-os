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
        <p style={labelStyle}>ระบบผู้ช่วยทำคอนเทนต์</p>

        <h1 style={titleStyle}>
          Creator OS ช่วยคิดคอนเทนต์ ค้นหา Hook และคัดคุณภาพก่อนนำไปใช้จริง
        </h1>

        <p style={subtitleStyle}>
          รวมคลัง Hook, แคปชัน, CTA, สคริปต์, ภารกิจรายวัน และระบบตรวจคุณภาพ
          ไว้ในที่เดียว เหมาะกับคนทำคอนเทนต์ที่ไม่อยากเริ่มจากหน้าว่าง
          และอยากเลือกใช้ไอเดียที่พร้อมใช้งานมากขึ้น
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดีย</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
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
            ระดับพรีเมียม + ระดับ Pro รวม{" "}
            {getPercent(stats.sellable, stats.totalHooks)}%
          </p>
        </article>

        <article style={proofCardStyle}>
          <p style={proofLabelStyle}>พร้อมพรีเมียม</p>
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
            <p style={labelStyle}>วิธีใช้งาน</p>

            <h2 style={{ margin: "6px 0" }}>เริ่มทำคอนเทนต์จากระบบเดียว</h2>
          </div>

          <Link href="/dashboard">
            <button style={smallButtonStyle}>เปิดภารกิจวันนี้</button>
          </Link>
        </div>

        <div style={stepGridStyle}>
          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>01</p>
            <h3>เลือก Hook หรือประโยคเปิด</h3>
            <p>
              ค้นหา Hook ตามหมวดหรือคำค้น แล้วดูระดับคุณภาพว่าอันไหนพร้อมใช้
              อันไหนควรปรับก่อน
            </p>
          </article>

          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>02</p>
            <h3>ต่อเป็นแคปชัน CTA หรือสคริปต์</h3>
            <p>
              นำ Hook ที่เลือกไปต่อยอดเป็นข้อความโพสต์ คำชวนให้กดติดตาม
              คำชวนซื้อ หรือสคริปต์คลิปสั้น
            </p>
          </article>

          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>03</p>
            <h3>ใช้ภารกิจรายวันช่วยลงมือทำ</h3>
            <p>
              ใช้หน้า Dashboard ช่วยบอกว่าวันนี้ควรทำอะไร
              เหมาะกับคนที่อยากมีระบบทำคอนเทนต์แบบเป็นขั้นตอน
            </p>
          </article>

          <article style={stepCardStyle}>
            <p style={stepNumberStyle}>04</p>
            <h3>ตรวจคุณภาพก่อนโพสต์หรือขายจริง</h3>
            <p>
              ใช้หน้าตรวจ Hook เพื่อดูคะแนน จุดที่ควรแก้ และคำแนะนำสำหรับเขียนใหม่
              ก่อนนำไปใช้จริง
            </p>
          </article>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>เครื่องมือในระบบ</p>

        <h2 style={{ margin: "6px 0" }}>เมนูหลักที่ใช้ทำงาน</h2>

        <div style={toolGridStyle}>
          <Link href="/hooks" style={toolCardStyle}>
            <span style={toolIconStyle}>⚡</span>
            <h3>คลัง Hook</h3>
            <p>คลังประโยคเปิดแยกหมวด พร้อมคะแนนคุณภาพและตัวกรองระดับ</p>
          </Link>

          <Link href="/search" style={toolCardStyle}>
            <span style={toolIconStyle}>🔍</span>
            <h3>ค้นหาไอเดีย</h3>
            <p>ค้นหา Hook, แคปชัน, CTA และสคริปต์จากจุดเดียว</p>
          </Link>

          <Link href="/favorites" style={toolCardStyle}>
            <span style={toolIconStyle}>⭐</span>
            <h3>บันทึกไว้</h3>
            <p>เก็บ Hook หรือไอเดียที่ชอบไว้กลับมาใช้ต่อภายหลัง</p>
          </Link>

          <Link href="/quality/hooks" style={toolCardStyle}>
            <span style={toolIconStyle}>✅</span>
            <h3>ตรวจคุณภาพ Hook</h3>
            <p>ตรวจ Hook ที่ควรปรับ พร้อมคำแนะนำสำหรับเขียนใหม่</p>
          </Link>

          <Link href="/premium" style={toolCardStyle}>
            <span style={toolIconStyle}>💎</span>
            <h3>พรีเมียม</h3>
            <p>หน้าขายที่ใช้ข้อมูลจริงจากระบบเพื่ออธิบายคุณค่าของแพ็ก</p>
          </Link>

          <Link href="/pricing" style={toolCardStyle}>
            <span style={toolIconStyle}>💰</span>
            <h3>ราคาแพ็กเกจ</h3>
            <p>โครงสร้างแพ็ก Free / Pro / Premium สำหรับเตรียมขาย</p>
          </Link>

          <Link href="/dashboard/weekly" style={toolCardStyle}>
            <span style={toolIconStyle}>📅</span>
            <h3>แผน 7 วัน</h3>
            <p>แผนทำงาน 7 วันสำหรับ Creator ที่ต้องการลงมือทำจริง</p>
          </Link>
        </div>
      </section>

      <section style={premiumSectionStyle}>
        <div>
          <p style={darkLabelStyle}>เตรียมต่อยอดเป็นสินค้า</p>

          <h2 style={darkTitleStyle}>
            ไม่ใช่แค่เว็บรวมข้อความ แต่เป็นระบบที่เริ่มแยกของฟรีกับของขายได้
          </h2>

          <p style={darkTextStyle}>
            ระบบเริ่มรู้แล้วว่า Hook ไหนพร้อมใช้ Hook ไหนควรปรับ
            และหมวดไหนเหมาะนำไปทำแพ็กขายก่อน นี่คือพื้นฐานสำคัญก่อนต่อยอดเป็นระบบสมาชิก
            ระบบล็อกพรีเมียม หรือหน้าชำระเงินในอนาคต
          </p>

          <div style={buttonRowStyle}>
            <Link href="/premium">
              <button style={darkButtonStyle}>ดูหน้าแพ็กพรีเมียม</button>
            </Link>

            <Link href="/quality/hooks">
              <button style={darkSecondaryButtonStyle}>ดูระบบตรวจคุณภาพ</button>
            </Link>
          </div>
        </div>

        <div style={darkStatBoxStyle}>
          <p style={darkStatLabelStyle}>พร้อมพรีเมียม</p>
          <h3 style={darkStatNumberStyle}>{stats.premiumReady}</h3>

          <p style={darkStatLabelStyle}>ระดับ Pro</p>
          <h3 style={darkStatNumberStyle}>{stats.pro}</h3>

          <p style={darkStatLabelStyle}>Hook พร้อมใช้เชิงสินค้า</p>
          <h3 style={darkStatNumberStyle}>{stats.sellable}</h3>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>เริ่มจากภารกิจวันนี้ก่อน</h2>

        <p style={bottomTextStyle}>
          ถ้ายังไม่รู้จะเริ่มตรงไหน ให้เปิดภารกิจวันนี้ แล้วทำตามขั้นตอนในระบบ
          จากนั้นค่อยใช้ Hook, แคปชัน, CTA และสคริปต์มาต่อเป็นคอนเทนต์จริง
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