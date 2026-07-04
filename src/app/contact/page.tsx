"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect,useMemo, useState } from "react";

type ContactType =
  | "interest-pro"
  | "interest-premium"
  | "custom-pack"
  | "new-category"
  | "bug"
  | "feedback"
  | "other";

const contactTypes: {
  value: ContactType;
  label: string;
  description: string;
  placeholder: string;
}[] = [
  {
    value: "interest-pro",
    label: "สนใจแพ็ก Pro",
    description: "สำหรับผู้ใช้ที่อยากใช้ Creator OS จริงจังขึ้น",
    placeholder:
      "เช่น สนใจแพ็ก Pro สำหรับทำคอนเทนต์ทุกวัน อยากรู้ว่าจะมีอะไรให้ใช้บ้าง",
  },
  {
    value: "interest-premium",
    label: "สนใจแพ็กพรีเมียม",
    description: "สำหรับผู้ใช้ที่อยากได้ Hook, CTA, แคปชัน หรือสคริปต์คัดคุณภาพ",
    placeholder:
      "เช่น สนใจแพ็กพรีเมียม อยากได้ Hook คุณภาพสูงสำหรับขายของออนไลน์",
  },
  {
    value: "custom-pack",
    label: "อยากได้แพ็กหมวดเฉพาะ",
    description: "ใช้บอกว่าอยากให้ทำแพ็กสำหรับธุรกิจหรือกลุ่มเฉพาะ",
    placeholder:
      "เช่น อยากได้แพ็กสำหรับร้านอาหาร อสังหา ความงาม ฟิตเนส นายหน้า หรือ TikTok",
  },
  {
    value: "new-category",
    label: "อยากเสนอหมวดใหม่",
    description: "ใช้เสนอหมวด Hook หรือคอนเทนต์ที่ยังไม่มีในระบบ",
    placeholder:
      "เช่น อยากให้มีหมวดแม่ค้าออนไลน์ หมวดขายคอร์ส หมวดนายหน้า หมวดท่องเที่ยว",
  },
  {
    value: "bug",
    label: "แจ้งปัญหา",
    description: "ใช้แจ้งปุ่มกดไม่ได้ หน้าไม่ขึ้น ข้อมูลหาย หรือเว็บแสดงผลผิด",
    placeholder:
      "เช่น กดปุ่มแล้วไม่ไปหน้าใหม่ หน้าแสดงผลเพี้ยน หรือข้อมูลที่บันทึกไว้หาย",
  },
  {
    value: "feedback",
    label: "ข้อเสนอแนะทั่วไป",
    description: "ใช้บอกความเห็น ความต้องการ หรือสิ่งที่อยากให้ปรับปรุง",
    placeholder:
      "เช่น อยากให้หน้าใช้ง่ายขึ้น อยากให้เพิ่มตัวอย่าง อยากให้คำอธิบายสั้นลง",
  },
  {
    value: "other",
    label: "อื่น ๆ",
    description: "ใช้สำหรับเรื่องอื่นที่ไม่ตรงกับตัวเลือกด้านบน",
    placeholder: "พิมพ์รายละเอียดที่อยากบอกทีมงานได้เลย",
  },
];

const validContactTypeValues: ContactType[] = contactTypes.map(
  (type) => type.value
);

function isContactType(value: string | null): value is ContactType {
  return validContactTypeValues.includes(value as ContactType);
}

function getContactTypeLabel(value: ContactType) {
  const item = contactTypes.find((type) => type.value === value);
  return item?.label || "อื่น ๆ";
}

function getPlaceholder(value: ContactType) {
  const item = contactTypes.find((type) => type.value === value);
  return item?.placeholder || "พิมพ์รายละเอียดที่อยากบอกทีมงานได้เลย";
}

