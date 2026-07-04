import type { CSSProperties } from "react";
import Link from "next/link";

const terms = [
  {
    title: "การใช้งานเนื้อหา",
    text: "ผู้ใช้สามารถนำ Hook, แคปชัน, CTA และสคริปต์ไปปรับใช้กับงานของตัวเองได้ แต่ควรปรับคำให้เหมาะกับแบรนด์ สินค้า และกลุ่มเป้าหมายของตนเอง",
  },
  {
    title: "คุณภาพของผลลัพธ์",
    text: "Creator OS เป็นเครื่องมือช่วยคิดและช่วยจัดระบบ ไม่ได้การันตีว่างานทุกชิ้นจะได้ยอดวิว ยอดขาย หรือผลลัพธ์ตามที่คาดหวัง ผู้ใช้ควรทดสอบและปรับตามสถานการณ์จริง",
  },
  {
    title: "การใช้งานอย่างเหมาะสม",
    text: "ไม่ควรใช้ระบบเพื่อสร้างเนื้อหาหลอกลวง สแปม ละเมิดสิทธิผู้อื่น หรือทำให้ผู้อื่นเสียหาย",
  },
  {
    title: "แพ็ก Free / Pro / Premium",
    text: "แนวคิดของระบบคือมีทั้งส่วนใช้ฟรีและส่วนพรีเมียมในอนาคต รายละเอียดแพ็กอาจปรับเปลี่ยนได้ตามการพัฒนาเว็บไซต์",
  },
  {
    title: "การเปลี่ยนแปลงระบบ",
    text: "ระบบอาจมีการเพิ่ม ลด หรือปรับฟีเจอร์ เพื่อให้เหมาะกับการใช้งานจริงและคุณภาพของสินค้า",
  },
];

export default function TermsPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>เงื่อนไขการใช้งาน</p>

        <h1 style={titleStyle}>ข้อตกลงเบื้องต้นสำหรับการใช้ Creator OS</h1>

        <p style={subtitleStyle}>
          หน้านี้สรุปแนวทางการใช้งาน Creator OS เพื่อให้ผู้ใช้เข้าใจว่าเว็บไซต์นี้เป็นเครื่องมือช่วยทำคอนเทนต์
          และควรนำไปปรับใช้ด้วยความเหมาะสม
        </p>

        <div style={buttonRowStyle}>
          <Link href="/privacy">
            <button style={secondaryButtonStyle}>ดูนโยบายความเป็นส่วนตัว</button>
          </Link>

          <Link href="/pricing">
            <button style={primaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <h2 style={{ marginTop: 0 }}>สรุปสั้น ๆ</h2>
        <p style={mutedTextStyle}>
          ใช้ Creator OS เป็นเครื่องมือช่วยเริ่มต้น ช่วยคิด ช่วยจัดระบบ
          และช่วยประหยัดเวลา แต่ควรตรวจทานและปรับข้อความก่อนนำไปใช้จริงทุกครั้ง
        </p>
      </section>

      <section style={sectionListStyle}>
        {terms.map((term, index) => (
          <article key={term.title} style={sectionStyle}>
            <p style={numberStyle}>ข้อที่ {index + 1}</p>
            <h2 style={{ margin: "6px 0" }}>{term.title}</h2>
            <p style={termTextStyle}>{term.text}</p>
          </article>
        ))}
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>พร้อมเริ่มใช้งานแล้ว?</h2>

        <p style={bottomTextStyle}>
          เริ่มจากหน้า ภารกิจวันนี้ เพื่อให้ระบบพาไปทีละขั้นแบบไม่งง
        </p>

        <Link href="/dashboard">
          <button style={darkButtonStyle}>เริ่มภารกิจวันนี้</button>
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

const numberStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const termTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  marginBottom: 0,
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