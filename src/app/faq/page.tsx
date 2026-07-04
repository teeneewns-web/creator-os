import type { CSSProperties } from "react";
import Link from "next/link";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSection = {
  title: string;
  description: string;
  items: FAQItem[];
};

const faqSections: FAQSection[] = [
  {
    title: "คำถามพื้นฐาน",
    description: "คำถามสำหรับคนที่เพิ่งเข้ามาใช้ Creator OS ครั้งแรก",
    items: [
      {
        question: "Creator OS คืออะไร?",
        answer:
          "Creator OS คือระบบช่วยทำคอนเทนต์สำหรับคนที่ไม่อยากเริ่มจากหน้าว่าง มีคลัง Hook, แคปชัน, CTA, สคริปต์, ระบบบันทึกไอเดีย, หน้าตรวจคุณภาพ และแผนทำงานรายวัน",
      },
      {
        question: "เว็บนี้เหมาะกับใคร?",
        answer:
          "เหมาะกับ Creator มือใหม่ เจ้าของเพจ เจ้าของร้านออนไลน์ คนทำ TikTok, Reels, Shorts, ฟรีแลนซ์ และคนที่ต้องทำคอนเทนต์สม่ำเสมอ",
      },
      {
        question: "ต้องมีประสบการณ์ทำคอนเทนต์ก่อนไหม?",
        answer:
          "ไม่จำเป็น เว็บนี้ออกแบบให้คนเริ่มต้นใช้งานได้ โดยเริ่มจากหน้า ภารกิจวันนี้ แล้วค่อยใช้คลัง Hook และหน้าค้นหาเพื่อหาไอเดียเพิ่มเติม",
      },
    ],
  },
  {
    title: "การใช้งาน",
    description: "วิธีใช้งานส่วนหลักของระบบ",
    items: [
      {
        question: "ควรเริ่มจากหน้าไหน?",
        answer:
          "ถ้ายังไม่รู้จะเริ่มตรงไหน แนะนำให้เริ่มจากหน้า ภารกิจวันนี้ เพราะหน้านั้นจะบอกเป็นขั้นตอนว่าวันนี้ควรทำอะไร เลือก Hook เขียนร่าง ตรวจคุณภาพ และบันทึกผลลัพธ์",
      },
      {
        question: "Hook คืออะไร?",
        answer:
          "Hook คือประโยคเปิดที่ใช้ดึงความสนใจ เช่น ประโยคเปิดคลิป ประโยคแรกของโพสต์ หรือข้อความที่ทำให้คนหยุดอ่านและอยากดูต่อ",
      },
      {
        question: "CTA คืออะไร?",
        answer:
          "CTA คือคำชวนให้ผู้ชมทำบางอย่างต่อ เช่น กดติดตาม บันทึกโพสต์ ทักแชต คลิกดูสินค้า สมัคร หรือซื้อสินค้า",
      },
      {
        question: "บันทึกไอเดียไว้แล้วไปดูที่ไหน?",
        answer:
          "ไอเดียที่กดบันทึกไว้จะอยู่ที่หน้า บันทึกไว้ หรือ /favorites สามารถกลับมาคัดลอกและนำไปใช้ต่อได้",
      },
    ],
  },
  {
    title: "คุณภาพเนื้อหา",
    description: "คำถามเกี่ยวกับการคัดคุณภาพ Hook และคอนเทนต์",
    items: [
      {
        question: "ระบบตรวจคุณภาพ Hook ใช้ทำอะไร?",
        answer:
          "ใช้ดูว่า Hook ไหนพร้อมใช้ Hook ไหนเหมาะกับระดับ Pro หรือพรีเมียม และ Hook ไหนควรเขียนใหม่ก่อนนำไปขายหรือใช้จริง",
      },
      {
        question: "Premium-ready หมายถึงอะไร?",
        answer:
          "หมายถึง Hook หรือคอนเทนต์ที่มีคุณภาพสูงพอสำหรับนำไปอยู่ในแพ็กพรีเมียม เช่น มีมุมชัด เจาะปัญหาคนดู ใช้งานจริงได้ และไม่กว้างเกินไป",
      },
      {
        question: "ถ้า Hook ถูกจัดว่า needs rewrite ต้องทำยังไง?",
        answer:
          "ควรปรับให้เฉพาะเจาะจงขึ้น เช่น เพิ่มกลุ่มเป้าหมาย เพิ่มปัญหา เพิ่มสถานการณ์จริง หรือทำให้ประโยคเปิดมีแรงดึงดูดมากกว่าเดิม",
      },
    ],
  },
  {
    title: "Free / Pro / Premium",
    description: "คำถามเกี่ยวกับการใช้งานฟรีและแพ็กจ่ายเงิน",
    items: [
      {
        question: "ใช้ฟรีได้ไหม?",
        answer:
          "แนวคิดของเว็บคือให้ผู้ใช้เริ่มใช้ฟรีก่อน เพื่อทดลองดูคุณค่าและเข้าใจระบบ ก่อนตัดสินใจอัปเกรดเป็น Pro หรือพรีเมียมในอนาคต",
      },
      {
        question: "Free กับ Premium ต่างกันยังไง?",
        answer:
          "Free เหมาะสำหรับทดลองและใช้ตัวอย่างพื้นฐาน ส่วน Premium ควรเป็นเนื้อหาที่คัดคุณภาพสูงกว่า ใช้งานจริงได้มากกว่า และประหยัดเวลาผู้ใช้มากกว่า",
      },
      {
        question: "ตอนนี้จำเป็นต้องมีระบบจ่ายเงินเลยไหม?",
        answer:
          "ยังไม่จำเป็น ขั้นแรกควรทำให้เว็บน่าใช้ เข้าใจง่าย มีข้อมูลคุณภาพ และทำให้ผู้ใช้เห็นคุณค่าก่อน หลังจากนั้นค่อยเพิ่มระบบสมาชิกหรือระบบชำระเงิน",
      },
    ],
  },
];

