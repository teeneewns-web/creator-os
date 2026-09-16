import type { CSSProperties } from "react";
import Link from "next/link";

const terms = [
  {
    title: "ขอบเขตของหนึ่งแผน",
    text: "Paid Beta ราคาเปิดตัว 149 บาทต่อ 1 แผนคอนเทนต์ 7 วัน โดยยึดหัวข้อหลัก 1 เรื่อง เป้าหมายหลัก 1 เป้าหมาย และแพลตฟอร์มหลักตามที่เลือกในคำสั่งซื้อ ราคาและขอบเขตอาจปรับในอนาคต แต่คำสั่งซื้อที่ยืนยันแล้วจะยึดข้อมูลของรอบนั้น",
  },
  {
    title: "ข้อมูลที่ลูกค้าให้",
    text: "ลูกค้าควรให้ข้อมูลสินค้า บริการ ราคา โปรโมชั่น ข้อจำกัด และสิ่งที่ห้ามกล่าวอ้างตามความจริง Creator OS จะไม่ตั้งใจแต่งข้อมูลเฉพาะที่ลูกค้าไม่ได้ให้ และลูกค้าควรตรวจข้อเท็จจริงของธุรกิจก่อนเผยแพร่",
  },
  {
    title: "การชำระและการอนุมัติ",
    text: "ลูกค้าชำระผ่าน PromptPay ตามยอดที่แสดงและอัปโหลดสลิปบนเว็บไซต์ การส่งรูปสลิปยังไม่ถือว่าส่งมอบงานจนกว่าผู้ดูแลจะตรวจยอดเงินจริง ระบบสร้างแผนผ่านเกณฑ์คุณภาพ และทีมเปิดอ่านแผนก่อนกดส่งมอบ",
  },
  {
    title: "คุณภาพและการแก้ไข",
    text: "ระบบตรวจ Quality, Reality, Constraint และความซ้ำก่อนเข้าสู่ Human Review ทีมเปิดอ่านแผนจริงก่อนส่งมอบ Paid Beta ขอแก้ไขได้ 1 รอบจากหน้าแผน โดยแผนเดิมยังใช้ได้ระหว่างรอ หากเปลี่ยนหัวข้อหลัก เป้าหมาย หรือประเภทงานเป็นคนละชุด จะถือเป็นแผนใหม่",
  },
  {
    title: "สัปดาห์ถัดไป",
    text: "การสร้างสัปดาห์ถัดไปเป็นคำสั่งซื้อใหม่ ระบบสามารถดึงข้อมูลจากแผนเดิมและตรวจความซ้ำกับประวัติก่อนส่งมอบ แต่เนื่องจากยังอยู่ในหัวข้อหรือแบรนด์เดิม อาจมีคำหลักหรือพื้นฐานบางส่วนที่จำเป็นต้องกล่าวซ้ำ",
  },
  {
    title: "ผลลัพธ์ทางธุรกิจและแพลตฟอร์ม",
    text: "Creator OS ช่วยลดเวลาคิดและเตรียมคอนเทนต์ แต่ไม่รับประกันยอดขาย ยอดวิว ผู้ติดตาม การเป็นไวรัล หรือผลลัพธ์จากอัลกอริทึม เพราะผลจริงขึ้นอยู่กับสินค้า ราคา บัญชี คุณภาพการผลิต การลงมือทำ และผู้ชม",
  },
  {
    title: "การใช้งานอย่างเหมาะสม",
    text: "ผู้ใช้ต้องไม่ใช้แผนเพื่อหลอกลวง สแปม ละเมิดสิทธิผู้อื่น หรือเผยแพร่คำกล่าวอ้างที่ผิดกฎหมาย ผู้ใช้ยังเป็นผู้ตัดสินใจสุดท้ายก่อนโพสต์เนื้อหาบนบัญชีของตน",
  },
  {
    title: "ลิงก์ส่วนตัวและการติดต่อ",
    text: "ลิงก์คำสั่งซื้อและคีย์เข้าถึงแผนควรเก็บเป็นส่วนตัว หากพบปัญหาเกี่ยวกับคำสั่งซื้อ การเข้าถึงแผน หรือการขอแก้ไข ให้ติดต่อ Creator OS พร้อมรหัสคำสั่งซื้อโดยไม่ส่งรหัสผ่านหรือข้อมูลธนาคารที่ไม่จำเป็น",
  },
];

