import type { CSSProperties } from "react";
import Link from "next/link";

const gates = [
  {
    title: "Intent & Direction Gate",
    text: "ประเภทงาน ทิศทาง ผู้ชม เป้าหมาย สิ่งที่ต้องการให้ผู้ชมทำ น้ำเสียง และสิ่งที่ต้องการให้ Creator OS ช่วย ต้องตรงกับข้อมูลคำสั่งซื้อ",
  },
  {
    title: "Ready-to-Execute Gate",
    text: "แต่ละวันต้องมีงานที่เอาไปทำต่อได้จริง เช่น Hook/บทหรือลำดับทำ Shot/ภาพ Caption CTA สิ่งที่ต้องเตรียม งานหลังโพสต์ และแผนสำรองตามรูปแบบนั้น",
  },
  {
    title: "Reality Gate",
    text: "ตรวจเวลาต่อวัน จำนวนช็อต ฉาก คน และอุปกรณ์ให้ไม่เกินความพร้อมที่ลูกค้าเลือก โดยลดความซับซ้อนแทนการออกแบบงานที่สวยบนกระดาษแต่ทำจริงไม่ได้",
  },
  {
    title: "Constraint Gate",
    text: "ข้อจำกัดสำคัญ เช่น ไม่มีบทพูด ไร้ภาษา ไม่ใช้ข้อความบนจอ ทำคนเดียว ไม่ออกหน้า ไม่มีงบ หรือใช้อุปกรณ์จำกัด ต้องไม่ถูกละเมิดในแผน",
  },
  {
    title: "Truth & Claims Gate",
    text: "ห้ามแต่งราคา โปรโมชั่น ผลลัพธ์ หลักฐาน หรือคำรับประกันที่ลูกค้าไม่ได้ให้ และตรวจคำกล่าวอ้างที่ลูกค้าห้ามใช้",
  },
  {
    title: "Repeat Novelty Gate",
    text: "ตั้งแต่สัปดาห์ที่ 2 ระบบเปรียบเทียบ Topic/Hook วิธีทำ บท Shot Caption CTA และโครงสร้างกับหลายสัปดาห์ก่อนหน้า เพื่อไม่ส่งแผนเดิมที่เพียงเปลี่ยนคำ",
  },
];

