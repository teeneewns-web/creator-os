"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../../components/dashboard/CopyButton";

type ContactType = "feedback" | "bug" | "category" | "premium" | "other";

const contactTypes = [
  { value: "feedback", label: "ข้อเสนอแนะทั่วไป" },
  { value: "bug", label: "แจ้งปัญหาการใช้งาน" },
  { value: "category", label: "เสนอหมวดคอนเทนต์ใหม่" },
  { value: "premium", label: "สนใจแพ็กพรีเมียม" },
  { value: "other", label: "เรื่องอื่น ๆ" },
];

function getTypeLabel(value: ContactType) {
  return contactTypes.find((item) => item.value === value)?.label || "เรื่องอื่น ๆ";
}

export default function ContactPage() {
  const [contactType, setContactType] = useState<ContactType>("feedback");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const summaryText = useMemo(() => {
    return [
      "ข้อเสนอแนะจากผู้ใช้ Creator OS",
      "",
      "ประเภท: " + getTypeLabel(contactType),
      "ชื่อ: " + (name || "-"),
      "ช่องทางติดต่อ: " + (contact || "-"),
      "",
      "รายละเอียด:",
      message || "-",
    ].join("\n");
  }, [contactType, name, contact, message]);

  function clearForm() {
    setContactType("feedback");
    setName("");
    setContact("");
    setMessage("");
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>ติดต่อ / ข้อเสนอแนะ</p>

        <h1 style={titleStyle}>อยากเสนอหมวดใหม่ แจ้งปัญหา หรือบอกสิ่งที่ควรปรับ</h1>

        <p style={subtitleStyle}>
          หน้านี้ทำไว้สำหรับรวบรวมข้อความจากผู้ใช้ เช่น อยากให้เพิ่มหมวด Hook ใหม่
          พบปัญหาการใช้งาน อยากเสนอฟีเจอร์ หรือสนใจแพ็กพรีเมียม
        </p>

        <div style={buttonRowStyle}>
          <Link href="/faq">
            <button style={secondaryButtonStyle}>อ่าน FAQ ก่อน</button>
          </Link>

          <Link href="/about">
            <button style={secondaryButtonStyle}>เกี่ยวกับเว็บ</button>
          </Link>

          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ใช้สำหรับ</p>
          <h2 style={summaryTitleStyle}>รับฟังผู้ใช้</h2>
          <p style={mutedTextStyle}>
            ให้ผู้ใช้บอกได้ว่าอยากให้เว็บเพิ่มอะไร หรือจุดไหนยังใช้งานยาก
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>ช่วยเรื่องการขาย</p>
          <h2 style={summaryTitleStyle}>รู้ความต้องการจริง</h2>
          <p style={mutedTextStyle}>
            ถ้ามีคนเสนอหมวดหรือฟีเจอร์ซ้ำ ๆ แปลว่าอาจเป็นสิ่งที่ควรทำเป็นแพ็กขาย
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>สถานะตอนนี้</p>
          <h2 style={summaryTitleStyle}>คัดลอกข้อความ</h2>
          <p style={mutedTextStyle}>
            ตอนนี้ยังไม่ส่งเข้าระบบหลังบ้าน ให้คัดลอกข้อความไปเก็บหรือส่งต่อก่อน
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <div style={sectionTopRowStyle}>
          <div>
            <p style={labelStyle}>แบบฟอร์มข้อความ</p>

            <h2 style={{ margin: "6px 0" }}>กรอกข้อมูลที่อยากบอกทีม Creator OS</h2>

            <p style={mutedTextStyle}>
              กรอกเสร็จแล้วกดคัดลอกข้อความ เพื่อเอาไปส่งต่อ เก็บไว้
              หรือใช้เป็นข้อมูลพัฒนาฟีเจอร์ต่อไป
            </p>
          </div>

          <CopyButton text={summaryText} />
        </div>

        <div style={formGridStyle}>
          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>ประเภทข้อความ</span>

            <select
              value={contactType}
              onChange={(event) =>
                setContactType(event.target.value as ContactType)
              }
              style={inputStyle}
            >
              {contactTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>ชื่อหรือชื่อเพจ</span>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="เช่น เจ้าของร้านเสื้อผ้า / Creator มือใหม่"
              style={inputStyle}
            />
          </label>

          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>ช่องทางติดต่อ</span>

            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="เช่น อีเมล, LINE, Facebook, TikTok"
              style={inputStyle}
            />
          </label>
        </div>

        <label style={messageFieldStyle}>
          <span style={fieldLabelStyle}>รายละเอียด</span>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="เขียนสิ่งที่อยากเสนอ เช่น อยากให้เพิ่มหมวดอสังหา, หมวดแม่ค้าออนไลน์, หมวดคลิปสั้นสายตลก, หรือเจอปัญหาปุ่มกดไม่ได้..."
            style={textareaStyle}
          />
        </label>

        <div style={buttonRowStyle}>
          <CopyButton text={summaryText} />

          <button type="button" onClick={clearForm} style={secondaryButtonStyle}>
            ล้างข้อความ
          </button>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ตัวอย่างเรื่องที่แจ้งได้</p>

        <h2 style={{ margin: "6px 0" }}>ผู้ใช้ควรส่งอะไรมาได้บ้าง</h2>

        <div style={exampleGridStyle}>
          <article style={exampleCardStyle}>
            <h3>เสนอหมวดใหม่</h3>
            <p>
              เช่น Hook สำหรับอสังหา, ร้านอาหาร, นายหน้า, แม่ค้าออนไลน์,
              คลินิกความงาม หรือคอนเทนต์สายต่างประเทศ
            </p>
          </article>

          <article style={exampleCardStyle}>
            <h3>แจ้งปัญหา</h3>
            <p>
              เช่น ปุ่มกดไม่ได้ หน้าโหลดช้า ค้นหาไม่เจอข้อมูล หรือข้อความบางส่วนอ่านยาก
            </p>
          </article>

          <article style={exampleCardStyle}>
            <h3>ขอฟีเจอร์</h3>
            <p>
              เช่น อยากให้มีระบบสร้างแผนโพสต์ 30 วัน ระบบ export หรือระบบจัดแพ็กขาย
            </p>
          </article>

          <article style={exampleCardStyle}>
            <h3>สนใจพรีเมียม</h3>
            <p>
              เช่น อยากได้ Hook คุณภาพสูงเฉพาะธุรกิจ หรือแพ็กคอนเทนต์สำหรับสายงานเฉพาะ
            </p>
          </article>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>หลังจากมีผู้ใช้จริง ค่อยต่อระบบส่งข้อความ</h2>

        <p style={bottomTextStyle}>
          ตอนนี้หน้านี้ใช้สร้างความน่าเชื่อถือและเก็บรูปแบบข้อความก่อน
          ภายหลังค่อยต่อกับอีเมล ฐานข้อมูล หรือระบบหลังบ้านได้
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/pricing">
            <button style={darkButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>

          <Link href="/premium">
            <button style={darkSecondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
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
  fontSize: "44px",
  lineHeight: "1.12",
  margin: "12px 0",
  maxWidth: "960px",
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

const summaryTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "26px",
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

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
};

const messageFieldStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  marginTop: "16px",
};

const fieldLabelStyle: CSSProperties = {
  fontWeight: "bold",
  color: "#374151",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "170px",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  lineHeight: "1.7",
  resize: "vertical",
};

const exampleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const exampleCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.8",
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