export default function ContactPage() {
  const [contactType, setContactType] = useState<ContactType>("feedback");
  const [name, setName] = useState("");
  const [contactChannel, setContactChannel] = useState("");
  const [detail, setDetail] = useState("");
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");

    if (isContactType(type)) {
      setContactType(type);
    }
  }, []);

  const summaryText = useMemo(() => {
    return [
      "ข้อความจากหน้า Contact / Creator OS",
      "",
      `ประเภทข้อความ: ${getContactTypeLabel(contactType)}`,
      `ชื่อ / ชื่อเพจ: ${name || "-"}`,
      `ช่องทางติดต่อ: ${contactChannel || "-"}`,
      "",
      "รายละเอียด:",
      detail || "-",
    ].join("\n");
  }, [contactType, name, contactChannel, detail]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
      alert("คัดลอกไม่สำเร็จ กรุณาคัดลอกข้อความจากกรอบสรุปด้วยตัวเอง");
    }
  }

  function clearForm() {
    setContactType("feedback");
    setName("");
    setContactChannel("");
    setDetail("");
    setCopied(false);
  }

  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>ติดต่อ / ข้อเสนอแนะ</p>

        <h1 style={titleStyle}>บอกทีมงานว่าอยากได้อะไรจาก Creator OS</h1>

        <p style={subtitleStyle}>
          ใช้หน้านี้สำหรับแจ้งปัญหา เสนอหมวดใหม่ สนใจแพ็ก Pro
          สนใจแพ็กพรีเมียม หรือบอกความต้องการจริงก่อนที่ระบบจะเปิดขายเต็มรูปแบบ
        </p>

        <div style={buttonRowStyle}>
          <Link href="/pricing">
            <button style={secondaryButtonStyle}>อ่านราคาแพ็กเกจ</button>
          </Link>

          <Link href="/premium">
            <button style={secondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
          </Link>

          <Link href="/faq">
            <button style={secondaryButtonStyle}>อ่าน FAQ ก่อน</button>
          </Link>
        </div>
      </section>

      <section style={infoGridStyle}>
        <article style={infoCardStyle}>
          <h2 style={infoTitleStyle}>รับฟังผู้ใช้ก่อนขายจริง</h2>
          <p style={mutedTextStyle}>
            ตอนนี้หน้านี้ทำหน้าที่เก็บความต้องการก่อน เช่น คนอยากได้แพ็กไหน
            อยากให้เพิ่มหมวดอะไร หรือมีปัญหาตรงไหน
          </p>
        </article>

        <article style={infoCardStyle}>
          <h2 style={infoTitleStyle}>ยังไม่ใช่ระบบส่งข้อความจริง</h2>
          <p style={mutedTextStyle}>
            ตอนนี้ให้กรอกข้อมูล แล้วกดคัดลอกข้อความ เพื่อนำข้อความไปส่งต่อหรือเก็บไว้ก่อน
            ภายหลังค่อยต่อระบบส่งอีเมลหรือฐานข้อมูลจริง
          </p>
        </article>
      </section>

      <section style={formGridStyle}>
        <article style={formCardStyle}>
          <p style={labelStyle}>แบบฟอร์มข้อความ</p>

          <h2 style={{ margin: "6px 0" }}>อยากบอกทีมงานเรื่องอะไร?</h2>

          <div style={fieldGroupStyle}>
            <label style={labelTextStyle}>ประเภทข้อความ</label>

            <select
              value={contactType}
              onChange={(event) => setContactType(event.target.value as ContactType)}
              style={selectStyle}
            >
              {contactTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <p style={helperTextStyle}>
              {contactTypes.find((type) => type.value === contactType)?.description}
            </p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelTextStyle}>ชื่อ / ชื่อเพจ</label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="เช่น ร้านของฉัน / เพจ Creator มือใหม่ / ชื่อเล่น"
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelTextStyle}>ช่องทางติดต่อ</label>

            <input
              value={contactChannel}
              onChange={(event) => setContactChannel(event.target.value)}
              placeholder="เช่น อีเมล, LINE, Facebook, TikTok หรือช่องทางที่สะดวก"
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelTextStyle}>รายละเอียด</label>

            <textarea
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
              placeholder={getPlaceholder(contactType)}
              rows={8}
              style={textareaStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="button" onClick={copyMessage} style={primaryButtonStyle}>
              {copied ? "คัดลอกแล้ว" : "คัดลอกข้อความ"}
            </button>

            <button type="button" onClick={clearForm} style={clearButtonStyle}>
              ล้างข้อความ
            </button>
          </div>
        </article>

        <article style={summaryCardStyle}>
          <p style={labelStyle}>สรุปข้อความ</p>

          <h2 style={{ margin: "6px 0" }}>ข้อความที่จะคัดลอก</h2>

          <pre style={summaryBoxStyle}>{summaryText}</pre>

          <div style={tipBoxStyle}>
            <h3 style={{ marginTop: 0 }}>ตัวอย่างการใช้หน้านี้</h3>

            <p style={mutedTextStyle}>
              ถ้าผู้ใช้กดมาจากหน้า Pricing หรือ Premium ให้เลือกประเภท
              “สนใจแพ็ก Pro”, “สนใจแพ็กพรีเมียม” หรือ “อยากได้แพ็กหมวดเฉพาะ”
              แล้วพิมพ์สิ่งที่ต้องการ
            </p>
          </div>
        </article>
      </section>

      <section style={quickChoiceStyle}>
        <p style={labelStyle}>เลือกเร็ว</p>

        <h2 style={{ margin: "6px 0" }}>หัวข้อที่อยากให้ผู้ใช้ส่งเข้ามามากที่สุด</h2>

        <div style={quickGridStyle}>
          {contactTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setContactType(type.value)}
              style={
                contactType === type.value
                  ? quickButtonActiveStyle
                  : quickButtonStyle
              }
            >
              {type.label}
            </button>
          ))}
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ยังไม่แน่ใจว่าจะเลือกอะไร?</h2>

        <p style={bottomTextStyle}>
          อ่านหน้า FAQ หรือหน้าเกี่ยวกับเว็บก่อน แล้วค่อยกลับมาส่งข้อเสนอแนะได้
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/faq">
            <button style={darkButtonStyle}>อ่าน FAQ ก่อน</button>
          </Link>

          <Link href="/about">
            <button style={darkSecondaryButtonStyle}>เกี่ยวกับเว็บ</button>
          </Link>

          <Link href="/dashboard">
            <button style={darkSecondaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>
        </div>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "clamp(14px, 4vw, 24px)",
  overflowX: "hidden",
};

