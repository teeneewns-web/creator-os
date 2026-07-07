import type { CSSProperties } from "react";
import Link from "next/link";

const productStats = [
  {
    number: "180+",
    label: "Hook พร้อมใช้",
    text: "แบ่งตามอารมณ์และเป้าหมายของคลิป",
  },
  {
    number: "20",
    label: "สูตร Hook",
    text: "ใช้เป็นโครงสร้างคิดประโยคใหม่ได้เอง",
  },
  {
    number: "30",
    label: "CTA",
    text: "ใช้ปิดคลิป ชวนติดตาม ชวนคอมเมนต์ หรือชวนทักหา",
  },
  {
    number: "20",
    label: "ตัวอย่างสคริปต์",
    text: "ตัวอย่างโครงคลิปสั้น 15–30 วินาที",
  },
];

const deliverables = [
  {
    title: "Hook พร้อมใช้ 180+ ประโยค",
    text: "ประโยคเปิดคลิปสำหรับ TikTok, Reels และ Shorts แยกตามเป้าหมาย เช่น ดึงความสงสัย เตือนความผิดพลาด ให้ประโยชน์เร็ว และชวนดูต่อ",
  },
  {
    title: "สูตร Hook 20 สูตร",
    text: "ไม่ใช่แค่ให้ประโยค แต่ให้โครงสร้างที่ช่วยคิด Hook ใหม่ได้เอง เช่น ปัญหา → ผลลัพธ์, ความเชื่อผิด → ความจริง, ก่อนทำ → ต้องรู้",
  },
  {
    title: "CTA 30 แบบ",
    text: "ประโยคปิดคลิปสำหรับชวนติดตาม ชวนคอมเมนต์ ชวนแชร์ ชวนทักหา หรือชวนดูคลิปถัดไป โดยไม่ขายแข็งเกินไป",
  },
  {
    title: "ตัวอย่างสคริปต์ 20 ชุด",
    text: "ตัวอย่างการนำ Hook ไปต่อเป็นคลิปสั้นจริง เพื่อให้ผู้ใช้เห็นว่าควรเริ่ม พูดต่อ และปิดคลิปอย่างไร",
  },
  {
    title: "คู่มือเลือก Hook",
    text: "ช่วยบอกว่า Hook แบบไหนเหมาะกับคลิปให้ความรู้ คลิปขายของ คลิปรีวิว คลิปเตือนข้อผิดพลาด หรือคลิปเล่าเรื่อง",
  },
  {
    title: "แนวทางปรับใช้หลายหมวด",
    text: "นำไปปรับกับความงาม สุขภาพ การเงิน เกม ร้านอาหาร ฟิตเนส ขายของออนไลน์ หรือคอนเทนต์ส่วนตัวได้",
  },
];

const qualityRules = [
  "ต้องทำให้คนดูสงสัยหรืออยากรู้ต่อ",
  "ต้องชี้ปัญหาที่คนดูเข้าใจได้เร็ว",
  "ต้องพูดออกเสียงจริงได้ ไม่แข็งเหมือนหุ่นยนต์",
  "ต้องต่อเป็นเนื้อคลิปได้ทันที",
  "ต้องไม่สัญญาเกินจริงหรือหลอกคนดู",
  "ต้องปรับใช้กับหลายหมวดได้ ไม่แคบเกินไป",
];

const hookCategories = [
  {
    title: "Hook แบบกระตุ้นความสงสัย",
    samples: [
      "หลายคนทำคลิปแบบนี้ทุกวัน แต่พลาดจุดสำคัญไปอย่างหนึ่ง",
      "ถ้าคุณอยากให้คนหยุดดูคลิป ลองเริ่มด้วยประโยคแบบนี้",
      "เรื่องนี้ดูเล็กมาก แต่เป็นเหตุผลที่ทำให้คนเลื่อนผ่านคลิปคุณ",
    ],
  },
  {
    title: "Hook แบบชี้ความผิดพลาด",
    samples: [
      "หยุดทำสิ่งนี้ก่อน ถ้ายังอยากให้คลิปมีคนดูต่อ",
      "ครีเอเตอร์มือใหม่มักพลาด 3 เรื่องนี้โดยไม่รู้ตัว",
      "ถ้าคลิปเปิดมาน่าเบื่อ คนดูจะตัดสินใจเลื่อนผ่านเร็วมาก",
    ],
  },
  {
    title: "Hook แบบให้ประโยชน์เร็ว",
    samples: [
      "นี่คือวิธีคิด Hook แบบง่ายที่ใช้ได้กับแทบทุกคลิป",
      "ลองใช้โครงนี้ก่อนโพสต์คลิปถัดไป",
      "ถ้าคิดคอนเทนต์ไม่ออก ให้เริ่มจากคำถามนี้",
    ],
  },
  {
    title: "Hook แบบขายของออนไลน์",
    samples: [
      "ก่อนซื้อสินค้านี้ ลองเช็ก 3 ข้อนี้ก่อน",
      "ของชิ้นนี้เหมาะกับคนที่เจอปัญหานี้บ่อย ๆ",
      "ถ้าคุณเสียเวลากับเรื่องนี้ทุกวัน ตัวนี้อาจช่วยได้",
    ],
  },
];

