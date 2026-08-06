import type { CSSProperties } from "react";
import Link from "next/link";

const deliverables = [
  "หัวข้อและเป้าหมายของคอนเทนต์แต่ละวัน",
  "Hook บทพูด หรือบทเต็มพร้อมใช้",
  "ลำดับการถ่าย มุมกล้อง และข้อความบนหน้าจอ",
  "Caption, CTA และ Hashtags",
  "สิ่งที่ต้องเตรียมและเวลาที่ควรใช้",
  "แผนสำรองเมื่อทำตามแผนหลักไม่ได้",
  "งานหลังโพสต์และตัวอย่างตอบความคิดเห็น",
  "ตัวเลขที่ควรบันทึกเพื่อวางแผนสัปดาห์ถัดไป",
];

const audiences = [
  {
    title: "ผู้ขายสินค้า",
    text: "ได้คอนเทนต์ที่อิงสินค้า จุดเด่น กลุ่มลูกค้า เป้าหมาย และข้อจำกัดจริง",
  },
  {
    title: "ผู้ให้บริการ",
    text: "ได้แผนสร้างความเชื่อใจ อธิบายบริการ แสดงผลงาน และเพิ่มการจองหรือการทักแชต",
  },
  {
    title: "ครีเอเตอร์",
    text: "เลือกทิศทางได้ชัด เช่น หนังสั้น ตลก รีวิว ให้ความรู้ เล่าเรื่อง เกม เพลง หรือไลฟ์สไตล์",
  },
];

const steps = [
  {
    no: "1",
    title: "ตอบคำถาม 3 ขั้นตอน",
    text: "เลือกประเภท ทิศทาง เป้าหมาย ผู้ชม เวลา และสิ่งที่ต้องการให้ระบบช่วย",
  },
  {
    no: "2",
    title: "สร้างคำสั่งซื้อและแจ้งชำระ",
    text: "ตรวจข้อมูลก่อนยืนยัน แล้วส่งรหัสคำสั่งซื้อพร้อมหลักฐานผ่าน LINE",
  },
  {
    no: "3",
    title: "ตรวจและสร้างแผน",
    text: "ระบบตรวจความตรง ความซ้ำ ความเป็นไปได้ และ Quality Gate ก่อนเปิดแผน",
  },
  {
    no: "4",
    title: "รับแผนพร้อมทำ 7 วัน",
    text: "เปิดดูทีละวัน ทำตามลำดับ และบันทึกผลเพื่อใช้ต่อยอดสัปดาห์ถัดไป",
  },
];