const heroStyle: CSSProperties = {
  padding: "clamp(30px, 7vw, 46px) clamp(18px, 5vw, 24px)",
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
  fontSize: "clamp(34px, 9vw, 46px)",
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

const clearButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const infoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "16px",
  marginTop: "24px",
};

const infoCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const infoTitleStyle: CSSProperties = {
  marginTop: 0,
};

const mutedTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  margin: 0,
};

const formGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "22px",
  marginTop: "28px",
};

const formCardStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const summaryCardStyle: CSSProperties = {
  padding: "24px",
  borderRadius: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const fieldGroupStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
  marginTop: "18px",
};

const labelTextStyle: CSSProperties = {
  fontWeight: "bold",
  color: "#111827",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
};

const selectStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  background: "white",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  lineHeight: "1.7",
  resize: "vertical",
};

const helperTextStyle: CSSProperties = {
  color: "#6b7280",
  lineHeight: "1.6",
  margin: 0,
};

const summaryBoxStyle: CSSProperties = {
  whiteSpace: "pre-wrap",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  lineHeight: "1.7",
  color: "#374151",
  minHeight: "180px",
  overflowX: "auto",
  maxWidth: "100%",
  boxSizing: "border-box",
};

const tipBoxStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const quickChoiceStyle: CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const quickGridStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "18px",
};

const quickButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  background: "#f8fafc",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};

const quickButtonActiveStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
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