import type { CSSProperties } from "react";
import Link from "next/link";

const readyItems = [
  "หน้าแรกมีข้อความแนะนำเว็บชัดเจน",
  "มีระบบค้นหาไอเดียและ Hook",
  "มี Dashboard สำหรับเริ่มใช้งาน",
  "มีหน้า Pricing เพื่อบอกแพ็ก",
  "มีหน้า Premium เพื่ออธิบายแพ็กคุณภาพสูง",
  "มีหน้า Samples ให้ดูตัวอย่างก่อนตัดสินใจ",
  "มีหน้า Contact สำหรับรับคนสนใจและ feedback",
  "มือถือใช้งานได้ ไม่ล้น ไม่แตก",
  "Footer มีลิงก์สำคัญครบ",
];

const beforeLaunchItems = [
  {
    title: "เช็กทุกลิงก์สำคัญ",
    status: "ต้องเช็ก",
    details: [
      "หน้าแรก → Dashboard",
      "หน้าแรก → Search",
      "หน้าแรก → Samples",
      "Pricing → Contact",
      "Pricing → Premium",
      "Pricing → Samples",
      "Premium → Contact",
      "Premium → Pricing",
      "Premium → Samples",
      "Footer → Privacy / Terms / Roadmap / Samples",
    ],
  },
  {
    title: "เช็กข้อความขาย",
    status: "ควรทำ",
    details: [
      "คนเข้าเว็บต้องเข้าใจใน 5–10 วินาทีว่าเว็บช่วยอะไร",
      "Pricing ต้องบอกว่าทำไมควรสนใจแพ็ก",
      "Premium ต้องบอกว่าเหมาะกับใคร",
      "Samples ต้องทำให้คนเห็นภาพว่าของที่ได้หน้าตาเป็นอย่างไร",
    ],
  },
  {
    title: "เตรียมแพ็กขายชุดแรก",
    status: "สำคัญ",
    details: [
      "เลือกแพ็กแรกที่ขายง่ายที่สุด",
      "กำหนดว่าลูกค้าจะได้อะไรบ้าง",
      "กำหนดราคาทดลอง",
      "เตรียมข้อความตอบกลับเมื่อลูกค้าสนใจ",
    ],
  },
  {
    title: "เตรียมช่องทางรับออเดอร์",
    status: "สำคัญ",
    details: [
      "ใช้หน้า Contact รับคนสนใจก่อน",
      "ให้ลูกค้าคัดลอกข้อความแล้วส่งหาเรา",
      "ยังไม่จำเป็นต้องมีระบบจ่ายเงินอัตโนมัติ",
      "ขายแบบ manual ก่อนเพื่อทดสอบว่ามีคนต้องการจริงไหม",
    ],
  },
  {
    title: "เตรียมโพสต์เปิดตัว",
    status: "ควรทำ",
    details: [
      "เขียนโพสต์แนะนำ Creator OS",
      "บอกว่าเว็บนี้ช่วยครีเอเตอร์หา Hook และไอเดียคอนเทนต์",
      "ชวนคนลองใช้ฟรี",
      "ชวนคนเสนอหมวดที่อยากได้",
      "แนบลิงก์เว็บจริง",
    ],
  },
];

const notNeededYet = [
  "ระบบล็อกอิน",
  "ระบบสมาชิกเต็มรูปแบบ",
  "ระบบจ่ายเงินอัตโนมัติ",
  "ระบบอีเมลอัตโนมัติ",
  "ระบบหลังบ้านสำหรับแอดมิน",
  "ระบบฐานข้อมูลใหญ่",
];

const launchModes = [
  {
    name: "Soft Launch",
    recommended: true,
    description:
      "เปิดให้คนกลุ่มแรกลองใช้ เก็บ feedback และดูว่ามีคนสนใจแพ็กไหนจริง เหมาะกับตอนนี้ที่สุด",
    items: [
      "ใช้เว็บจริงได้เลย",
      "ยังไม่ต้องมีระบบจ่ายเงิน",
      "รับคนสนใจผ่าน Contact",
      "เอาข้อมูลจากผู้ใช้ไปปรับแพ็กขาย",
    ],
  },
  {
    name: "Full Launch",
    recommended: false,
    description:
      "เปิดตัวแบบจริงจังพร้อมระบบขายเต็ม ต้องมีระบบสมาชิก ระบบจ่ายเงิน และระบบส่งของชัดเจน",
    items: [
      "ต้องมีระบบชำระเงิน",
      "ต้องมีระบบสมาชิก",
      "ต้องมีระบบส่งแพ็กให้ลูกค้า",
      "เหมาะกับช่วงหลังจากทดสอบตลาดแล้ว",
    ],
  },
];

