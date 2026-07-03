import type { CSSProperties } from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>เกี่ยวกับ Creator OS</p>

        <h1 style={titleStyle}>
          ระบบผู้ช่วยทำคอนเทนต์สำหรับคนที่ไม่อยากเริ่มจากหน้าว่าง
        </h1>

        <p style={subtitleStyle}>
          Creator OS ถูกออกแบบมาเพื่อช่วยให้ Creator, เจ้าของเพจ, เจ้าของร้าน
          ฟรีแลนซ์ และคนทำคอนเทนต์ มีระบบเริ่มงานที่ชัดขึ้น ตั้งแต่หา Hook,
          เขียนแคปชัน, เลือก CTA, ทำสคริปต์, ตรวจคุณภาพ และวางแผนรายวัน
        </p>

        <div style={buttonRowStyle}>
          <Link href="/dashboard">
            <button style={primaryButtonStyle}>เริ่มภารกิจวันนี้</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>เปิดคลัง Hook</button>
          </Link>

          <Link href="/pricing">
            <button style={secondaryButtonStyle}>ดูราคาแพ็กเกจ</button>
          </Link>
        </div>
      </section>

      <section style={summaryGridStyle}>
        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>เป้าหมาย</p>
          <h2 style={summaryTitleStyle}>ช่วยให้เริ่มเร็วขึ้น</h2>
          <p style={mutedTextStyle}>
            ไม่ต้องคิดทุกอย่างจากศูนย์ มีตัวอย่างและขั้นตอนให้เริ่มทำงานได้ทันที
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>จุดเด่น</p>
          <h2 style={summaryTitleStyle}>มีระบบคัดคุณภาพ</h2>
          <p style={mutedTextStyle}>
            ไม่ใช่แค่รวมข้อความ แต่มีการแยกระดับว่าอะไรพร้อมใช้ อะไรควรปรับ
          </p>
        </article>

        <article style={summaryCardStyle}>
          <p style={summaryLabelStyle}>เหมาะกับ</p>
          <h2 style={summaryTitleStyle}>คนทำคอนเทนต์จริง</h2>
          <p style={mutedTextStyle}>
            เหมาะกับคนที่ต้องโพสต์ ทำคลิป หรือขายของออนไลน์อย่างสม่ำเสมอ
          </p>
        </article>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>เว็บนี้ช่วยอะไร</p>

        <h2 style={{ margin: "6px 0" }}>จากไอเดีย → เป็นคอนเทนต์ที่ใช้ได้จริง</h2>

        <div style={featureGridStyle}>
          <article style={featureCardStyle}>
            <h3>1. หา Hook หรือประโยคเปิด</h3>
            <p>
              ใช้คลัง Hook และหน้าค้นหา เพื่อหาไอเดียเปิดโพสต์หรือเปิดคลิป
              ให้คนหยุดอ่านหรือหยุดดูได้ง่ายขึ้น
            </p>
          </article>

          <article style={featureCardStyle}>
            <h3>2. ต่อเป็นแคปชัน CTA และสคริปต์</h3>
            <p>
              เมื่่อมี Hook แล้ว สามารถต่อยอดเป็นแคปชัน คำชวนให้ทำ
              หรือโครงสคริปต์สำหรับคลิปสั้นได้
            </p>
          </article>

          <article style={featureCardStyle}>
            <h3>3. ตรวจคุณภาพก่อนใช้จริง</h3>
            <p>
              ระบบช่วยแยก Hook ที่พร้อมใช้ ออกจาก Hook ที่ควรปรับก่อน
              เพื่อให้คอนเทนต์ดูมีคุณภาพมากขึ้น
            </p>
          </article>

          <article style={featureCardStyle}>
            <h3>4. ทำงานตามแผนรายวัน</h3>
            <p>
              หน้า ภารกิจวันนี้ และ แผน 7 วัน ช่วยให้รู้ว่าควรทำอะไรต่อ
              ไม่ใช่แค่เปิดเว็บแล้วไม่รู้จะเริ่มตรงไหน
            </p>
          </article>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>เหมาะกับใคร</p>

        <h2 style={{ margin: "6px 0" }}>กลุ่มผู้ใช้หลักของ Creator OS</h2>

        <div style={userGridStyle}>
          <article style={userCardStyle}>
            <span style={iconStyle}>🎬</span>
            <h3>Creator มือใหม่</h3>
            <p>คนที่อยากเริ่มทำคอนเทนต์ แต่ยังคิดหัวข้อหรือประโยคเปิดไม่ออก</p>
          </article>

          <article style={userCardStyle}>
            <span style={iconStyle}>🛒</span>
            <h3>เจ้าของร้านออนไลน์</h3>
            <p>คนที่ต้องโพสต์ขายของ แต่ไม่อยากเขียนขายแบบเดิม ๆ ทุกวัน</p>
          </article>

          <article style={userCardStyle}>
            <span style={iconStyle}>📱</span>
            <h3>คนทำ TikTok / Reels / Shorts</h3>
            <p>คนที่ต้องการ Hook และสคริปต์สั้น ๆ สำหรับทำคลิปให้สม่ำเสมอ</p>
          </article>

          <article style={userCardStyle}>
            <span style={iconStyle}>💼</span>
            <h3>ฟรีแลนซ์และทีมคอนเทนต์</h3>
            <p>คนที่ต้องทำงานให้ลูกค้าหลายแบบ และต้องการระบบช่วยประหยัดเวลา</p>
          </article>
        </div>
      </section>

      <section style={sectionStyle}>
        <p style={labelStyle}>ทำไมเว็บนี้ถึงน่าใช้</p>

        <h2 style={{ margin: "6px 0" }}>ไม่ใช่แค่คลังข้อความ แต่เป็นระบบทำงาน</h2>

        <div style={trustGridStyle}>
          <article style={trustCardStyle}>
            <h3>มีการจัดหมวดชัดเจน</h3>
            <p>
              Hook และคอนเทนต์ถูกแยกตามประเภท เช่น ความงาม การเงิน เกม AI
              อาหาร ท่องเที่ยว และหมวดอื่น ๆ
            </p>
          </article>

          <article style={trustCardStyle}>
            <h3>มีคะแนนและระดับคุณภาพ</h3>
            <p>
              ระบบช่วยบอกว่า Hook อยู่ระดับพร้อมพรีเมียม, Pro, ใช้ฟรี
              หรือควรเขียนใหม่
            </p>
          </article>

          <article style={trustCardStyle}>
            <h3>มีปุ่มบันทึกไอเดีย</h3>
            <p>
              ผู้ใช้สามารถเก็บไอเดียที่ชอบไว้ แล้วกลับมาใช้ต่อในหน้า
              บันทึกไว้ ได้ง่าย
            </p>
          </article>

          <article style={trustCardStyle}>
            <h3>มีขั้นตอนให้ลงมือทำ</h3>
            <p>
              หน้า Dashboard ช่วยเปลี่ยนไอเดียให้กลายเป็นงานจริง
              ไม่ใช่แค่ดูข้อความแล้วจบ
            </p>
          </article>
        </div>
      </section>

      <section style={compareSectionStyle}>
        <div>
          <p style={darkLabelStyle}>Free / Pro / Premium</p>

          <h2 style={darkTitleStyle}>ใช้ฟรีก่อน แล้วค่อยอัปเกรดเมื่อใช้งานจริง</h2>

          <p style={darkTextStyle}>
            แนวคิดของ Creator OS คือให้ผู้ใช้ลองเห็นคุณค่าก่อน
            แล้วค่อยอัปเกรดเมื่ออยากได้ Hook คุณภาพสูง ระบบค้นหาที่สะดวกขึ้น
            แพ็กเฉพาะหมวด และเครื่องมือช่วยทำงานจริงมากขึ้น
          </p>

          <div style={buttonRowStyle}>
            <Link href="/pricing">
              <button style={darkButtonStyle}>ดูราคาแพ็กเกจ</button>
            </Link>

            <Link href="/premium">
              <button style={darkSecondaryButtonStyle}>ดูแพ็กพรีเมียม</button>
            </Link>
          </div>
        </div>

        <div style={planBoxStyle}>
          <article style={planMiniCardStyle}>
            <h3>ใช้ฟรี</h3>
            <p>เหมาะสำหรับทดลองและดูตัวอย่าง</p>
          </article>

          <article style={planMiniCardStyle}>
            <h3>Pro</h3>
            <p>เหมาะสำหรับคนเริ่มใช้ทำงานจริง</p>
          </article>

          <article style={planMiniCardStyle}>
            <h3>พรีเมียม</h3>
            <p>เหมาะสำหรับคนที่ต้องการคัดของคุณภาพสูง</p>
          </article>
        </div>
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>เริ่มใช้งานแบบง่ายที่สุด</h2>

        <p style={bottomTextStyle}>
          ถ้ายังไม่รู้จะเริ่มตรงไหน ให้เปิดหน้า ภารกิจวันนี้
          แล้วทำตามขั้นตอนในระบบ จากนั้นค่อยใช้คลัง Hook และหน้าค้นหาเพื่อหาไอเดีย
        </p>

        <Link href="/dashboard">
          <button style={darkButtonStyle}>เริ่มภารกิจวันนี้</button>
        </Link>
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

const darkLabelStyle: CSSProperties = {
  color: "#a5b4fc",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "46px",
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

const featureGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const featureCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.8",
};

const userGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const userCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  color: "#374151",
  lineHeight: "1.8",
};

const iconStyle: CSSProperties = {
  fontSize: "32px",
};

const trustGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "16px",
  marginTop: "20px",
};

const trustCardStyle: CSSProperties = {
  padding: "20px",
  borderRadius: "20px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  color: "#374151",
  lineHeight: "1.8",
};

const compareSectionStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#111827",
  color: "white",
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) minmax(240px,320px)",
  gap: "24px",
  alignItems: "center",
};

const darkTitleStyle: CSSProperties = {
  fontSize: "34px",
  lineHeight: "1.2",
  margin: "10px 0",
};

const darkTextStyle: CSSProperties = {
  color: "#d1d5db",
  lineHeight: "1.8",
  fontSize: "17px",
};

const planBoxStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
};

const planMiniCardStyle: CSSProperties = {
  padding: "16px",
  borderRadius: "18px",
  background: "#1f2937",
  border: "1px solid #374151",
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

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "28px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  textAlign: "center",
};

const bottomTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  fontSize: "17px",
  maxWidth: "760px",
  margin: "0 auto 18px",
};