import type { CSSProperties } from "react";
import Link from "next/link";

const roadmapItems = [
  {
    phase: "ระยะที่ 1",
    title: "ทำให้เว็บใช้งานพื้นฐานได้ครบ",
    status: "เสร็จแล้ว",
    description:
      "สร้างหน้าแรก คลัง Hook ระบบค้นหา Dashboard หน้า Contact หน้า Pricing หน้า Premium และปรับมือถือให้ใช้งานได้",
    items: [
      "หน้าแรกสำหรับแนะนำระบบ",
      "คลัง Hook และหมวดคอนเทนต์",
      "ระบบค้นหาไอเดีย",
      "ระบบบันทึกไอเดียไว้ใช้ต่อ",
      "Dashboard ภารกิจวันนี้",
      "หน้า Contact สำหรับรับข้อเสนอแนะ",
      "หน้า Pricing และ Premium",
      "ปรับ Header / Footer / มือถือ",
    ],
  },
  {
    phase: "ระยะที่ 2",
    title: "เก็บความต้องการจากผู้ใช้จริง",
    status: "กำลังทำ",
    description:
      "ใช้หน้า Contact เพื่อดูว่าผู้ใช้สนใจแพ็กไหน หมวดไหน และมีปัญหาอะไร ก่อนต่อระบบขายจริง",
    items: [
      "เก็บคนสนใจแพ็ก Pro",
      "เก็บคนสนใจแพ็กพรีเมียม",
      "รับข้อเสนอหมวดใหม่",
      "รับแจ้งปัญหาการใช้งาน",
      "ดูว่าผู้ใช้ต้องการ Hook หมวดไหนมากที่สุด",
    ],
  },
  {
    phase: "ระยะที่ 3",
    title: "เพิ่มหมวดและแพ็กพรีเมียม",
    status: "แผนถัดไป",
    description:
      "เพิ่มข้อมูลคุณภาพสูงสำหรับหมวดที่มีคนต้องการมากที่สุด แล้วแยก Free / Pro / Premium ให้ชัดเจนขึ้น",
    items: [
      "แพ็ก Hook สำหรับขายของออนไลน์",
      "แพ็ก Hook สำหรับ TikTok / Reels / Shorts",
      "แพ็ก CTA สำหรับปิดการขาย",
      "แพ็กสคริปต์คลิปสั้น",
      "แพ็กเฉพาะธุรกิจ เช่น อสังหา ความงาม ร้านอาหาร ฟิตเนส",
    ],
  },
  {
    phase: "ระยะที่ 4",
    title: "ต่อระบบใช้งานจริงมากขึ้น",
    status: "อนาคต",
    description:
      "เมื่อรู้แล้วว่าคนต้องการอะไร ค่อยเพิ่มระบบที่ซับซ้อนขึ้น เช่น ระบบสมาชิก ระบบจ่ายเงิน และระบบส่งข้อความจริง",
    items: [
      "ระบบสมัครสมาชิก",
      "ระบบล็อกอิน",
      "ระบบชำระเงิน",
      "ระบบส่งข้อความ Contact จริง",
      "ระบบเก็บข้อมูลผู้ใช้",
      "ระบบจัดการแพ็ก Premium",
    ],
  },
];

const currentWins = [
  "เว็บมีโครงสร้างหน้าหลักครบแล้ว",
  "มือถือใช้งานได้ดีขึ้น",
  "ผู้ใช้สามารถค้นหา Hook และไอเดียได้",
  "มีหน้า Contact สำหรับรับความต้องการ",
  "มีหน้า Pricing / Premium เพื่อเริ่มทดสอบแนวทางขาย",
];

const nextPriorities = [
  "เก็บ feedback จากผู้ใช้จริง 5–10 คนแรก",
  "ดูว่าคนสนใจหมวดไหนมากที่สุด",
  "คัด Hook คุณภาพสูงเพิ่มในหมวดที่มีโอกาสขาย",
  "ทำแพ็กตัวอย่าง Premium ชุดแรก",
  "ค่อยตัดสินใจว่าจะขายแบบไฟล์ แบบสมาชิก หรือแบบระบบล็อกอิน",
];