export default function LaunchChecklistPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>Launch Checklist / เช็กก่อนเปิดตัว</p>

        <h1 style={titleStyle}>
          รายการตรวจ Creator OS ก่อนปล่อยให้คนอื่นลองใช้จริง
        </h1>

        <p style={subtitleStyle}>
          หน้านี้ใช้เช็กว่าเว็บพร้อมเปิดตัวระดับไหน เหลืออะไรที่ต้องทำก่อนขาย
          และอะไรที่ยังไม่จำเป็นต้องทำในช่วงแรก
        </p>

        <div style={buttonRowStyle}>
          <Link href="/samples">
            <button style={primaryButtonStyle}>ดูตัวอย่างแพ็ก</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>

          <Link href="/contact?type=feedback">
            <button style={secondaryButtonStyle}>ส่ง Feedback</button>
          </Link>
        </div>
      </section>

      <section style={statusGridStyle}>
        <article style={statusCardStyle}>
          <p style={cardLabelStyle}>สถานะเว็บตอนนี้</p>
          <h2 style={statusTitleStyle}>พร้อม Soft Launch</h2>
          <p style={mutedTextStyle}>
            เว็บพร้อมให้คนกลุ่มแรกลองใช้ได้แล้ว เหลือเก็บข้อความขายและแพ็กชุดแรกให้ชัดขึ้น
          </p>
        </article>

        <article style={statusCardStyle}>
          <p style={cardLabelStyle}>เป้าหมายรอบแรก</p>
          <h2 style={statusTitleStyle}>หาคนสนใจจริง</h2>
          <p style={mutedTextStyle}>
            ไม่ต้องรีบทำระบบใหญ่ เป้าหมายคือดูว่าคนต้องการหมวดไหนและยอมจ่ายกับอะไร
          </p>
        </article>

        <article style={statusCardStyle}>
          <p style={cardLabelStyle}>สิ่งที่ต้องระวัง</p>
          <h2 style={statusTitleStyle}>อย่าทำระบบเกินจำเป็น</h2>
          <p style={mutedTextStyle}>
            ช่วงแรกควรทดสอบตลาดก่อน ยังไม่ต้องรีบทำล็อกอินหรือระบบจ่ายเงินเต็มรูปแบบ
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>สิ่งที่พร้อมแล้ว</p>

        <h2 style={sectionTitleStyle}>พื้นฐานที่ทำเสร็จแล้ว</h2>

        <div style={checkGridStyle}>
          {readyItems.map((item) => (
            <div key={item} style={checkRowStyle}>
              <span style={checkIconStyle}>✓</span>
              <p style={checkTextStyle}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ก่อนเปิดตัว</p>

        <h2 style={sectionTitleStyle}>รายการที่ควรเช็กต่อ</h2>

        <div style={taskGridStyle}>
          {beforeLaunchItems.map((group) => (
            <article key={group.title} style={taskCardStyle}>
              <div style={taskTopStyle}>
                <h3 style={taskTitleStyle}>{group.title}</h3>
                <span style={badgeStyle}>{group.status}</span>
              </div>

              <div style={itemListStyle}>
                {group.details.map((detail) => (
                  <div key={detail} style={itemRowStyle}>
                    <span style={dotStyle}>•</span>
                    <p style={itemTextStyle}>{detail}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>รูปแบบเปิดตัว</p>

        <h2 style={sectionTitleStyle}>ควรเปิดตัวแบบไหน?</h2>

        <div style={modeGridStyle}>
          {launchModes.map((mode) => (
            <article
              key={mode.name}
              style={mode.recommended ? recommendedModeStyle : modeCardStyle}
            >
              <div style={modeTopStyle}>
                <h3 style={modeTitleStyle}>{mode.name}</h3>
                {mode.recommended ? (
                  <span style={recommendedBadgeStyle}>แนะนำตอนนี้</span>
                ) : (
                  <span style={normalBadgeStyle}>ทำทีหลัง</span>
                )}
              </div>

              <p style={cardTextStyle}>{mode.description}</p>

              <div style={itemListStyle}>
                {mode.items.map((item) => (
                  <div key={item} style={itemRowStyle}>
                    <span style={checkIconStyle}>✓</span>
                    <p style={itemTextStyle}>{item}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ยังไม่ต้องรีบทำ</p>

        <h2 style={sectionTitleStyle}>สิ่งที่ทำทีหลังได้</h2>

        <p style={mutedTextStyle}>
          รายการเหล่านี้สำคัญในอนาคต แต่ยังไม่จำเป็นสำหรับการเปิดตัวรอบแรก
          เพราะเราควรทดสอบก่อนว่าคนสนใจจริงไหม
        </p>

        <div style={checkGridStyle}>
          {notNeededYet.map((item) => (
            <div key={item} style={warningRowStyle}>
              <span style={warningIconStyle}>!</span>
              <p style={checkTextStyle}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ข้อสรุปตอนนี้</h2>

        <p style={bottomTextStyle}>
          Creator OS พร้อมเปิดแบบ Soft Launch ได้แล้ว ขั้นต่อไปคือทำแพ็กขายชุดแรก
          และเตรียมข้อความประกาศเปิดตัว เพื่อเริ่มหาคนลองใช้และคนสนใจซื้อจริง
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/samples">
            <button style={darkButtonStyle}>ดูตัวอย่างแพ็ก</button>
          </Link>

          <Link href="/contact?type=interest-premium">
            <button style={darkSecondaryButtonStyle}>จำลองคนสนใจแพ็ก</button>
          </Link>

          <Link href="/roadmap">
            <button style={darkSecondaryButtonStyle}>ดู Roadmap</button>
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
  fontSize: "clamp(34px, 8vw, 46px)",
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

const statusGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const statusCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const cardLabelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const statusTitleStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "24px",
};

const mutedTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  margin: 0,
};

const sectionStyle: CSSProperties = {
  marginTop: "28px",
  padding: "24px",
  borderRadius: "24px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const sectionTitleStyle: CSSProperties = {
  margin: "6px 0 18px",
};

const checkGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const checkRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  padding: "14px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const warningRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  padding: "14px",
  borderRadius: "16px",
  background: "#fff7ed",
  border: "1px solid #fed7aa",
};

const checkIconStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const warningIconStyle: CSSProperties = {
  color: "#ea580c",
  fontWeight: "bold",
};

const checkTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const taskGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "18px",
};

const taskCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const taskTopStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const taskTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "22px",
};

const badgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
  fontSize: "13px",
};

const itemListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "16px",
};

const itemRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
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

const modeGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "18px",
};

const modeCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const recommendedModeStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const modeTopStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const modeTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "24px",
};

const recommendedBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
};

const normalBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "white",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontWeight: "bold",
  fontSize: "13px",
};

const cardTextStyle: CSSProperties = {
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
  maxWidth: "800px",
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