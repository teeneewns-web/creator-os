import type { CSSProperties } from "react";
import Link from "next/link";

const premiumPacks = [
  {
    title: "แพ็ก Hook พรีเมียม",
    description:
      "รวมประโยคเปิดที่คัดแล้วว่าเหมาะกับการทำโพสต์ คลิปสั้น หรือคอนเทนต์ขายของ",
    examples: [
      "Hook สำหรับหยุดคนเลื่อนผ่าน",
      "Hook สำหรับขายโดยไม่ดูขายแรง",
      "Hook สำหรับสร้างความสงสัย",
      "Hook สำหรับเจ้าของร้านและ Creator",
    ],
  },
  {
    title: "แพ็ก CTA พรีเมียม",
    description:
      "คำชวนให้กด ติดตาม ทักแชต สมัคร ซื้อ หรือบันทึก โดยไม่ดูแข็งเกินไป",
    examples: [
      "CTA สำหรับปิดการขาย",
      "CTA สำหรับเพิ่มคอมเมนต์",
      "CTA สำหรับให้คนทักแชต",
      "CTA สำหรับเพิ่มผู้ติดตาม",
    ],
  },
  {
    title: "แพ็กสคริปต์พรีเมียม",
    description:
      "โครงสคริปต์สำหรับคลิปสั้น ใช้เป็นต้นแบบในการทำ TikTok, Reels หรือ Shorts",
    examples: [
      "สคริปต์คลิปขายของ",
      "สคริปต์เล่าเรื่องปัญหา",
      "สคริปต์ให้ความรู้สั้น ๆ",
      "สคริปต์รีวิวสินค้า",
    ],
  },
];

const targetUsers = [
  "Creator ที่ต้องทำคอนเทนต์ทุกวัน",
  "เจ้าของร้านที่อยากขายของออนไลน์",
  "ฟรีแลนซ์หรือแอดมินเพจที่ต้องคิดโพสต์ให้ลูกค้า",
  "คนทำ TikTok, Reels, Shorts ที่อยากมีไอเดียเร็วขึ้น",
  "คนที่อยากซื้อแพ็กข้อความไปใช้จริง ไม่อยากเริ่มจากหน้าว่าง",
];

const qualityPoints = [
  {
    title: "คัดจากความใช้ได้จริง",
    text: "ไม่ใช่แค่ข้อความสวย แต่ต้องเอาไปปรับใช้กับโพสต์หรือคลิปจริงได้",
  },
  {
    title: "มีมุมชัดเจน",
    text: "แต่ละข้อความควรรู้ว่าใช้เพื่อดึงความสนใจ สร้างความสงสัย ขาย หรือให้ความรู้",
  },
  {
    title: "เหมาะกับการต่อยอด",
    text: "สามารถนำไปต่อเป็นแคปชัน CTA หรือสคริปต์ได้ ไม่ใช่แค่ประโยคเดี่ยว ๆ",
  },
  {
    title: "แยกจากของใช้ฟรี",
    text: "ส่วนพรีเมียมควรคมกว่า เจาะกลุ่มกว่า และเหมาะกับคนที่ต้องการใช้จริงจัง",
  },
];

export default function PremiumPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>แพ็กพรีเมียม</p>

        <h1 style={titleStyle}>
          เนื้อหาคัดคุณภาพสำหรับคนที่อยากทำคอนเทนต์เร็วขึ้นและจริงจังขึ้น
        </h1>

        <p style={subtitleStyle}>
          หน้า Premium ใช้อธิบายว่าถ้า Creator OS เปิดขายแพ็กพรีเมียม
          ผู้ใช้จะได้อะไร เหมาะกับใคร และต่างจากส่วนใช้ฟรีอย่างไร
        </p>

        <div style={buttonRowStyle}>
          <Link href="/contact?type=interest-premium">
            <button style={primaryButtonStyle}>สนใจแพ็กพรีเมียม</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>

          <Link href="/samples">
  <button style={secondaryButtonStyle}>ดูตัวอย่างแพ็ก</button>
