import type { CSSProperties } from "react";
import Link from "next/link";

const samplePacks = [
  {
    category: "TikTok / Reels / Shorts",
    title: "แพ็ก Hook สำหรับคลิปสั้น",
    description:
      "ตัวอย่าง Hook สำหรับเปิดคลิปให้คนหยุดดู เหมาะกับครีเอเตอร์ที่ทำคลิปสั้นทุกวัน",
    freeSamples: [
      "คนส่วนใหญ่พลาดเรื่องนี้โดยไม่รู้ตัว",
      "ก่อนจะทำสิ่งนี้ ลองดูข้อนี้ก่อน",
      "นี่คือเหตุผลที่หลายคนทำแล้วไม่เห็นผล",
    ],
    premiumSamples: [
      "เปิดคลิปด้วยปัญหาที่คนดูเจอจริง แล้วค่อยเฉลยวิธีแก้",
      "ใช้ประโยคชวนสงสัยก่อนโชว์ผลลัพธ์ เพื่อดึงให้ดูต่อจนจบ",
      "เปลี่ยนความรู้ธรรมดาให้กลายเป็น Hook แบบมีแรงจูงใจ",
    ],
  },
  {
    category: "ขายของออนไลน์",
    title: "แพ็ก Hook + CTA สำหรับปิดการขาย",
    description:
      "ตัวอย่างประโยคเปิดและประโยคปิดสำหรับโพสต์ขายสินค้า บริการ หรือโปรโมชัน",
    freeSamples: [
      "ใครกำลังมองหาวิธีประหยัดเวลา ลองดูตัวนี้",
      "ของชิ้นนี้เหมาะกับคนที่เจอปัญหานี้บ่อย ๆ",
      "ก่อนซื้อ ลองเช็ก 3 ข้อนี้ก่อน",
    ],
    premiumSamples: [
      "Hook แบบชี้ปัญหา → เสนอผลลัพธ์ → ปิดด้วยเหตุผลให้ตัดสินใจง่าย",
      "CTA แบบไม่ขายแข็ง แต่ทำให้ลูกค้ารู้สึกว่าควรถามรายละเอียดเพิ่ม",
      "โครงโพสต์ขายของ 1 ชิ้นแบบใช้ซ้ำได้หลายสินค้า",
    ],
  },
  {
    category: "ความงาม / สกินแคร์",
    title: "แพ็กคอนเทนต์สำหรับ Beauty Creator",
    description:
      "ตัวอย่าง Hook สำหรับรีวิวสินค้า ความรู้ผิว และคอนเทนต์แนวแก้ปัญหาความงาม",
    freeSamples: [
      "ทำไมใช้สกินแคร์หลายตัวแล้วผิวยังไม่ดีขึ้น",
      "ข้อผิดพลาดที่หลายคนทำตอนล้างหน้า",
      "ถ้าผิวแห้งง่าย ลองเช็กสิ่งนี้ก่อน",
    ],
    premiumSamples: [
      "Hook แบบเจาะกลุ่มผิวเฉพาะ เช่น ผิวมัน ผิวแห้ง ผิวแพ้ง่าย",
      "โครงสคริปต์รีวิวสินค้าแบบดูน่าเชื่อถือ ไม่เหมือนขายตรง",
      "ชุดคำเปิดคลิปสำหรับคอนเทนต์ Before / After",
    ],
  },
  {
    category: "ฟิตเนส / สุขภาพ",
    title: "แพ็ก Hook สำหรับ Fitness Content",
    description:
      "ตัวอย่างประโยคสำหรับคอนเทนต์ออกกำลังกาย ลดน้ำหนัก และดูแลสุขภาพ",
    freeSamples: [
      "ออกกำลังกายทุกวัน แต่ทำไมรูปร่างยังไม่เปลี่ยน",
      "ท่านี้หลายคนทำผิดโดยไม่รู้ตัว",
      "ก่อนลดน้ำหนัก ลองเข้าใจเรื่องนี้ก่อน",
    ],
    premiumSamples: [
      "Hook แบบเปรียบเทียบความเชื่อผิดกับวิธีที่ถูกต้อง",
      "โครงคลิปสั้น 30 วินาทีสำหรับสอนท่าออกกำลังกาย",
      "CTA สำหรับชวนคนติดตามโดยไม่ทำให้รู้สึกถูกขาย",
    ],
  },
];

const packageLevels = [
  {
    level: "Free",
    title: "ตัวอย่างฟรี",
    description:
      "เหมาะสำหรับทดลองใช้งาน ดูแนวทาง Hook และไอเดียคอนเทนต์เบื้องต้น",
    items: [
      "เห็นตัวอย่าง Hook บางส่วน",
      "ใช้เป็นไอเดียตั้งต้น",
      "เหมาะกับคนเริ่มทำคอนเทนต์",
    ],
  },
  {
    level: "Pro",
    title: "แพ็กพร้อมใช้งานมากขึ้น",
    description:
      "เหมาะกับคนที่ต้องการ Hook / CTA / โครงโพสต์ที่นำไปใช้ได้จริงมากกว่าเดิม",
    items: [
      "จำนวนตัวอย่างมากขึ้น",
      "แยกตามหมวดชัดเจน",
      "เหมาะกับครีเอเตอร์และร้านค้า",
    ],
  },
  {
    level: "Premium",
    title: "แพ็กคุณภาพสูงเฉพาะทาง",
    description:
      "เหมาะกับคนที่ต้องการชุดคอนเทนต์เฉพาะธุรกิจ พร้อมแนวคิดและโครงสร้างใช้งาน",
    items: [
      "เจาะกลุ่มธุรกิจเฉพาะ",
      "มี Hook + CTA + Script",
      "เหมาะกับการนำไปขายหรือทำงานจริง",
    ],
  },
];

