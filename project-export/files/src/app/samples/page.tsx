import type { CSSProperties } from "react";
import Link from "next/link";

const weekOverview = [
  "วันที่ 1: วางแกนเรื่องและเตรียมฉาก",
  "วันที่ 2: ถ่ายหนังสั้นเรื่องที่ 1",
  "วันที่ 3: ตัดต่อ โพสต์ และตอบความคิดเห็น",
  "วันที่ 4: ทำคลิปสั้นเสริมในโลกของเรื่อง",
  "วันที่ 5: ถ่ายหนังสั้นเรื่องที่ 2",
  "วันที่ 6: ตัดต่อ โพสต์ และชวนผู้ชมมีส่วนร่วม",
  "วันที่ 7: สรุปผลและเลือกแนวที่ควรทำต่อ",
];

const sampleFields = [
  ["เป้าหมายวันนี้", "สร้างหนังสั้นไร้ภาษาที่ดูเข้าใจได้ภายใน 30–45 วินาที"],
  ["ชื่อเรื่อง", "ถุงขนมที่หายไป"],
  ["Hook ภาพ", "เปิดด้วยตัวละครวางถุงขนมบนโต๊ะ แล้วหันกลับมาอีกครั้งแต่ถุงหายไป"],
  ["บทและลำดับฉาก", "ฉาก 1 วางถุงขนมและเดินออกจากเฟรม · ฉาก 2 กลับมาแล้วตกใจ · ฉาก 3 ไล่ตามร่องรอยเศษขนม · ฉาก 4 พบว่าตัวเองเผลอถือถุงอีกใบอยู่ตลอด"],
  ["มุมกล้อง", "มุมกว้างให้เห็นโต๊ะ · Close-up จุดที่ถุงหาย · มุมตามสายตาตอนค้นหา · ค้างภาพเฉลย 2–3 วินาที"],
  ["Caption", "เคยหาของทั้งที่ของอยู่กับตัวไหม 😅 ตอนจบแบบนี้เดาถูกหรือเปล่า"],
  ["CTA", "ติดตามไว้ เรื่องถัดไปจะหักมุมกว่าเดิม"],
  ["แผนสำรอง", "ถ้าไม่มีนักแสดงคนที่สอง ให้ใช้มือหรือเงาเป็นตัวหลอกแทน"],
  ["เวลาที่ใช้", "เตรียม 10 นาที · ถ่าย 20 นาที · ตัดต่อ 15 นาที"],
  ["หลังโพสต์", "ตอบความคิดเห็น 3–5 รายการ และจดจำนวนผู้ชมที่ดูจนถึงช่วงเฉลย"],
];

const otherExamples = [
  {
    title: "ผู้ขายสินค้า",
    text: "ระบบจะวางลำดับจากการเปิดปัญหา สาธิตการใช้ ตอบข้อสงสัย สร้างความเชื่อใจ และชวนสั่งซื้อ โดยไม่แต่งคุณสมบัติหรือโปรโมชันเอง",
  },
  {
    title: "ผู้ให้บริการ",
    text: "ระบบจะสลับผลงาน ขั้นตอน เบื้องหลัง คำถามสำคัญ และ CTA เพื่อเพิ่มการทักแชตหรือการจองตามเป้าหมายที่เลือก",
  },
  {
    title: "ครีเอเตอร์ให้ความรู้",
    text: "ระบบจะจัดหัวข้อจากระดับความรู้ของผู้ชม พร้อมตัวอย่าง บทพูด ลำดับภาพ และคำชวนให้บันทึกหรือแชร์",
  },
];

