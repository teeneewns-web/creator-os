import type { CSSProperties } from "react";
import Link from "next/link";

type FAQItem = { question: string; answer: string };
type FAQSection = { title: string; items: FAQItem[] };

const sections: FAQSection[] = [
  {
    title: "ก่อนสั่งซื้อ",
    items: [
      {
        question: "Creator OS คืออะไร?",
        answer: "Creator OS คือบริการสร้างแผนคอนเทนต์ 7 วันจากข้อมูลจริงของลูกค้า โดยจัดหัวข้อ บทพูดหรือลำดับฉาก ลำดับการถ่าย Caption CTA แผนสำรอง และงานหลังโพสต์ให้พร้อมทำตามได้ทันที",
      },
      {
        question: "เหมาะกับใคร?",
        answer: "เหมาะกับผู้ขายสินค้า ผู้ให้บริการ ร้านขนาดเล็ก TikTok Affiliate เจ้าของเพจ และครีเอเตอร์ เช่น หนังสั้น ตลก รีวิว ให้ความรู้ เกม เพลง หรือไลฟ์สไตล์",
      },
      {
        question: "ต้องมีประสบการณ์ทำคอนเทนต์หรือไม่?",
        answer: "ไม่จำเป็น แบบฟอร์มจะให้เลือกทิศทาง เป้าหมาย เวลา ความสามารถ และสิ่งที่ต้องการให้ระบบช่วย จากนั้นแผนจะปรับระดับงานให้เหมาะกับข้อมูลที่กรอก",
      },
      {
        question: "ถ้าไม่มีแนวทางที่ต้องการในตัวเลือกควรทำอย่างไร?",
        answer: "ไม่ควรเลือกแนวทางที่ใกล้เคียงแต่ไม่ตรง ให้กดแจ้งขอเพิ่มแนวทางผ่าน LINE เพื่อให้เราตรวจว่าควรเพิ่มเป็นแนวมาตรฐานหรือรับเป็นงานเฉพาะ",
      },
    ],
  },
  {
    title: "การสั่งซื้อและรับแผน",
    items: [
      {
        question: "ราคาเท่าไร?",
        answer: "Paid Beta ราคาเปิดตัว 149 บาทต่อ 1 แผน ไม่มีค่าสมาชิกรายเดือน โดยหนึ่งแผนครอบคลุมหัวข้อหลัก 1 เรื่อง เป้าหมายหลัก 1 เป้าหมาย และแพลตฟอร์มหลักตามที่เลือก",
      },
      {
        question: "ชำระเงินอย่างไร?",
        answer: "กรอกข้อมูลและตรวจสรุปก่อนสร้างคำสั่งซื้อ จากนั้นสแกน PromptPay และอัปโหลดสลิปบนเว็บไซต์ ผู้ดูแลจะตรวจสลิปกับยอดเงินจริง ระบบจึงสร้างแผนและผ่าน Quality Gate ก่อนให้ทีมเปิดอ่านแผนจริงเพื่อส่งมอบ ไม่ต้องส่งสลิปผ่าน LINE",
      },
      {
        question: "ได้รับแผนที่ไหน?",
        answer: "หลังทีมตรวจแผนและกดส่งมอบ ระบบจะเปิดลิงก์ส่วนตัวของคำสั่งซื้อและพาไปยังหน้าแผน 7 วัน ลิงก์นี้ควรเก็บเป็นส่วนตัวเพราะใช้เข้าถึงข้อมูลของลูกค้า",
      },
      {
        question: "ขอแก้ไขได้หรือไม่?",
        answer: "Paid Beta ขอแก้ไขเนื้อหาได้ 1 รอบจากหน้าแผนเดิม โดยแผนเดิมยังเปิดใช้ได้ระหว่างรอ ทีมจะสร้างเวอร์ชันแก้ไขและเปิดอ่านอีกครั้งก่อนส่งมอบ หากเปลี่ยนหัวข้อหลัก เป้าหมาย หรือประเภทงานเป็นคนละชุด จะถือเป็นแผนใหม่",
      },
    ],
  },
  {
    title: "คุณภาพและความเฉพาะบุคคล",
    items: [
      {
        question: "แผนสร้างจากข้อมูลของฉันจริงหรือไม่?",
        answer: "ใช่ ระบบใช้ประเภทงาน ทิศทาง ผู้ชม เป้าหมาย สิ่งที่ต้องการให้ผู้ชมทำ น้ำเสียง เวลา ความสามารถ ข้อจำกัด และข้อห้ามที่ลูกค้าเลือกหรือกรอก",
      },
      {
        question: "Quality Gate ตรวจอะไร?",
        answer: "ตรวจความครบ 7 วัน ความตรงกับเจตนา ความพร้อมใช้งาน ความแตกต่างของแต่ละวัน เวลา ความสามารถ CTA ข้อห้าม ข้อความกล่าวอ้างเกินจริง และแผนสำรอง โดยต้องได้อย่างน้อย 85/100 และไม่มีข้อผิดพลาดปิดกั้น",
      },
      {
        question: "ระบบจะแต่งราคา โปรโมชั่น หรือผลลัพธ์ให้หรือไม่?",
        answer: "ไม่แต่งข้อมูลที่ลูกค้าไม่ได้ระบุ หากรายละเอียดสำคัญไม่ครบ ระบบควรใช้ภาษากลางหรือแจ้งให้ตรวจสอบแทนการสร้างข้อเท็จจริงขึ้นเอง",
      },
      {
        question: "รับประกันยอดขายหรือการเป็นไวรัลหรือไม่?",
        answer: "ไม่รับประกัน แผนช่วยลดเวลาคิดและจัดงานให้เป็นระบบ แต่ผลลัพธ์ขึ้นอยู่กับสินค้า ราคา การถ่าย การตัดต่อ การลงมือทำ บัญชี และผู้ชมจริง",
      },
    ],
  },
  {
    title: "การใช้ต่อสัปดาห์ถัดไป",
    items: [
      {
        question: "ซื้อแผนใหม่ทุกสัปดาห์ได้หรือไม่?",
        answer: "ได้ หลังเปิดแผนจะมีปุ่มสร้างสัปดาห์ถัดไป ระบบดึงข้อมูลเดิมมาให้และเชื่อมรอบแผนอัตโนมัติ จากนั้นตรวจทั้งลายนิ้วมือและความคล้ายเชิงความหมายกับสัปดาห์ก่อน ๆ ก่อนเปิดแผนใหม่",
      },
      {
        question: "ควรเก็บผลลัพธ์อะไรหลังโพสต์?",
        answer: "ควรบันทึก Reach การรับชม ความคิดเห็น การแชร์ การบันทึก การคลิก และข้อความที่ได้รับ เพื่อใช้ตัดสินว่าควรทำซ้ำ ปรับ หรือหยุดอะไรในสัปดาห์ถัดไป",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={eyebrowStyle}>คำถามที่พบบ่อย</p>
        <h1 style={titleStyle}>รู้ขอบเขตและขั้นตอนก่อนสั่งแผน Creator OS</h1>
        <p style={subtitleStyle}>
          คำตอบด้านล่างยึดตามบริการ Paid Beta ปัจจุบัน ไม่ใช่ระบบสมาชิกหรือคลังข้อความสำเร็จรูป
        </p>
      </section>

      <div style={sectionWrapStyle}>
        {sections.map((section) => (
          <section key={section.title} style={sectionStyle}>
            <h2 style={sectionTitleStyle}>{section.title}</h2>
            <div style={faqGridStyle}>
              {section.items.map((item) => (
                <article key={item.question} style={faqCardStyle}>
                  <h3 style={questionStyle}>{item.question}</h3>
                  <p style={answerStyle}>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section style={ctaStyle}>
        <h2 style={ctaTitleStyle}>คำถามของคุณยังไม่มีคำตอบ?</h2>
        <p style={ctaTextStyle}>หากมีคำถามหรือพบปัญหา ติดต่อทีมงานผ่านหน้าติดต่อ หรือเริ่มกรอกข้อมูลเพื่อดูรายละเอียดในแบบฟอร์ม</p>
        <div style={buttonRowStyle}>
          <Link href="/contact" style={secondaryLinkStyle}>ติดต่อเรา</Link>
          <Link href="/start" style={primaryLinkStyle}>เริ่มสร้างแผน</Link>
        </div>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = { maxWidth: "1050px", margin: "0 auto", padding: "clamp(16px, 4vw, 28px)", overflowX: "hidden" };
const heroStyle: CSSProperties = { padding: "clamp(30px, 7vw, 56px)", borderRadius: "28px", background: "#111827", color: "white" };
const eyebrowStyle: CSSProperties = { margin: 0, color: "#a5b4fc", fontWeight: 800 };
const titleStyle: CSSProperties = { margin: "12px 0", fontSize: "clamp(34px, 7vw, 52px)", lineHeight: 1.14 };
const subtitleStyle: CSSProperties = { margin: 0, color: "#d1d5db", lineHeight: 1.8, fontSize: "18px" };
const sectionWrapStyle: CSSProperties = { display: "grid", gap: "26px", padding: "clamp(46px, 8vw, 76px) 0" };
const sectionStyle: CSSProperties = { display: "grid", gap: "16px" };
const sectionTitleStyle: CSSProperties = { margin: 0, color: "#111827", fontSize: "clamp(26px, 5vw, 36px)" };
const faqGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: "14px" };
const faqCardStyle: CSSProperties = { padding: "22px", borderRadius: "20px", border: "1px solid #e5e7eb", background: "white" };
const questionStyle: CSSProperties = { margin: "0 0 10px", color: "#111827", fontSize: "19px" };
const answerStyle: CSSProperties = { margin: 0, color: "#4b5563", lineHeight: 1.8 };
const ctaStyle: CSSProperties = { textAlign: "center", padding: "clamp(32px, 6vw, 50px)", borderRadius: "24px", background: "#eef2ff" };
const ctaTitleStyle: CSSProperties = { margin: "0 0 10px", color: "#111827", fontSize: "clamp(27px, 5vw, 38px)" };
const ctaTextStyle: CSSProperties = { margin: 0, color: "#4b5563", lineHeight: 1.7 };
const buttonRowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginTop: "22px" };
const primaryLinkStyle: CSSProperties = { display: "inline-flex", minHeight: "48px", alignItems: "center", justifyContent: "center", padding: "0 18px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: CSSProperties = { ...primaryLinkStyle, background: "white", color: "#4338ca", border: "1px solid #c7d2fe" };