</Link>

          <Link href="/quality/hooks">
            <button style={secondaryButtonStyle}>ดูคุณภาพ Hook</button>
          </Link>
        </div>
      </section>

      <section style={noticeStyle}>
        <h2 style={{ marginTop: 0 }}>สถานะตอนนี้</h2>

        <p style={noticeTextStyle}>
          ตอนนี้ยังไม่ต้องต่อระบบจ่ายเงินจริง ให้ใช้หน้านี้เป็นหน้าขายแนวคิดก่อน
          เพื่อให้ผู้ใช้เข้าใจว่าแพ็กพรีเมียมมีคุณค่าอะไร แล้วพาคนที่สนใจไปหน้า Contact
          เพื่อเก็บความต้องการก่อนเริ่มขายจริง
        </p>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>สิ่งที่ควรขายเป็น Premium</p>

        <h2 style={{ margin: "6px 0" }}>
          แพ็กที่เหมาะกับการเริ่มทำรายได้ก่อน
        </h2>

        <div style={packGridStyle}>
          {premiumPacks.map((pack) => (
            <article key={pack.title} style={packCardStyle}>
              <h3 style={packTitleStyle}>{pack.title}</h3>

              <p style={packTextStyle}>{pack.description}</p>

              <div style={exampleListStyle}>
                {pack.examples.map((example) => (
                  <div key={example} style={exampleItemStyle}>
                    <span style={checkStyle}>✓</span>
                    <span>{example}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>เหมาะกับใคร</p>

        <h2 style={{ margin: "6px 0" }}>
          ผู้ใช้ที่มีโอกาสยอมจ่ายเงินมากที่สุด
        </h2>

        <div style={userGridStyle}>
          {targetUsers.map((user) => (
            <div key={user} style={userItemStyle}>
              <span style={dotStyle}>•</span>
              <p style={userTextStyle}>{user}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>มาตรฐานพรีเมียม</p>

        <h2 style={{ margin: "6px 0" }}>
          ของที่ขายได้ ต้องต่างจากของใช้ฟรีอย่างชัดเจน
        </h2>

        <div style={qualityGridStyle}>
          {qualityPoints.map((point) => (
            <article key={point.title} style={qualityCardStyle}>
              <h3 style={{ marginTop: 0 }}>{point.title}</h3>
              <p style={qualityTextStyle}>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>โครงสร้างแพ็กที่แนะนำ</p>

        <h2 style={{ margin: "6px 0" }}>
          เริ่มขายแบบง่ายก่อน ไม่ต้องทำระบบซับซ้อน
        </h2>

        <div style={timelineStyle}>
          <article style={timelineItemStyle}>
            <span style={stepNumberStyle}>1</span>
            <div>
              <h3 style={timelineTitleStyle}>เปิดให้ใช้ฟรีบางส่วน</h3>
              <p style={timelineTextStyle}>
                ให้ผู้ใช้ลองใช้ Hook, Dashboard และ Search ก่อน เพื่อเห็นคุณค่าของเว็บ
              </p>
            </div>
          </article>

          <article style={timelineItemStyle}>
            <span style={stepNumberStyle}>2</span>
            <div>
              <h3 style={timelineTitleStyle}>เก็บคนสนใจผ่านหน้า Contact</h3>
              <p style={timelineTextStyle}>
                ให้ผู้ใช้บอกว่าอยากได้แพ็กหมวดไหน เช่น ขายของ ความงาม อสังหา หรือ TikTok
              </p>
            </div>
          </article>

          <article style={timelineItemStyle}>
            <span style={stepNumberStyle}>3</span>
            <div>
              <h3 style={timelineTitleStyle}>ทำแพ็กพรีเมียมหมวดแรก</h3>
              <p style={timelineTextStyle}>
                เลือกหมวดที่คนขอเยอะที่สุด แล้วคัด Hook, CTA, Caption และ Script เป็นชุดเดียว
              </p>
            </div>
          </article>

          <article style={timelineItemStyle}>
            <span style={stepNumberStyle}>4</span>
            <div>
              <h3 style={timelineTitleStyle}>ค่อยต่อระบบจ่ายเงินภายหลัง</h3>
              <p style={timelineTextStyle}>
                เมื่อรู้แล้วว่าคนต้องการอะไร ค่อยทำระบบสมาชิกหรือระบบซื้อแพ็กจริง
              </p>
            </div>
          </article>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>อยากได้แพ็กพรีเมียมหมวดไหน?</h2>

        <p style={bottomTextStyle}>
          ให้ผู้ใช้ส่งความต้องการผ่านหน้า Contact ก่อน เช่น อยากได้ Hook สำหรับขายของ
          Hook สำหรับ TikTok หรือแพ็กสำหรับธุรกิจเฉพาะทาง
        </p>

        <div style={buttonRowCenterStyle}>
         <Link href="/contact?type=interest-premium">
            <button style={darkButtonStyle}>แจ้งความต้องการแพ็ก</button>
          </Link>

          <Link href="/pricing">
            <button style={darkSecondaryButtonStyle}>กลับไปดูราคาแพ็กเกจ</button>
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
  fontSize: "clamp(34px, 8vw, 48px)",
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

const noticeStyle: CSSProperties = {
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const noticeTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  margin: 0,
};

const sectionStyle: CSSProperties = {
  marginTop: "30px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const packGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "18px",
  marginTop: "20px",
};

const packCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const packTitleStyle: CSSProperties = {
  fontSize: "24px",
  marginTop: 0,
};

const packTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.8",
};

const exampleListStyle: CSSProperties = {
  display: "grid",
  gap: "10px",
  marginTop: "16px",
};

const exampleItemStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  color: "#374151",
  lineHeight: "1.6",
};

const checkStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const userGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "14px",
  marginTop: "20px",
};

const userItemStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const dotStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const userTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const qualityGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const qualityCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const qualityTextStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.8",
  marginBottom: 0,
};

const timelineStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  marginTop: "20px",
};

const timelineItemStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "48px minmax(0,1fr)",
  gap: "14px",
  padding: "18px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const stepNumberStyle: CSSProperties = {
  width: "48px",
  height: "48px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const timelineTitleStyle: CSSProperties = {
  margin: "0 0 6px",
};

const timelineTextStyle: CSSProperties = {
  margin: 0,
  color: "#555",
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