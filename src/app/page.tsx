import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { hookCategoryList } from "../data/hooks/hookCategories";
import {
  auditHookQuality,
  type RawHookItem,
} from "../lib/content/auditHookQuality";

type HomeStats = {
  totalHooks: number;
  premiumReady: number;
  pro: number;
  free: number;
  needsRewrite: number;
  categoryCount: number;
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

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent) as RawHookItem[];
  } catch {
    return [];
  }
}

function getHomeStats(): HomeStats {
  const stats: HomeStats = {
    totalHooks: 0,
    premiumReady: 0,
    pro: 0,
    free: 0,
    needsRewrite: 0,
    categoryCount: hookCategoryList.length,
  };

  hookCategoryList.forEach((category) => {
    const hooks = loadHookFile(category.slug);

    hooks.forEach((hook, index) => {
      const audit = auditHookQuality(hook, index + 1);

      stats.totalHooks += 1;

      if (audit.level === "premium-ready") {
        stats.premiumReady += 1;
      } else if (audit.level === "pro") {
        stats.pro += 1;
      } else if (audit.level === "free") {
        stats.free += 1;
      } else {
        stats.needsRewrite += 1;
      }
    });
  });

  return stats;
}

export default function HomePage() {
  const stats = getHomeStats();

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Creator OS</p>

        <h1 style={titleStyle}>
          ระบบผู้ช่วยทำคอนเทนต์ ให้รู้ว่าวันนี้ควรเริ่มจากอะไร
        </h1>

        <p style={subtitleStyle}>
          รวมเครื่องมือสำหรับหา Hook, ค้นหาไอเดีย, เขียนแคปชัน, เลือก CTA,
          ทำสคริปต์, บันทึกไอเดีย, ตรวจคุณภาพ และวางแผนทำคอนเทนต์แบบรายวัน
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/guide">
            <button style={secondaryButtonStyle}>ดูคู่มือเริ่มใช้งาน</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดีย</button>
          </Link>
        </div>
      </section>

      <section style={quickStartStyle}>
        <div>
          <p style={labelStyle}>เริ่มตรงไหนดี?</p>

          <h2 style={{ margin: "6px 0" }}>ถ้าเพิ่งเข้าเว็บครั้งแรก ให้เริ่มจาก 3 จุดนี้</h2>
        </div>

        <div style={quickGridStyle}>
          <Link href="/guide" style={quickCardStyle}>
            <span style={quickNumberStyle}>1</span>
            <h3>อ่านคู่มือ</h3>
            <p>รู้ลำดับการใช้งานว่าเข้ามาแล้วควรกดอะไรต่อ</p>
          </Link>

          <Link href="/dashboard" style={quickCardStyle}>
            <span style={quickNumberStyle}>2</span>
            <h3>ทำภารกิจวันนี้</h3>
            <p>เลือกเวลา 15, 30 หรือ 60 นาที แล้วทำตามขั้นตอน</p>
          </Link>

          <Link href="/hooks" style={quickCardStyle}>
            <span style={quickNumberStyle}>3</span>
            <h3>เลือก Hook</h3>
            <p>หาไอเดียประโยคเปิดสำหรับโพสต์หรือคลิป</p>
          </Link>
        </div>
      </section>

      <section style={statsGridStyle}>
        <article style={statCardStyle}>
          <p style={statLabelStyle}>Hook ทั้งหมด</p>
          <h2 style={statNumberStyle}>{stats.totalHooks}</h2>
          <p style={mutedTextStyle}>จากทุกหมวดในคลัง Hook</p>
        </article>

        <article style={statCardStyle}>
          <p style={statLabelStyle}>หมวดทั้งหมด</p>
          <h2 style={statNumberStyle}>{stats.categoryCount}</h2>
          <p style={mutedTextStyle}>แยกตามประเภทคอนเทนต์</p>
        </article>

        <article style={statCardStyle}>
          <p style={statLabelStyle}>พร้อมพรีเมียม</p>
          <h2 style={statNumberStyle}>{stats.premiumReady}</h2>
          <p style={mutedTextStyle}>Hook ที่เหมาะเก็บไว้ในแพ็กคุณภาพสูง</p>
        </article>

        <article style={statCardStyle}>
          <p style={statLabelStyle}>ควรปรับก่อนใช้</p>
          <h2 style={statNumberStyle}>{stats.needsRewrite}</h2>
          <p style={mutedTextStyle}>รายการที่ควรตรวจหรือเขียนใหม่</p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>เครื่องมือหลัก</p>

            <h2 style={{ margin: "6px 0" }}>สิ่งที่ผู้ใช้ทำได้ใน Creator OS</h2>
          </div>

          <Link href="/about">
            <button style={smallButtonStyle}>เกี่ยวกับเว็บ</button>
          </Link>
        </div>

        <div style={toolGridStyle}>
          <Link href="/hooks" style={toolCardStyle}>
            <h3>คลัง Hook</h3>
            <p>เลือกประโยคเปิดสำหรับโพสต์ คลิป หรือคอนเทนต์ขายของ</p>
          </Link>

          <Link href="/search" style={toolCardStyle}>
            <h3>ค้นหาไอเดีย</h3>
            <p>ค้นหา Hook, แคปชัน, CTA และสคริปต์จากหลายแหล่งในที่เดียว</p>
          </Link>

          <Link href="/favorites" style={toolCardStyle}>
            <h3>บันทึกไว้</h3>
            <p>เก็บไอเดียที่ชอบไว้กลับมาใช้ต่อภายหลัง</p>
          </Link>

          <Link href="/dashboard" style={toolCardStyle}>
            <h3>ภารกิจวันนี้</h3>
            <p>เปลี่ยนไอเดียให้กลายเป็นงานที่ทำเสร็จจริงในแต่ละวัน</p>
          </Link>

          <Link href="/dashboard/weekly" style={toolCardStyle}>
            <h3>แผน 7 วัน</h3>
            <p>วางระบบทำคอนเทนต์ต่อเนื่องทั้งสัปดาห์</p>
          </Link>

          <Link href="/quality/hooks" style={toolCardStyle}>
            <h3>ตรวจคุณภาพ Hook</h3>
            <p>ดูว่า Hook ไหนพร้อมใช้ พร้อมขาย หรือควรเขียนใหม่</p>
          </Link>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>คลังคอนเทนต์</p>

        <h2 style={{ margin: "6px 0" }}>ต่อยอดจาก Hook ไปเป็นคอนเทนต์จริง</h2>

        <div style={contentGridStyle}>
          <Link href="/captions" style={contentCardStyle}>
            <h3>แคปชัน</h3>
            <p>ข้อความสำหรับโพสต์ขายของ โพสต์ให้ความรู้ หรือโพสต์สร้างตัวตน</p>
          </Link>

          <Link href="/cta" style={contentCardStyle}>
            <h3>CTA / คำชวนให้ทำ</h3>
            <p>คำชวนให้ติดตาม บันทึก ทักแชต คลิก สมัคร หรือซื้อสินค้า</p>
          </Link>

          <Link href="/scripts" style={contentCardStyle}>
            <h3>สคริปต์</h3>
            <p>โครงเรื่องสำหรับคลิปสั้น วิดีโอสอน หรือคอนเทนต์เล่าเรื่อง</p>
          </Link>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>หน้าใหม่สำหรับผู้ใช้</p>

        <h2 style={{ margin: "6px 0" }}>ช่วยให้เว็บดูน่าเชื่อถือและใช้งานง่ายขึ้น</h2>

        <div style={trustGridStyle}>
          <Link href="/guide" style={trustCardStyle}>
            <h3>คู่มือเริ่มใช้งาน</h3>
            <p>บอกผู้ใช้ใหม่ว่าเข้ามาแล้วควรกดอะไรเป็นลำดับแรก</p>
          </Link>

          <Link href="/about" style={trustCardStyle}>
            <h3>เกี่ยวกับเว็บ</h3>
            <p>อธิบายว่า Creator OS คืออะไร เหมาะกับใคร และช่วยอะไร</p>
          </Link>

          <Link href="/faq" style={trustCardStyle}>
            <h3>FAQ / คำถามที่พบบ่อย</h3>
            <p>ตอบข้อสงสัยก่อนเริ่มใช้งานหรือก่อนตัดสินใจจ่ายเงิน</p>
          </Link>

          <Link href="/contact" style={trustCardStyle}>
            <h3>ติดต่อ / ข้อเสนอแนะ</h3>
            <p>ให้ผู้ใช้เสนอหมวดใหม่ แจ้งปัญหา หรือบอกฟีเจอร์ที่อยากได้</p>
          </Link>
        </div>
      </section>

      <section style={premiumSectionStyle}>
        <div>
          <p style={darkLabelStyle}>ต่อยอดเป็นสินค้า</p>

          <h2 style={darkTitleStyle}>พร้อมพัฒนาเป็นระบบ Free / Pro / Premium</h2>

          <p style={darkTextStyle}>
            เมื่อผู้ใช้เริ่มเห็นคุณค่า สามารถต่อยอดเป็นแพ็กพรีเมียม,
            ระบบสมาชิก, แพ็ก Hook เฉพาะหมวด หรือเครื่องมือช่วยทำคอนเทนต์ขั้นสูงได้
          </p>

          <div style={buttonRowStyle}>
            <Link href="/pricing">
              <button style={darkButtonStyle}>ดูราคาแพ็กเกจ</button>
            </Link>

            <Link href="/premium">
              <button style={darkSecondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
            </Link>
          </div>
        </div>

        <div style={premiumBoxStyle}>
          <p style={premiumBoxLabelStyle}>สถานะคุณภาพ Hook</p>

          <h3 style={premiumBoxNumberStyle}>
            {stats.premiumReady + stats.pro}
          </h3>

          <p style={darkTextStyle}>
            รายการระดับ Premium-ready และ Pro ที่สามารถนำไปต่อยอดเป็นแพ็กขายได้
          </p>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>เริ่มใช้งานจากหน้าเดียวก่อน</h2>

        <p style={bottomTextStyle}>
          ถ้ายังไม่รู้จะเริ่มตรงไหน ให้ไปที่หน้า ภารกิจวันนี้
          แล้วทำตามขั้นตอน ระบบจะพาไปใช้เครื่องมืออื่นตามลำดับ
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/dashboard">
            <button style={darkButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/guide">
            <button style={darkSecondaryButtonStyle}>ดูคู่มือ</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "50px 24px",
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
  fontSize: "48px",
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

const quickStartStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const quickGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  gap: "16px",
  marginTop: "18px",
};

const quickCardStyle: CSSProperties = {
  display: "block",
  padding: "20px",
  borderRadius: "20px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  color: "#111827",
  textDecoration: "none",
  lineHeight: "1.7",
};

const quickNumberStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
  gap: "16px",
  marginTop: "22px",
};

const statCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "20px",
  background: "white",
};

const statLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const statNumberStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "40px",
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

const toolGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const toolCardStyle: CSSProperties = {
  display: "block",
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  textDecoration: "none",
  lineHeight: "1.8",
};

const contentGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const contentCardStyle: CSSProperties = {
  display: "block",
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  textDecoration: "none",
  lineHeight: "1.8",
};

const trustGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const trustCardStyle: CSSProperties = {
  display: "block",
  padding: "20px",
  borderRadius: "20px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  color: "#111827",
  textDecoration: "none",
  lineHeight: "1.8",
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
};

const premiumBoxStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "#1f2937",
  border: "1px solid #374151",
};

const premiumBoxLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#a5b4fc",
  fontWeight: "bold",
};

const premiumBoxNumberStyle: CSSProperties = {
  fontSize: "44px",
  margin: "10px 0",
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
  maxWidth: "760px",
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