export default function HomePage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <div style={heroContentStyle}>
          <p style={eyebrowStyle}>Creator OS · Paid Beta</p>
          <h1 style={heroTitleStyle}>
            กรอกข้อมูลครั้งเดียว<br />
            ได้แผนคอนเทนต์ 7 วันพร้อมทำจริง
          </h1>
          <p style={heroTextStyle}>
            ไม่ต้องคิดหัวข้อ เขียน Prompt ประกอบบท หรือเดาว่าวันนี้ควรโพสต์อะไร
            ระบบจะวางแผนจากเป้าหมาย ผู้ชม เวลา ความสามารถ และข้อจำกัดของคุณ
          </p>

          <div style={pillRowStyle}>
            <span style={pillStyle}>สินค้า · บริการ · ครีเอเตอร์</span>
            <span style={pillStyle}>ตรวจคุณภาพก่อนเปิดแผน</span>
            <span style={pillStyle}>ขอแก้ไขได้ 1 รอบ</span>
          </div>

          <div style={buttonRowStyle}>
            <Link href="/start" style={primaryLinkStyle}>
              เริ่มสร้างแผน 149 บาท
            </Link>
            <Link href="/samples" style={secondaryLinkStyle}>
              ดูตัวอย่างแผน
            </Link>
          </div>

          <p style={smallNoteStyle}>
            ราคาเปิดตัว 149 บาทต่อ 1 แผน · ไม่มีค่าสมาชิกรายเดือน
          </p>
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={labelStyle}>สิ่งที่ลูกค้าได้รับ</p>
          <h2 style={sectionTitleStyle}>
            ไม่ใช่รายการไอเดีย แต่เป็นงานที่หยิบไปทำได้ทันที
          </h2>
          <p style={sectionTextStyle}>
            Creator OS ทำส่วนที่ลูกค้าไม่รู้ว่าจะเริ่มอย่างไร ไม่มีเวลาทำ
            หรือไม่อยากเสียเวลาประกอบเอง ให้กลายเป็นแผนที่มีลำดับและเหตุผล
          </p>
        </div>

        <div style={deliverableGridStyle}>
          {deliverables.map((item) => (
            <div key={item} style={deliverableCardStyle}>
              <span style={checkStyle}>✓</span>
              <p style={cardTextStyle}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={softSectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={labelStyle}>รองรับใครบ้าง</p>
          <h2 style={sectionTitleStyle}>เลือกทิศทางก่อน ระบบจึงไม่ตีความผิด</h2>
          <p style={sectionTextStyle}>
            คำถามในแบบฟอร์มจะเปลี่ยนตามประเภทที่เลือก
            และแยกความต้องการของผู้สร้างออกจากสิ่งที่ผู้ชมต้องการดู
          </p>
        </div>

        <div style={threeGridStyle}>
          {audiences.map((item) => (
            <article key={item.title} style={audienceCardStyle}>
              <h3 style={cardTitleStyle}>{item.title}</h3>
              <p style={cardTextStyle}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeadingStyle}>
          <p style={labelStyle}>ขั้นตอนใช้งาน</p>
          <h2 style={sectionTitleStyle}>จากข้อมูลของคุณไปสู่แผนที่ตรวจแล้ว</h2>
        </div>

        <div style={stepGridStyle}>
          {steps.map((step) => (
            <article key={step.no} style={stepCardStyle}>
              <span style={stepNumberStyle}>{step.no}</span>
              <h3 style={cardTitleStyle}>{step.title}</h3>
              <p style={cardTextStyle}>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={qualitySectionStyle}>
        <div>
          <p style={qualityLabelStyle}>มาตรฐานก่อนส่งมอบ</p>
          <h2 style={qualityTitleStyle}>แผนต้องผ่าน Quality Gate อย่างน้อย 85/100</h2>
          <p style={qualityTextStyle}>
            ระบบตรวจความครบ 7 วัน ความตรงกับเจตนา ความซ้ำ เวลา ความสามารถ
            CTA ข้อห้าม และข้อความกล่าวอ้างเกินจริง ถ้ามีข้อผิดพลาดสำคัญจะยังไม่เปิดแผน
          </p>
        </div>
        <Link href="/quality" style={qualityLinkStyle}>
          ดูมาตรฐานคุณภาพ
        </Link>
      </section>

      <section style={ctaSectionStyle}>
        <p style={labelStyle}>เริ่มจากหนึ่งแผน</p>
        <h2 style={ctaTitleStyle}>ให้ระบบทำส่วนที่คุณคิดไม่ออกให้เสร็จก่อน</h2>
        <p style={ctaTextStyle}>
          ใช้สินค้า บริการ หรือหัวข้อหลัก 1 รายการ เป้าหมายหลัก 1 เป้าหมาย
          และแพลตฟอร์มหลักตามที่เลือก
        </p>
        <div style={buttonRowCenterStyle}>
          <Link href="/start" style={primaryLinkStyle}>
            เริ่มกรอกข้อมูล
          </Link>
          <Link href="/pricing" style={secondaryLinkStyle}>
            ดูรายละเอียดราคา
          </Link>
        </div>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "clamp(16px, 4vw, 28px)",
  overflowX: "hidden",
};

const heroStyle: CSSProperties = {
  borderRadius: "30px",
  background: "linear-gradient(135deg, #111827 0%, #312e81 55%, #4f46e5 100%)",
  color: "white",
  padding: "clamp(34px, 8vw, 74px) clamp(20px, 6vw, 64px)",
};

const heroContentStyle: CSSProperties = { maxWidth: "850px" };
const eyebrowStyle: CSSProperties = { margin: 0, color: "#c7d2fe", fontWeight: 800, letterSpacing: "0.04em" };
const heroTitleStyle: CSSProperties = { fontSize: "clamp(36px, 8vw, 64px)", lineHeight: 1.08, margin: "16px 0", letterSpacing: "-0.03em" };
const heroTextStyle: CSSProperties = { fontSize: "clamp(17px, 3vw, 21px)", lineHeight: 1.8, color: "#e5e7eb", margin: 0, maxWidth: "760px" };
const pillRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "9px", marginTop: "24px" };
const pillStyle: CSSProperties = { border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", borderRadius: "999px", padding: "8px 12px", fontSize: "14px", fontWeight: 700 };
const buttonRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "30px" };
const buttonRowCenterStyle: CSSProperties = { ...buttonRowStyle, justifyContent: "center" };
const primaryLinkStyle: CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "50px", padding: "0 20px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800, textAlign: "center" };
const secondaryLinkStyle: CSSProperties = { ...primaryLinkStyle, background: "white", color: "#312e81", border: "1px solid #c7d2fe" };
const smallNoteStyle: CSSProperties = { margin: "14px 0 0", color: "#cbd5e1", fontSize: "14px" };
const sectionStyle: CSSProperties = { padding: "clamp(54px, 8vw, 82px) 0" };
const softSectionStyle: CSSProperties = { ...sectionStyle, background: "#f8fafc", borderRadius: "28px", paddingLeft: "clamp(18px, 4vw, 36px)", paddingRight: "clamp(18px, 4vw, 36px)" };
const sectionHeadingStyle: CSSProperties = { maxWidth: "820px", marginBottom: "28px" };
const labelStyle: CSSProperties = { color: "#4f46e5", fontWeight: 800, margin: "0 0 8px" };
const sectionTitleStyle: CSSProperties = { fontSize: "clamp(28px, 5vw, 42px)", lineHeight: 1.2, margin: "0 0 14px", color: "#111827" };
const sectionTextStyle: CSSProperties = { color: "#4b5563", lineHeight: 1.8, margin: 0, fontSize: "17px" };
const deliverableGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "12px" };
const deliverableCardStyle: CSSProperties = { display: "flex", gap: "10px", alignItems: "flex-start", border: "1px solid #e5e7eb", borderRadius: "16px", padding: "16px", background: "white" };
const checkStyle: CSSProperties = { color: "#16a34a", fontWeight: 900, flex: "0 0 auto" };
const cardTextStyle: CSSProperties = { color: "#4b5563", lineHeight: 1.7, margin: 0 };
const threeGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "16px" };
const audienceCardStyle: CSSProperties = { background: "white", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "22px" };
const cardTitleStyle: CSSProperties = { margin: "0 0 10px", color: "#111827", fontSize: "20px" };
const stepGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: "16px" };
const stepCardStyle: CSSProperties = { border: "1px solid #e5e7eb", borderRadius: "20px", padding: "22px", background: "white" };
const stepNumberStyle: CSSProperties = { display: "inline-flex", width: "36px", height: "36px", borderRadius: "12px", alignItems: "center", justifyContent: "center", background: "#eef2ff", color: "#4338ca", fontWeight: 900, marginBottom: "14px" };
const qualitySectionStyle: CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px", padding: "clamp(28px, 6vw, 48px)", borderRadius: "28px", background: "#111827", color: "white" };
const qualityLabelStyle: CSSProperties = { margin: 0, color: "#a5b4fc", fontWeight: 800 };
const qualityTitleStyle: CSSProperties = { fontSize: "clamp(27px, 5vw, 40px)", lineHeight: 1.2, margin: "10px 0" };
const qualityTextStyle: CSSProperties = { color: "#d1d5db", lineHeight: 1.8, margin: 0, maxWidth: "780px" };
const qualityLinkStyle: CSSProperties = { ...primaryLinkStyle, background: "white", color: "#111827" };
const ctaSectionStyle: CSSProperties = { ...sectionStyle, textAlign: "center", maxWidth: "850px", margin: "0 auto" };
const ctaTitleStyle: CSSProperties = { ...sectionTitleStyle, marginLeft: "auto", marginRight: "auto" };
const ctaTextStyle: CSSProperties = { ...sectionTextStyle, maxWidth: "720px", margin: "0 auto" };
