import type { CSSProperties } from "react";
import Link from "next/link";
import CopyButton from "../dashboard/CopyButton";
import { type ContentLibrary } from "../../data/content/contentLibraries";

type ContentLibraryPageProps = {
  library: ContentLibrary;
};

export default function ContentLibraryPage({ library }: ContentLibraryPageProps) {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>{library.label}</p>

        <h1 style={titleStyle}>{library.title}</h1>

        <p style={subtitleStyle}>{library.description}</p>

        <div style={buttonRowStyle}>
          <Link href={library.primaryHref}>
            <button style={primaryButtonStyle}>ใช้กับ Dashboard</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดียเพิ่ม</button>
          </Link>
        </div>
      </section>

      <section style={gridStyle}>
        {library.sections.map((section) => (
          <article key={section.title} style={cardStyle}>
            <div style={iconStyle}>{section.icon}</div>

            <h2 style={{ margin: "10px 0" }}>{section.title}</h2>

            <p style={{ color: "#555", lineHeight: "1.7" }}>
              {section.description}
            </p>

            <div style={exampleListStyle}>
              {section.examples.map((example, index) => (
                <div key={section.title + String(index)} style={exampleBoxStyle}>
                  <p style={exampleLabelStyle}>ตัวอย่าง {index + 1}</p>

                  <p style={exampleTextStyle}>{example.text}</p>

                  <CopyButton text={example.text} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>อยากนำไปใช้กับโพสต์จริง?</h2>

        <p style={{ color: "#d1d5db", lineHeight: "1.8", fontSize: "17px" }}>
          เลือกตัวอย่างที่เหมาะกับคอนเทนต์ของคุณ คัดลอก แล้วนำไปปรับในหน้า Dashboard ได้ทันที
        </p>

        <Link href="/dashboard">
          <button style={darkButtonStyle}>เปิด Dashboard</button>
        </Link>
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
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "28px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const iconStyle: CSSProperties = {
  fontSize: "34px",
};

const exampleListStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};

const exampleBoxStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const exampleLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const exampleTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  whiteSpace: "pre-wrap",
};

const bottomCtaStyle: CSSProperties = {
  marginTop: "34px",
  padding: "30px 24px",
  borderRadius: "24px",
  background: "#111827",
  color: "white",
  textAlign: "center",
};

const darkButtonStyle: CSSProperties = {
  marginTop: "12px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid white",
  background: "white",
  color: "#111827",
  cursor: "pointer",
  fontWeight: "bold",
};