const useCases = [
  {
    title: "ครีเอเตอร์มือใหม่",
    text: "ใช้เป็นคลังประโยคเริ่มต้น ไม่ต้องนั่งคิดจากศูนย์ทุกครั้งก่อนถ่ายคลิป",
  },
  {
    title: "ร้านค้าออนไลน์",
    text: "ใช้เปิดคลิปขายสินค้า รีวิวสินค้า หรืออธิบายประโยชน์ของสินค้าให้น่าสนใจขึ้น",
  },
  {
    title: "คนทำคลิปให้ความรู้",
    text: "ใช้เปลี่ยนความรู้ธรรมดาให้เปิดคลิปได้น่าติดตามมากขึ้น",
  },
  {
    title: "คนทำคอนเทนต์ทุกวัน",
    text: "ใช้เป็นระบบช่วยคิดเร็ว ลดเวลาหาไอเดียและลดอาการตัน",
  },
];

const workflowSteps = [
  {
    title: "1. เลือกเป้าหมายคลิป",
    text: "ก่อนเลือก Hook ให้รู้ก่อนว่าคลิปนี้ต้องการให้คนดูรู้สึกอะไร เช่น อยากรู้ กลัวพลาด ได้ประโยชน์ หรืออยากทักหา",
  },
  {
    title: "2. เลือกหมวด Hook",
    text: "เลือก Hook จากหมวดที่ตรงกับเป้าหมาย เช่น สงสัย เตือนข้อผิดพลาด ให้ความรู้ หรือขายของ",
  },
  {
    title: "3. ปรับให้เข้ากับเรื่องของคุณ",
    text: "เปลี่ยนคำบางส่วนให้เข้ากับสินค้า บริการ หรือเนื้อหาของตัวเอง",
  },
  {
    title: "4. ต่อเป็นสคริปต์สั้น",
    text: "ใช้ Hook เป็นประโยคเปิด แล้วต่อด้วยปัญหา วิธีแก้ ตัวอย่าง และ CTA ปิดท้าย",
  },
];

const valuePoints = [
  "ช่วยลดเวลาคิดประโยคเปิดคลิป",
  "ช่วยให้เริ่มเขียนสคริปต์ได้เร็วขึ้น",
  "ช่วยให้มีคลัง Hook ไว้ใช้ซ้ำ",
  "ช่วยให้คอนเทนต์ดูเป็นระบบกว่าเดิม",
  "ช่วยให้มือใหม่เริ่มทำคลิปได้ง่ายขึ้น",
];

const notPromise = [
  "ไม่รับประกันว่าคลิปจะไวรัล",
  "ไม่ใช่ระบบตัดต่อวิดีโออัตโนมัติ",
  "ไม่ใช่ AI สร้างคลิปทั้งคลิป",
  "ไม่ใช่สูตรรวยเร็ว",
];

