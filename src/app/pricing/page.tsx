import type { CSSProperties } from "react";
import Link from "next/link";

const included = [
  "สินค้า บริการ หรือหัวข้อหลัก 1 รายการ",
  "เป้าหมายหลัก 1 เป้าหมาย",
  "แพลตฟอร์มหลักตามที่เลือก",
  "แผนคอนเทนต์พร้อมทำครบ 7 วัน",
  "Hook บทพูด บทเต็ม หรือลำดับฉากตามประเภทคอนเทนต์",
  "ลำดับการถ่าย ข้อความบนหน้าจอ Caption CTA และ Hashtags",
  "สิ่งที่ต้องเตรียม เวลาโดยประมาณ และแผนสำรองทุกวัน",
  "งานหลังโพสต์ ตัวอย่างตอบความคิดเห็น และตัวเลขที่ควรบันทึก",
  "ตรวจความตรง ความซ้ำ ข้อห้าม และคำกล่าวอ้างเกินจริง",
  "ตรวจและปรับคุณภาพก่อนส่งมอบ",
  "ขอแก้ไขเนื้อหาได้ 1 รอบ",
];

const process = [
  "กรอกข้อมูลผ่านแบบฟอร์ม 3 ขั้นตอน",
  "ตรวจสรุปข้อมูลและสร้างคำสั่งซื้อ",
  "สแกน PromptPay และอัปโหลดสลิปบนเว็บไซต์",
  "ทีมงานตรวจการชำระและอนุมัติ",
  "ระบบสร้างแผนและผ่าน Quality Gate อย่างน้อย 85/100",
  "เปิดลิงก์ส่วนตัวเพื่อรับแผน 7 วัน",
];

