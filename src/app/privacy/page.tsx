import type { CSSProperties } from "react";
import Link from "next/link";

const sections = [
  {
    title: "ข้อมูลที่ระบบอาจเก็บ",
    items: [
      "ข้อความหรือไอเดียที่ผู้ใช้กรอกในระบบ",
      "รายการที่ผู้ใช้กดบันทึกไว้ในเครื่องของผู้ใช้",
      "ข้อมูลการใช้งานพื้นฐาน เช่น หน้าที่เปิดใช้งาน หรือฟีเจอร์ที่ใช้งาน",
      "ข้อมูลติดต่อที่ผู้ใช้กรอกเองในหน้า ติดต่อ / ข้อเสนอแนะ",
    ],
  },
  {
    title: "การนำข้อมูลไปใช้",
    items: [
      "ใช้เพื่อช่วยให้ผู้ใช้ทำคอนเทนต์ได้สะดวกขึ้น",
      "ใช้เพื่อปรับปรุงคุณภาพของระบบและฟีเจอร์",
      "ใช้เพื่อดูว่าผู้ใช้สนใจหมวดหรือเครื่องมือแบบไหน",
      "ใช้เพื่อติดต่อกลับในกรณีที่ผู้ใช้ให้ช่องทางติดต่อไว้",
    ],
  },
  {
    title: "สิ่งที่ระบบไม่ควรทำ",
    items: [
      "ไม่ควรนำข้อมูลส่วนตัวไปขายต่อ",
      "ไม่ควรเปิดเผยข้อมูลผู้ใช้โดยไม่ได้รับอนุญาต",
      "ไม่ควรนำข้อความส่วนตัวไปเผยแพร่เป็นตัวอย่างสาธารณะโดยไม่ขออนุญาต",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>นโยบายความเป็นส่วนตัว</p>

        <h1 style={titleStyle}>เราให้ความสำคัญกับข้อมูลของผู้ใช้</h1>

        <p style={subtitleStyle}>
          หน้านี้อธิบายโดยสรุปว่า Creator OS อาจเกี่ยวข้องกับข้อมูลอะไรบ้าง
          และข้อมูลเหล่านั้นควรถูกใช้เพื่อปรับปรุงการใช้งาน ไม่ใช่เพื่อทำให้ผู้ใช้เสียประโยชน์
        </p>

        <div style={buttonRowStyle}>
          <Link href="/terms">
            <button style={secondaryButtonStyle}>ดูเงื่อนไขการใช้งาน</button>
          </Link>

          <Link href="/contact">
            <button style={primaryButtonStyle}>ติดต่อ / ข้อเสนอแนะ</button>
          </Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <h2 style={{ marginTop: 0 }}>หมายเหตุสำคัญ</h2>
        <p style={mutedTextStyle}>
          หน้านี้เป็นข้อความเบื้องต้นสำหรับเว็บไซต์ Creator OS
          หากต่อระบบสมาชิก ระบบจ่ายเงิน หรือเก็บข้อมูลผู้ใช้จริงในอนาคต
          ควรปรับนโยบายให้ละเอียดขึ้นตามระบบที่ใช้งานจริง
        </p>
      </section>

      <section style={sectionListStyle}>
        {sections.map((section) => (
          <article key={section.title} style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>{section.title}</h2>

            <div style={itemListStyle}>
              {section.items.map((item) => (
                <div key={item} style={itemStyle}>
                  <span style={dotStyle}>✓</span>
                  <p style={itemTextStyle}>{item}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>มีข้อสงสัยเกี่ยวกับข้อมูลส่วนตัว?</h2>

        <p style={bottomTextStyle}>
          สามารถส่งข้อเสนอแนะหรือแจ้งสิ่งที่อยากให้ระบบปรับปรุงได้ที่หน้าติดต่อ
        </p>

        <Link href="/contact">
          <button style={darkButtonStyle}>ไปหน้าติดต่อ</button>
        </Link>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "24px",
};

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
  fontSize: "44px",
  lineHeight: "1.12",
  margin: "12px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "820px",
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

const noticeStyle: CSSProperties = {
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const mutedTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  margin: 0,
};

const sectionListStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
  marginTop: "24px",
};

const sectionStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const itemListStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "16px",
};

const itemStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  padding: "14px",
  borderRadius: "16px",
  background: "#f8fafc",
};

const dotStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const itemTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "30px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const bottomTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  maxWidth: "700px",
  margin: "0 auto 18px",
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