function getTotalQuestions() {
  return faqSections.reduce((sum, section) => sum + section.items.length, 0);
}

export default function FAQPage() {
  const totalQuestions = getTotalQuestions();

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>คำถามที่พบบ่อย</p>

        <h1 style={titleStyle}>ตอบข้อสงสัยก่อนเริ่มใช้ Creator OS</h1>

        <p style={subtitleStyle}>
          รวมคำถามสำคัญเกี่ยวกับการใช้งาน Creator OS เช่น เว็บนี้คืออะไร
          เหมาะกับใคร ใช้ Hook ยังไง Premium ต่างจาก Free ยังไง
          และควรเริ่มใช้งานจากหน้าไหน
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/about">
            <button style={secondaryButtonStyle}>เกี่ยวกับเว็บ</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>จำนวนคำถาม</p>
          <h2 style={summaryNumberStyle}>{totalQuestions}</h2>
          <p style={mutedTextStyle}>คำถามหลักที่ผู้ใช้มักสงสัย</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>หมวดคำถาม</p>
          <h2 style={summaryNumberStyle}>{faqSections.length}</h2>
          <p style={mutedTextStyle}>แบ่งเป็นพื้นฐาน ใช้งาน คุณภาพ และแพ็กเกจ</p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>เป้าหมาย</p>
          <h2 style={summaryTitleStyle}>ลดความลังเล</h2>
          <p style={mutedTextStyle}>
            ทำให้ผู้ใช้เข้าใจเว็บเร็วขึ้น และกล้าลองใช้งานมากขึ้น
          </p>
        </article>
      </section>

      <section style={sectionListStyle}>
        {faqSections.map((section, sectionIndex) => (
          <section key={section.title} style={sectionStyle}>
            <div style={sectionTopRowStyle}>
              <div>
                <p style={labelStyle}>หมวดที่ {sectionIndex + 1}</p>

                <h2 style={{ margin: "6px 0" }}>{section.title}</h2>

                <p style={mutedTextStyle}>{section.description}</p>
              </div>

              <span style={countBadgeStyle}>{section.items.length} คำถาม</span>
            </div>

            <div style={faqGridStyle}>
              {section.items.map((item, itemIndex) => (
                <article key={item.question} style={faqCardStyle}>
                  <p style={questionNumberStyle}>
                    คำถามที่ {itemIndex + 1}
                  </p>

                  <h3 style={questionStyle}>{item.question}</h3>

                  <p style={answerStyle}>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ยังไม่รู้จะเริ่มตรงไหน?</h2>

        <p style={bottomTextStyle}>
          เริ่มจากหน้า ภารกิจวันนี้ แล้วทำตามขั้นตอนในระบบ
          จากนั้นค่อยเปิดคลัง Hook หรือหน้าค้นหาเพื่อหาไอเดียเพิ่มเติม
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/dashboard">
            <button style={darkButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/hooks">
            <button style={darkSecondaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>

          <Link href="/quality/hooks">
            <button style={darkSecondaryButtonStyle}>ตรวจคุณภาพ Hook</button>
          </Link>
        </div>
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

const titleStyle: CSSProperties = {
  fontSize: "46px",
  lineHeight: "1.12",
  margin: "12px 0",
  maxWidth: "920px",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "850px",
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

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
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

const summaryTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "26px",
};

const mutedTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
  margin: 0,
};

const sectionListStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
  marginTop: "24px",
};

const sectionStyle: CSSProperties = {
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

const countBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
};

const faqGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const faqCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const questionNumberStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const questionStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: "1.4",
  margin: "8px 0",
};

const answerStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  marginBottom: 0,
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