export default function TermsPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>เงื่อนไขการใช้งาน · Paid Beta</p>
        <h1 style={titleStyle}>รู้ขอบเขตการซื้อ การรับแผน และการใช้ต่อก่อนชำระเงิน</h1>
        <p style={subtitleStyle}>
          เงื่อนไขนี้อธิบายบริการ Creator OS รุ่นปัจจุบัน: แผนคอนเทนต์เฉพาะบุคคล 7 วัน ชำระเป็นรายแผน และตรวจคุณภาพก่อนเปิดให้ลูกค้า
        </p>
        <div style={buttonRowStyle}>
          <Link href="/privacy" style={secondaryLinkStyle}>นโยบายความเป็นส่วนตัว</Link>
          <Link href="/pricing" style={secondaryLinkStyle}>ราคาและขอบเขต</Link>
          <Link href="/start" style={primaryLinkStyle}>เริ่มสร้างแผน</Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <strong>สรุปสั้น ๆ</strong>
        <p style={noticeTextStyle}>จ่ายเป็นรายแผน · ใช้ข้อมูลจริงของลูกค้า · ตรวจคุณภาพก่อนเปิด · ขอแก้ไขได้ 1 รอบในขอบเขตเดิม · ไม่รับประกันยอดขายหรือไวรัล</p>
      </section>

      <section style={sectionListStyle}>
        {terms.map((term, index) => (
          <article key={term.title} style={sectionStyle}>
            <p style={numberStyle}>ข้อที่ {index + 1}</p>
            <h2 style={sectionTitleStyle}>{term.title}</h2>
            <p style={termTextStyle}>{term.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = { maxWidth: "1000px", margin: "0 auto", padding: "24px" };
const heroStyle: CSSProperties = { padding: "42px 24px", borderRadius: "28px", background: "#111827", color: "white" };
const labelStyle: CSSProperties = { color: "#a5b4fc", fontWeight: 800, margin: 0 };
const titleStyle: CSSProperties = { fontSize: "clamp(32px, 6vw, 46px)", lineHeight: 1.12, margin: "12px 0" };
const subtitleStyle: CSSProperties = { color: "#d1d5db", fontSize: "18px", lineHeight: 1.8, maxWidth: "820px" };
const buttonRowStyle: CSSProperties = { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" };
const primaryLinkStyle: CSSProperties = { padding: "12px 18px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: CSSProperties = { padding: "12px 18px", borderRadius: "14px", background: "white", color: "#111827", textDecoration: "none", fontWeight: 800 };
const noticeStyle: CSSProperties = { marginTop: "22px", padding: "20px", borderRadius: "20px", background: "#ecfdf5", border: "1px solid #a7f3d0" };
const noticeTextStyle: CSSProperties = { margin: "8px 0 0", color: "#374151", lineHeight: 1.75 };
const sectionListStyle: CSSProperties = { display: "grid", gap: "16px", marginTop: "22px" };
const sectionStyle: CSSProperties = { padding: "22px", borderRadius: "20px", background: "white", border: "1px solid #e5e7eb" };
const numberStyle: CSSProperties = { margin: 0, color: "#4f46e5", fontWeight: 900 };
const sectionTitleStyle: CSSProperties = { margin: "6px 0", fontSize: "22px" };
const termTextStyle: CSSProperties = { margin: 0, color: "#374151", lineHeight: 1.8 };