export default function QualityPage() {
  return (
    <main style={mainStyle}>
      <section style={heroStyle}>
        <p style={labelStyle}>Creator OS Quality System</p>
        <h1 style={titleStyle}>แผนต้องผ่านอย่างน้อย 85/100 และไม่มี Critical Issue ก่อนเปิดให้ลูกค้า</h1>
        <p style={subtitleStyle}>
          คะแนนอย่างเดียวไม่พอ หากเจอข้อผิดพลาดสำคัญ เช่น ผิดทิศทาง ฝ่าฝืนข้อจำกัด ทำไม่ทันเวลาที่ลูกค้ามี หรือใช้คำกล่าวอ้างต้องห้าม ระบบจะถือว่าไม่ผ่านแม้คะแนนรวมสูง
        </p>
        <div style={buttonRowStyle}>
          <Link href="/samples" style={secondaryLinkStyle}>ดูตัวอย่างแผน</Link>
          <Link href="/start" style={primaryLinkStyle}>เริ่มสร้างแผน</Link>
        </div>
      </section>

      <section style={scoreGridStyle}>
        <article style={scoreCardStyle}>
          <p style={scoreLabelStyle}>คะแนนขั้นต่ำ</p>
          <strong style={scoreNumberStyle}>85/100</strong>
          <p style={scoreTextStyle}>ต้องผ่านพร้อมกันกับ Critical Gate ทุกข้อ</p>
        </article>
        <article style={scoreCardStyle}>
          <p style={scoreLabelStyle}>ทิศทางที่รองรับ</p>
          <strong style={scoreNumberStyle}>20</strong>
          <p style={scoreTextStyle}>สินค้า 6 · บริการ 6 · ครีเอเตอร์ 8</p>
        </article>
        <article style={scoreCardStyle}>
          <p style={scoreLabelStyle}>แผนต่อคำสั่งซื้อ</p>
          <strong style={scoreNumberStyle}>7 วัน</strong>
          <p style={scoreTextStyle}>ปรับความหนักตามเวลาและความสามารถที่เลือก</p>
        </article>
      </section>

      <section style={sectionStyle}>
        <p style={sectionLabelStyle}>สิ่งที่ระบบตรวจ</p>
        <h2 style={sectionTitleStyle}>Quality Gate ไม่ได้ตรวจแค่ว่ามีข้อความครบหรือไม่</h2>
        <div style={gateGridStyle}>
          {gates.map((gate) => (
            <article key={gate.title} style={gateCardStyle}>
              <h3 style={gateTitleStyle}>{gate.title}</h3>
              <p style={gateTextStyle}>{gate.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={noticeStyle}>
        <h2 style={noticeTitleStyle}>100/100 ไม่ได้แปลว่าจะไวรัลหรือขายได้แน่นอน</h2>
        <p style={noticeTextStyle}>
          คะแนนหมายถึงแผนผ่านมาตรฐานภายในของ Creator OS ในด้านความตรง ความครบ ความเป็นไปได้ และข้อจำกัด ผลลัพธ์จริงยังขึ้นอยู่กับสินค้า ราคา บัญชี คุณภาพการถ่าย/ตัดต่อ การลงมือทำ และผู้ชมจริง
        </p>
      </section>
    </main>
  );
}

const mainStyle: CSSProperties = { maxWidth: "1100px", margin: "0 auto", padding: "24px" };
const heroStyle: CSSProperties = { padding: "42px 24px", borderRadius: "28px", background: "#111827", color: "white" };
const labelStyle: CSSProperties = { color: "#a5b4fc", fontWeight: 900, margin: 0 };
const titleStyle: CSSProperties = { fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 1.12, margin: "12px 0", maxWidth: "980px" };
const subtitleStyle: CSSProperties = { color: "#d1d5db", fontSize: "18px", lineHeight: 1.8, maxWidth: "900px" };
const buttonRowStyle: CSSProperties = { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "20px" };
const primaryLinkStyle: CSSProperties = { padding: "12px 18px", borderRadius: "14px", background: "#4f46e5", color: "white", textDecoration: "none", fontWeight: 800 };
const secondaryLinkStyle: CSSProperties = { padding: "12px 18px", borderRadius: "14px", background: "white", color: "#111827", textDecoration: "none", fontWeight: 800 };
const scoreGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginTop: "20px" };
const scoreCardStyle: CSSProperties = { padding: "20px", borderRadius: "20px", background: "white", border: "1px solid #e5e7eb" };
const scoreLabelStyle: CSSProperties = { margin: 0, color: "#64748b", fontWeight: 800 };
const scoreNumberStyle: CSSProperties = { display: "block", marginTop: "8px", fontSize: "32px", color: "#111827" };
const scoreTextStyle: CSSProperties = { margin: "8px 0 0", color: "#475569", lineHeight: 1.6 };
const sectionStyle: CSSProperties = { marginTop: "20px", padding: "24px", borderRadius: "24px", background: "white", border: "1px solid #e5e7eb" };
const sectionLabelStyle: CSSProperties = { margin: 0, color: "#4f46e5", fontWeight: 900 };
const sectionTitleStyle: CSSProperties = { margin: "8px 0 18px", fontSize: "28px" };
const gateGridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" };
const gateCardStyle: CSSProperties = { padding: "18px", borderRadius: "18px", background: "#f8fafc", border: "1px solid #e2e8f0" };
const gateTitleStyle: CSSProperties = { margin: 0, fontSize: "18px" };
const gateTextStyle: CSSProperties = { margin: "8px 0 0", color: "#475569", lineHeight: 1.7 };
const noticeStyle: CSSProperties = { marginTop: "20px", padding: "24px", borderRadius: "24px", background: "#fff7ed", border: "1px solid #fed7aa" };
const noticeTitleStyle: CSSProperties = { margin: 0, fontSize: "22px" };
const noticeTextStyle: CSSProperties = { margin: "8px 0 0", color: "#7c2d12", lineHeight: 1.75 };