export default function RoadmapPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>Roadmap / แผนพัฒนาต่อ</p>

        <h1 style={titleStyle}>
          แผนพัฒนา Creator OS จากเว็บทดลองไปสู่ระบบที่ขายได้จริง
        </h1>

        <p style={subtitleStyle}>
          หน้านี้ใช้บอกทิศทางของ Creator OS ว่าตอนนี้ทำอะไรเสร็จแล้ว
          กำลังทำอะไรต่อ และอนาคตจะพัฒนาไปทางไหน เพื่อให้ผู้ใช้เห็นว่าเว็บนี้มีแผนต่อยอดชัดเจน
        </p>

        <div style={buttonRowStyle}>
          <Link href="/contact">
            <button style={primaryButtonStyle}>ส่งข้อเสนอแนะ</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>

          <Link href="/premium">
            <button style={secondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>สถานะตอนนี้</p>
          <h2 style={summaryTitleStyle}>MVP พร้อมโชว์รอบแรก</h2>
          <p style={mutedTextStyle}>
            เว็บมีหน้าใช้งานหลักครบ และเริ่มใช้รับ feedback จากผู้ใช้จริงได้แล้ว
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>เป้าหมายถัดไป</p>
          <h2 style={summaryTitleStyle}>หาความต้องการจริง</h2>
          <p style={mutedTextStyle}>
            ดูว่าผู้ใช้สนใจแพ็กไหน หมวดไหน และอยากให้ระบบช่วยอะไรเพิ่ม
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>เป้าหมายระยะยาว</p>
          <h2 style={summaryTitleStyle}>ต่อยอดเป็นสินค้า</h2>
          <p style={mutedTextStyle}>
            พัฒนาแพ็กพรีเมียม ระบบสมาชิก และระบบขายจริงเมื่อข้อมูลพร้อม
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>แผนตามลำดับ</p>

        <h2 style={{ margin: "6px 0" }}>Roadmap การพัฒนา</h2>

        <div style={roadmapListStyle}>
          {roadmapItems.map((item) => (
            <article key={item.phase} style={roadmapCardStyle}>
              <div style={roadmapTopStyle}>
                <span style={phaseBadgeStyle}>{item.phase}</span>
                <span style={statusBadgeStyle}>{item.status}</span>
              </div>

              <h3 style={roadmapTitleStyle}>{item.title}</h3>

              <p style={roadmapTextStyle}>{item.description}</p>

              <div style={itemListStyle}>
                {item.items.map((detail) => (
                  <div key={detail} style={itemRowStyle}>
                    <span style={checkStyle}>✓</span>
                    <p style={itemTextStyle}>{detail}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={twoColumnStyle}>
        <article style={sectionStyle}>
          <p style={labelStyle}>สิ่งที่ทำได้แล้ว</p>

          <h2 style={{ margin: "6px 0" }}>จุดแข็งตอนนี้</h2>

          <div style={itemListStyle}>
            {currentWins.map((item) => (
              <div key={item} style={itemRowStyle}>
                <span style={checkStyle}>✓</span>
                <p style={itemTextStyle}>{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article style={sectionStyle}>
          <p style={labelStyle}>สิ่งที่ควรทำต่อ</p>

          <h2 style={{ margin: "6px 0" }}>ลำดับความสำคัญถัดไป</h2>

          <div style={itemListStyle}>
            {nextPriorities.map((item) => (
              <div key={item} style={itemRowStyle}>
                <span style={checkStyle}>✓</span>
                <p style={itemTextStyle}>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>อยากให้ Creator OS พัฒนาอะไรต่อ?</h2>

        <p style={bottomTextStyle}>
          ส่งข้อเสนอแนะ หมวดที่อยากได้ หรือปัญหาที่เจอได้ที่หน้า Contact
          เพื่อใช้กำหนดทิศทางการพัฒนาในรอบถัดไป
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/contact?type=feedback">
            <button style={darkButtonStyle}>ส่งข้อเสนอแนะ</button>
          </Link>

          <Link href="/contact?type=custom-pack">
            <button style={darkSecondaryButtonStyle}>เสนอแพ็กหมวดเฉพาะ</button>
          </Link>

          <Link href="/guide">
            <button style={darkSecondaryButtonStyle}>ดูคู่มือเริ่มใช้งาน</button>
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

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const summaryCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const summaryLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const summaryTitleStyle: CSSProperties = {
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

const roadmapListStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  marginTop: "20px",
};

const roadmapCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const roadmapTopStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  alignItems: "center",
};

const phaseBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
};

const statusBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  border: "1px solid #c7d2fe",
  fontWeight: "bold",
  fontSize: "13px",
};

const roadmapTitleStyle: CSSProperties = {
  fontSize: "24px",
  margin: "14px 0 8px",
};

const roadmapTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
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

const checkStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const itemTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "20px",
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