export default function PricingPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>ราคา Creator OS · Paid Beta</p>
        <h1 style={titleStyle}>เริ่มจากหนึ่งแผน ก่อนตัดสินใจใช้ต่อสัปดาห์ถัดไป</h1>
        <p style={subtitleStyle}>
          ไม่มีสัญญารายเดือนในช่วงเริ่มต้น ซื้อเป็นรายแผนและใช้ข้อมูลจริงของคุณ
          เพื่อสร้างงานที่นำไปทำได้ทันที
        </p>
      </section>

      <section style={priceCardStyle}>
        <div>
          <p style={planLabelStyle}>แผนคอนเทนต์ 7 วัน Paid Beta</p>
          <div style={priceRowStyle}>
            <strong style={priceStyle}>149 บาท</strong>
            <span style={priceSuffixStyle}>ต่อ 1 แผน</span>
          </div>
          <p style={planTextStyle}>
            ราคาเปิดตัวสำหรับ 90 วันแรก หลังช่วงเปิดตัวราคาพื้นฐานอาจปรับเป็น 299 บาท
            ตามขอบเขตงานและผลตอบรับจริง
          </p>
        </div>
        <Link href="/start" style={primaryLinkStyle}>เริ่มสร้างแผน</Link>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>สิ่งที่รวมอยู่</p>
        <h2 style={sectionTitleStyle}>หนึ่งคำสั่งซื้อครอบคลุมอะไรบ้าง</h2>
        <div style={gridStyle}>
          {included.map((item) => (
            <div key={item} style={itemCardStyle}>
              <span style={checkStyle}>✓</span>
              <p style={itemTextStyle}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={softSectionStyle}>
        <p style={labelStyle}>ขั้นตอนรับแผน</p>
        <h2 style={sectionTitleStyle}>จากแบบฟอร์มไปสู่แผนที่ตรวจแล้ว</h2>
        <div style={processGridStyle}>
          {process.map((item, index) => (
            <article key={item} style={processCardStyle}>
              <span style={numberStyle}>{index + 1}</span>
              <p style={itemTextStyle}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={noticeGridStyle}>
        <article style={noticeCardStyle}>
          <h3 style={noticeTitleStyle}>ไม่รับประกันยอดขายหรือไวรัล</h3>
          <p style={noticeTextStyle}>
            แผนช่วยลดเวลาคิดและเตรียมงาน แต่ผลลัพธ์ขึ้นอยู่กับคุณภาพสินค้า ราคา
            การลงมือทำ บัญชี และกลุ่มผู้ชมจริง
          </p>
        </article>
        <article style={noticeCardStyle}>
          <h3 style={noticeTitleStyle}>ใช้ข้อมูลจริงของลูกค้า</h3>
          <p style={noticeTextStyle}>
            ระบบจะไม่แต่งราคา โปรโมชั่น คุณสมบัติ ผลลัพธ์ หรือหลักฐานแทนลูกค้า
            ข้อมูลเฉพาะต้องกรอกให้ครบก่อนสร้างแผน
          </p>
        </article>
        <article style={noticeCardStyle}>
          <h3 style={noticeTitleStyle}>แนวทางที่ยังไม่รองรับ</h3>
          <p style={noticeTextStyle}>
            ไม่ควรเลือกตัวเลือกใกล้เคียงแล้วฝืนใช้ สามารถแจ้งความต้องการผ่าน LINE
            เพื่อให้เราตรวจและเพิ่มแนวทางมาตรฐานภายหลัง
          </p>
        </article>
      </section>

      <section style={ctaStyle}>
        <h2 style={ctaTitleStyle}>พร้อมลดเวลาคิดคอนเทนต์ตลอด 7 วันหรือยัง</h2>
        <p style={ctaTextStyle}>เริ่มจากหัวข้อหลักหนึ่งเรื่อง แล้วตรวจข้อมูลก่อนชำระเงินได้</p>
        <div style={buttonRowStyle}>
          <Link href="/start" style={primaryLinkStyle}>เริ่มกรอกข้อมูล</Link>
          <Link href="/samples" style={secondaryLinkStyle}>ดูตัวอย่างแผน</Link>
        </div>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = { maxWidth: "1100px", margin: "0 auto", padding: "clamp(16px, 4vw, 28px)", overflowX: "hidden" };
const heroStyle: CSSProperties = { padding: "clamp(32px, 7vw, 60px)", borderRadius: "28px", background: "#111827", color: "white" };
const eyebrowStyle: CSSProperties = { margin: 0, color: "#a5b4fc", fontWeight: 800 };
const titleStyle: CSSProperties = { fontSize: "clamp(34px, 7vw, 54px)", lineHeight: 1.12, margin: "14px 0", maxWidth: "900px" };
const subtitleStyle: CSSProperties = { margin: 0, color: "#d1d5db", lineHeight: 1.8, fontSize: "18px", maxWidth: "800px" };
const priceCardStyle: CSSProperties = { marginTop: "22px", padding: "clamp(24px, 5vw, 38px)", border: "2px solid #4f46e5", borderRadius: "24px", display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "center", background: "white" };
const planLabelStyle: CSSProperties = { margin: 0, color: "#4f46e5", fontWeight: 900 };
const priceRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "baseline", marginTop: "8px" };
const priceStyle: CSSProperties = { fontSize: "clamp(40px, 8vw, 60px)", color: "#111827" };
const priceSuffixStyle: CSSProperties = { color: "#6b7280", fontWeight: 700 };
const planTextStyle: CSSProperties = { color: "#4b5563", lineHeight: 1.7, maxWidth: "680px", margin: "10px 0 0" };
const primaryLinkStyle: CSSProperties = { display: "inline-flex", minHeight: "50px", alignItems: "center", justifyContent: "center", padding: "0 20px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800, textAlign: "center" };
const secondaryLinkStyle: CSSProperties = { ...primaryLinkStyle, background: "white", color: "#4338ca", border: "1px solid #c7d2fe" };
const sectionStyle: CSSProperties = { padding: "clamp(50px, 8vw, 76px) 0" };
const softSectionStyle: CSSProperties = { ...sectionStyle, paddingLeft: "clamp(18px, 4vw, 34px)", paddingRight: "clamp(18px, 4vw, 34px)", background: "#f8fafc", borderRadius: "26px" };
const labelStyle: CSSProperties = { margin: "0 0 8px", color: "#4f46e5", fontWeight: 800 };
const sectionTitleStyle: CSSProperties = { margin: "0 0 24px", fontSize: "clamp(28px, 5vw, 40px)", color: "#111827" };
const gridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "12px" };
const itemCardStyle: CSSProperties = { display: "flex", gap: "10px", alignItems: "flex-start", padding: "16px", borderRadius: "16px", border: "1px solid #e5e7eb", background: "white" };
const checkStyle: CSSProperties = { color: "#16a34a", fontWeight: 900 };
const itemTextStyle: CSSProperties = { margin: 0, color: "#4b5563", lineHeight: 1.7 };
const processGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "14px" };
const processCardStyle: CSSProperties = { display: "flex", gap: "12px", alignItems: "flex-start", padding: "18px", borderRadius: "18px", background: "white", border: "1px solid #e5e7eb" };
const numberStyle: CSSProperties = { display: "inline-flex", width: "34px", height: "34px", borderRadius: "11px", alignItems: "center", justifyContent: "center", background: "#eef2ff", color: "#4338ca", fontWeight: 900, flex: "0 0 auto" };
const noticeGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", gap: "16px", padding: "clamp(50px, 8vw, 76px) 0" };
const noticeCardStyle: CSSProperties = { padding: "22px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "white" };
const noticeTitleStyle: CSSProperties = { margin: "0 0 10px", color: "#111827" };
const noticeTextStyle: CSSProperties = { margin: 0, color: "#4b5563", lineHeight: 1.75 };
const ctaStyle: CSSProperties = { textAlign: "center", padding: "clamp(36px, 7vw, 60px)", borderRadius: "26px", background: "#eef2ff" };
const ctaTitleStyle: CSSProperties = { margin: "0 0 12px", color: "#111827", fontSize: "clamp(28px, 5vw, 40px)" };
const ctaTextStyle: CSSProperties = { margin: 0, color: "#4b5563", lineHeight: 1.7 };
const buttonRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "22px" };