export default function TikTokHooksPackPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>Creator OS First Product</p>

        <h1 style={titleStyle}>
          TikTok Hook Pack V1 แพ็ก Hook สำหรับคลิปสั้นที่ออกแบบมาให้ใช้ได้จริง
        </h1>

        <p style={subtitleStyle}>
          แพ็กนี้ไม่ได้ขายแค่ “ประโยคเปิดคลิป” แต่ขายระบบช่วยเริ่มคอนเทนต์
          สำหรับคนที่อยากทำ TikTok, Reels และ Shorts ให้เร็วขึ้น มีทิศทางขึ้น
          และไม่ต้องเริ่มคิดจากศูนย์ทุกครั้ง
        </p>

        <div style={priceBoxStyle}>
          <p style={priceLabelStyle}>ราคาเปิดตัวทดลอง</p>
          <h2 style={priceStyle}>199 บาท</h2>
          <p style={priceNoteStyle}>
            เหมาะสำหรับ Soft Launch รอบแรก เพื่อทดสอบว่าผู้ใช้สนใจแพ็ก Hook
            คุณภาพสูงมากแค่ไหน ก่อนต่อยอดเป็นแพ็ก Pro / Premium ในอนาคต
          </p>
        </div>

        <div style={buttonRowStyle}>
          <Link href="/contact?type=interest-premium">
            <button style={primaryButtonStyle}>สนใจแพ็กนี้</button>
          </Link>

          <Link href="/samples">
            <button style={secondaryButtonStyle}>ดูตัวอย่างแพ็ก</button>
          </Link>

          <Link href="/launch-checklist">
            <button style={secondaryButtonStyle}>ดูแผนเปิดตัว</button>
          </Link>
        </div>
      </section>

      <section style={statsGridStyle}>
        {productStats.map((stat) => (
          <article key={stat.label} style={statCardStyle}>
            <h2 style={statNumberStyle}>{stat.number}</h2>
            <p style={statLabelStyle}>{stat.label}</p>
            <p style={statTextStyle}>{stat.text}</p>
          </article>
        ))}
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Product Value</p>

        <h2 style={sectionTitleStyle}>สินค้านี้มีมูลค่าตรงไหน?</h2>

        <p style={sectionIntroStyle}>
          ลูกค้าไม่ได้จ่ายเงินเพื่อซื้อ “คำสวย ๆ” อย่างเดียว แต่จ่ายเพื่อซื้อเวลา
          ซื้อระบบคิด และซื้อจุดเริ่มต้นที่ช่วยให้เริ่มทำคลิปได้ง่ายขึ้น
        </p>

        <div style={valueGridStyle}>
          {valuePoints.map((item) => (
            <div key={item} style={checkRowStyle}>
              <span style={checkIconStyle}>✓</span>
              <p style={checkTextStyle}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>What You Get</p>

        <h2 style={sectionTitleStyle}>สิ่งที่ลูกค้าจะได้รับในแพ็กนี้</h2>

        <div style={deliverableGridStyle}>
          {deliverables.map((item) => (
            <article key={item.title} style={deliverableCardStyle}>
              <h3 style={cardTitleStyle}>{item.title}</h3>
              <p style={cardTextStyle}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Quality Standard</p>

        <h2 style={sectionTitleStyle}>มาตรฐานคัด Hook ก่อนใส่เข้าแพ็ก</h2>

        <p style={sectionIntroStyle}>
          Hook ที่อยู่ในแพ็กควรผ่านเกณฑ์คุณภาพ ไม่ใช่ประโยคที่สุ่มขึ้นมาเฉย ๆ
          เพื่อให้สินค้ามีมูลค่ามากพอและไม่ดูเหมือนของที่ AI สร้างแบบหยาบ ๆ
        </p>

        <div style={qualityGridStyle}>
          {qualityRules.map((rule) => (
            <div key={rule} style={qualityRowStyle}>
              <span style={checkIconStyle}>✓</span>
              <p style={checkTextStyle}>{rule}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Sample Hooks</p>

        <h2 style={sectionTitleStyle}>ตัวอย่าง Hook บางส่วน</h2>

        <div style={sampleGridStyle}>
          {hookCategories.map((group) => (
            <article key={group.title} style={sampleCardStyle}>
              <h3 style={cardTitleStyle}>{group.title}</h3>

              <div style={itemListStyle}>
                {group.samples.map((sample) => (
                  <div key={sample} style={itemRowStyle}>
                    <span style={dotStyle}>•</span>
                    <p style={itemTextStyle}>{sample}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>Use Cases</p>

        <h2 style={sectionTitleStyle}>เหมาะกับใคร</h2>

        <div style={useCaseGridStyle}>
          {useCases.map((item) => (
            <article key={item.title} style={useCaseCardStyle}>
              <h3 style={cardTitleStyle}>{item.title}</h3>
              <p style={cardTextStyle}>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>How To Use</p>

        <h2 style={sectionTitleStyle}>วิธีใช้แพ็กนี้ให้เกิดประโยชน์</h2>

        <div style={stepGridStyle}>
          {workflowSteps.map((step) => (
            <article key={step.title} style={stepCardStyle}>
              <h3 style={stepTitleStyle}>{step.title}</h3>
              <p style={cardTextStyle}>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={twoColumnStyle}>
        <article style={sectionStyle}>
          <p style={labelStyle}>Honest Scope</p>

          <h2 style={sectionTitleStyle}>สิ่งที่เราไม่ควรสัญญาเกินจริง</h2>

          <div style={itemListStyle}>
            {notPromise.map((item) => (
              <div key={item} style={warningRowStyle}>
                <span style={warningIconStyle}>!</span>
                <p style={itemTextStyle}>{item}</p>
              </div>
            ))}
          </div>
        </article>

        <article style={sectionStyle}>
          <p style={labelStyle}>Why 199 THB</p>

          <h2 style={sectionTitleStyle}>ทำไมราคาเปิดตัว 199 บาท</h2>

          <p style={cardTextStyle}>
            ราคา 199 บาทเหมาะกับการทดสอบตลาด เพราะไม่สูงจนคนลังเลมากเกินไป
            แต่ยังพอสะท้อนว่าของนี้ไม่ใช่แค่ของแจกฟรี หากแพ็กนี้ช่วยประหยัดเวลาคิดคอนเทนต์ได้หลายชั่วโมง
            ราคานี้ถือว่าเป็นจุดเริ่มต้นที่สมเหตุสมผลสำหรับ Soft Launch
          </p>
        </article>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>ใช้แพ็กนี้เป็นสินค้าทดลองตัวแรกของ Creator OS</h2>

        <p style={bottomTextStyle}>
          เป้าหมายรอบแรกไม่ใช่ขายให้เยอะที่สุดทันที แต่คือทดสอบว่าคนสนใจจ่ายเพื่อประหยัดเวลา
          และได้ระบบช่วยคิดคอนเทนต์จริงหรือไม่ ถ้ามีคนสนใจ เราจะต่อยอดเป็นแพ็กที่ใหญ่ขึ้นได้
        </p>

        <div style={buttonRowCenterStyle}>
          <Link href="/contact?type=interest-premium">
            <button style={darkButtonStyle}>สนใจแพ็กนี้</button>
          </Link>

          <Link href="/pricing">
            <button style={darkSecondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
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
  fontSize: "clamp(34px, 8vw, 48px)",
  lineHeight: "1.12",
  margin: "12px 0",
  maxWidth: "1000px",
};

const subtitleStyle: CSSProperties = {
  color: "#d1d5db",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "900px",
};

const priceBoxStyle: CSSProperties = {
  marginTop: "22px",
  padding: "18px",
  borderRadius: "20px",
  background: "#1f2937",
  border: "1px solid #374151",
  maxWidth: "520px",
};

const priceLabelStyle: CSSProperties = {
  margin: 0,
  color: "#c7d2fe",
  fontWeight: "bold",
};

const priceStyle: CSSProperties = {
  margin: "8px 0",
  fontSize: "36px",
};

const priceNoteStyle: CSSProperties = {
  margin: 0,
  color: "#d1d5db",
  lineHeight: "1.7",
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
  gap: "16px",
  marginTop: "24px",
};

const statCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "white",
  border: "1px solid #e5e7eb",
};

const statNumberStyle: CSSProperties = {
  margin: 0,
  fontSize: "38px",
  color: "#4f46e5",
};

const statLabelStyle: CSSProperties = {
  margin: "8px 0",
  fontWeight: "bold",
  fontSize: "18px",
};

const statTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
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

const sectionIntroStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  maxWidth: "900px",
};

const valueGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
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

const checkIconStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
};

const checkTextStyle: CSSProperties = {
  margin: 0,
  color: "#374151",
  lineHeight: "1.7",
};

const deliverableGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "18px",
};

const deliverableCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const cardTitleStyle: CSSProperties = {
  fontSize: "22px",
  margin: "0 0 12px",
};

const cardTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
};

const qualityGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const qualityRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  padding: "14px",
  borderRadius: "16px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const sampleGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
  gap: "18px",
};

const sampleCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
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

const useCaseGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "16px",
};

const useCaseCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "22px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const stepGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: "16px",
};

const stepCardStyle: CSSProperties = {
  padding: "18px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
};

const stepTitleStyle: CSSProperties = {
  marginTop: 0,
  color: "#111827",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "20px",
};

const warningRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
};

const warningIconStyle: CSSProperties = {
  color: "#ea580c",
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
  maxWidth: "820px",
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