import type { CSSProperties } from "react";
import Link from "next/link";
import { hookCategoryList } from "../../data/hooks/hookCategories";

export default function HooksPage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Hook Library</p>

        <h1 style={titleStyle}>คลัง Hook สำหรับเปิดโพสต์ให้น่าสนใจ</h1>

        <p style={subtitleStyle}>
          เลือกหมวด Hook ที่เหมาะกับคอนเทนต์ของคุณ แล้วคัดลอกไปใช้กับโพสต์
          คลิปสั้น หรือหน้า Dashboard ได้ทันที
        </p>

        <div style={buttonRowStyle}>
          <Link href="/search">
            <button style={primaryButtonStyle}>🔍 ค้นหา Hook</button>
          </Link>

          <Link href="/dashboard">
            <button style={secondaryButtonStyle}>🏠 ใช้กับ Dashboard</button>
          </Link>
        </div>
      </section>

      <section style={gridStyle}>
        {hookCategoryList.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article style={cardStyle}>
              <div style={iconStyle}>{category.icon}</div>

              <p style={cardLabelStyle}>{category.label}</p>

              <h2 style={{ margin: "8px 0" }}>{category.title}</h2>

              <p style={{ color: "#555", lineHeight: "1.7" }}>
                {category.description}
              </p>

              <button style={cardButtonStyle}>เปิดหมวดนี้</button>
            </article>
          </Link>
        ))}
      </section>

      <section style={tipSectionStyle}>
        <p style={labelStyle}>How to use</p>

        <h2 style={{ margin: "6px 0" }}>วิธีใช้ Hook ให้ได้ผลดีขึ้น</h2>

        <div style={tipGridStyle}>
          <div style={tipCardStyle}>
            <h3>1. เลือก Hook ที่ตรงกับกลุ่มเป้าหมาย</h3>

            <p style={{ color: "#555", lineHeight: "1.7" }}>
              Hook ที่ดีควรตรงกับปัญหา ความอยากรู้ หรือความรู้สึกของคนดู
            </p>
          </div>

          <div style={tipCardStyle}>
            <h3>2. ปรับคำให้เป็นเสียงของคุณ</h3>

            <p style={{ color: "#555", lineHeight: "1.7" }}>
              อย่าคัดลอกแบบแข็ง ๆ ให้เปลี่ยนคำบางส่วนให้เหมาะกับแบรนด์หรือสไตล์เพจ
            </p>
          </div>

          <div style={tipCardStyle}>
            <h3>3. เอาไปต่อกับ Caption / CTA</h3>

            <p style={{ color: "#555", lineHeight: "1.7" }}>
              Hook คือประโยคเปิด ควรต่อด้วยเนื้อหาที่ชัดเจนและ CTA ที่ทำให้คนลงมือทำ
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "40px 24px",
  borderRadius: "24px",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const titleStyle: CSSProperties = {
  fontSize: "42px",
  lineHeight: "1.15",
  margin: "12px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#374151",
  fontSize: "18px",
  lineHeight: "1.8",
  maxWidth: "760px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "22px",
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
  cursor: "pointer",
  fontWeight: "bold",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "18px",
  marginTop: "28px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
  height: "100%",
};

const iconStyle: CSSProperties = {
  fontSize: "38px",
};

const cardLabelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginBottom: 0,
};

const cardButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "14px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const tipSectionStyle: CSSProperties = {
  marginTop: "34px",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const tipGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: "14px",
  marginTop: "18px",
};

const tipCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
  background: "white",
};