export default function SamplesPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>ตัวอย่างแผน Creator OS</p>
        <h1 style={titleStyle}>ดูรูปแบบงานที่ลูกค้าจะได้รับก่อนตัดสินใจ</h1>
        <p style={subtitleStyle}>
          ตัวอย่างนี้ย่อจากแผนจริงเพื่อแสดงระดับรายละเอียด ไม่ใช่แผนสำเร็จรูปที่นำไปเปลี่ยนเพียงชื่อหัวข้อ
        </p>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={labelStyle}>ตัวอย่าง: ครีเอเตอร์หนังสั้น</p>
          <h2 style={sectionTitleStyle}>เป้าหมายเพิ่มผู้ติดตาม · Facebook · มีเวลา 30–45 นาทีต่อวัน</h2>
          <p style={sectionTextStyle}>
            ผู้ใช้ระบุว่าคิดบทไม่ออก ระบบจึงต้องช่วยสร้างเรื่อง บท ลำดับฉาก และมุมกล้อง
            ไม่ใช่สร้างคลิปสอนผู้ชมให้คิดบท
          </p>
        </div>

        <div style={overviewGridStyle}>
          {weekOverview.map((item) => (
            <div key={item} style={overviewCardStyle}>{item}</div>
          ))}
        </div>
      </section>

      <section style={detailSectionStyle}>
        <p style={detailLabelStyle}>ตัวอย่างรายละเอียดหนึ่งวัน</p>
        <h2 style={detailTitleStyle}>วันที่ 2 · ถ่ายหนังสั้นพร้อมโพสต์</h2>
        <div style={fieldGridStyle}>
          {sampleFields.map(([label, value]) => (
            <article key={label} style={fieldCardStyle}>
              <p style={fieldLabelStyle}>{label}</p>
              <p style={fieldValueStyle}>{value}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ระบบปรับตามประเภทงาน</p>
        <h2 style={sectionTitleStyle}>รูปแบบแผนจะไม่เหมือนกันทุกคน</h2>
        <div style={threeGridStyle}>
          {otherExamples.map((item) => (
            <article key={item.title} style={otherCardStyle}>
              <h3 style={cardTitleStyle}>{item.title}</h3>
              <p style={sectionTextStyle}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={ctaStyle}>
        <h2 style={ctaTitleStyle}>ให้ระบบสร้างจากข้อมูลจริงของคุณ</h2>
        <p style={ctaTextStyle}>แบบฟอร์มจะแสดงเฉพาะตัวเลือกที่เกี่ยวข้องกับสินค้า บริการ หรือทิศทางครีเอเตอร์ที่คุณเลือก</p>
        <div style={buttonRowStyle}>
          <Link href="/start" style={primaryLinkStyle}>เริ่มสร้างแผน</Link>
          <Link href="/pricing" style={secondaryLinkStyle}>ดูราคา 149 บาท</Link>
        </div>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = { maxWidth: "1100px", margin: "0 auto", padding: "clamp(16px, 4vw, 28px)", overflowX: "hidden" };
const heroStyle: CSSProperties = { padding: "clamp(32px, 7vw, 58px)", borderRadius: "28px", background: "#111827", color: "white" };
const eyebrowStyle: CSSProperties = { margin: 0, color: "#a5b4fc", fontWeight: 800 };
const titleStyle: CSSProperties = { margin: "12px 0", fontSize: "clamp(34px, 7vw, 52px)", lineHeight: 1.14 };
const subtitleStyle: CSSProperties = { margin: 0, color: "#d1d5db", lineHeight: 1.8, fontSize: "18px", maxWidth: "850px" };
const sectionStyle: CSSProperties = { padding: "clamp(50px, 8vw, 76px) 0" };
const sectionHeadingStyle: CSSProperties = { maxWidth: "850px", marginBottom: "24px" };
const labelStyle: CSSProperties = { margin: "0 0 8px", color: "#4f46e5", fontWeight: 800 };
const sectionTitleStyle: CSSProperties = { margin: "0 0 12px", fontSize: "clamp(28px, 5vw, 40px)", color: "#111827", lineHeight: 1.2 };
const sectionTextStyle: CSSProperties = { margin: 0, color: "#4b5563", lineHeight: 1.8 };
const overviewGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "12px" };
const overviewCardStyle: CSSProperties = { padding: "16px", borderRadius: "16px", border: "1px solid #e5e7eb", background: "white", color: "#374151", lineHeight: 1.6, fontWeight: 700 };
const detailSectionStyle: CSSProperties = { padding: "clamp(28px, 6vw, 46px)", borderRadius: "28px", background: "#eef2ff" };
const detailLabelStyle: CSSProperties = { margin: 0, color: "#4338ca", fontWeight: 800 };
const detailTitleStyle: CSSProperties = { margin: "10px 0 22px", color: "#111827", fontSize: "clamp(28px, 5vw, 40px)" };
const fieldGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "12px" };
const fieldCardStyle: CSSProperties = { padding: "17px", borderRadius: "16px", background: "white", border: "1px solid #c7d2fe" };
const fieldLabelStyle: CSSProperties = { margin: "0 0 6px", color: "#4338ca", fontWeight: 900 };
const fieldValueStyle: CSSProperties = { margin: 0, color: "#374151", lineHeight: 1.75 };
const threeGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", gap: "16px" };
const otherCardStyle: CSSProperties = { padding: "22px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "white" };
const cardTitleStyle: CSSProperties = { margin: "0 0 10px", color: "#111827" };
const ctaStyle: CSSProperties = { textAlign: "center", padding: "clamp(34px, 7vw, 56px)", borderRadius: "26px", background: "#111827", color: "white" };
const ctaTitleStyle: CSSProperties = { margin: "0 0 10px", fontSize: "clamp(28px, 5vw, 40px)" };
const ctaTextStyle: CSSProperties = { margin: 0, color: "#d1d5db", lineHeight: 1.7 };
const buttonRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "22px" };
const primaryLinkStyle: CSSProperties = { display: "inline-flex", minHeight: "48px", alignItems: "center", justifyContent: "center", padding: "0 18px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: CSSProperties = { ...primaryLinkStyle, background: "white", color: "#312e81" };