export default function SamplesPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>Samples / ตัวอย่างแพ็ก</p>

        <h1 style={titleStyle}>
          ดูตัวอย่างแพ็กก่อนตัดสินใจว่า Creator OS ช่วยคุณได้แค่ไหน
        </h1>

        <p style={subtitleStyle}>
          หน้านี้รวมตัวอย่าง Hook, CTA และแนวทางสคริปต์บางส่วน
          เพื่อให้ผู้ใช้เห็นภาพว่าแพ็กคอนเทนต์ของ Creator OS จะช่วยเริ่มคิดคอนเทนต์ได้เร็วขึ้นอย่างไร
        </p>

        <div style={buttonRowStyle}>
          <Link href="/pricing">
            <button style={primaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>

          <Link href="/premium">
            <button style={secondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
          </Link>

          <Link href="/contact?type=interest-premium">
            <button style={secondaryButtonStyle}>สนใจแพ็กนี้</button>
          </Link>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ระดับแพ็ก</p>

        <h2 style={sectionTitleStyle}>Creator OS แบ่งตัวอย่างเป็น 3 ระดับ</h2>

        <div style={levelGridStyle}>
          {packageLevels.map((pack) => (
            <article key={pack.level} style={levelCardStyle}>
              <span style={levelBadgeStyle}>{pack.level}</span>

              <h3 style={cardTitleStyle}>{pack.title}</h3>

              <p style={cardTextStyle}>{pack.description}</p>

              <div style={itemListStyle}>
                {pack.items.map((item) => (
                  <div key={item} style={itemRowStyle}>
                    <span style={checkStyle}>✓</span>
                    <p style={itemTextStyle}>{item}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ตัวอย่างตามหมวด</p>

        <h2 style={sectionTitleStyle}>ตัวอย่างแพ็กที่อาจพัฒนาต่อเป็นชุดขายจริง</h2>

        <div style={sampleGridStyle}>
          {samplePacks.map((pack) => (
            <article key={pack.category} style={sampleCardStyle}>
              <p style={categoryStyle}>{pack.category}</p>

              <h3 style={sampleTitleStyle}>{pack.title}</h3>

              <p style={cardTextStyle}>{pack.description}</p>

              <div style={sampleBoxStyle}>
                <p style={boxTitleStyle}>ตัวอย่างฟรี</p>

                <div style={itemListStyle}>
                  {pack.freeSamples.map((sample) => (
                    <div key={sample} style={sampleRowStyle}>
                      <span style={dotStyle}>•</span>
                      <p style={sampleTextStyle}>{sample}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={premiumBoxStyle}>
                <p style={premiumTitleStyle}>ตัวอย่างแนว Premium</p>

                <div style={itemListStyle}>
                  {pack.premiumSamples.map((sample) => (
                    <div key={sample} style={sampleRowStyle}>
                      <span style={lockStyle}>★</span>
                      <p style={sampleTextStyle}>{sample}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={noticeStyle}>
        <h2 style={{ marginTop: 0 }}>หมายเหตุ</h2>

        <p style={noticeTextStyle}>
          ตัวอย่างในหน้านี้เป็นเพียงตัวอย่างบางส่วน เพื่อให้เห็นแนวทางของแพ็ก
          รายละเอียดจริงของแพ็ก Pro และ Premium สามารถปรับตามหมวดที่ผู้ใช้ต้องการได้
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/contact?type=custom-pack">
            <button style={darkButtonStyle}>เสนอแพ็กหมวดเฉพาะ</button>
          </Link>

          <Link href="/contact?type=feedback">
            <button style={darkSecondaryButtonStyle}>ส่งข้อเสนอแนะ</button>
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

const levelGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "16px",
};

const levelCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const levelBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
};

const cardTitleStyle: CSSProperties = {
  fontSize: "23px",
  margin: "14px 0 8px",
};

const cardTextStyle: CSSProperties = {
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

const sampleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "18px",
};

const sampleCardStyle: CSSProperties = {
  padding: "22px",
  borderRadius: "24px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const categoryStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const sampleTitleStyle: CSSProperties = {
  fontSize: "24px",
  margin: "8px 0",
};

const sampleBoxStyle: CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "18px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const premiumBoxStyle: CSSProperties = {
  marginTop: "14px",
  padding: "16px",
  borderRadius: "18px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const boxTitleStyle: CSSProperties = {
  marginTop: 0,
  fontWeight: "bold",
  color: "#111827",
};

const premiumTitleStyle: CSSProperties = {
  marginTop: 0,
  fontWeight: "bold",
  color: "#4f46e5",
};

const sampleRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
};

const dotStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const lockStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const sampleTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const noticeStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const noticeTextStyle: CSSProperties = {
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
