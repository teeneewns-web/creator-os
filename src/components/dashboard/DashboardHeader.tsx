import type { CSSProperties } from "react";
import Link from "next/link";

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
};

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  return (
    <section style={headerStyle}>
      <div>
        <p style={labelStyle}>Creator OS Dashboard</p>

        <h1 style={titleStyle}>{title}</h1>

        <p style={subtitleStyle}>{subtitle}</p>

        <div style={buttonGroupStyle}>
          <Link href="/dashboard/weekly">
            <button style={secondaryButtonStyle}>📅 ดูแผน 7 วัน</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>🔍 ค้นหาไอเดีย</button>
          </Link>

          <Link href="/hooks">
            <button style={secondaryButtonStyle}>🎣 คลัง Hook</button>
          </Link>
        </div>
      </div>

      <div style={sideCardStyle}>
        <p style={{ marginTop: 0, color: "#4f46e5", fontWeight: "bold" }}>
          วันนี้โฟกัสอะไร?
        </p>

        <h2 style={{ margin: "8px 0" }}>ลงมือให้ครบทีละขั้น</h2>

        <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
          เลือกเวลาที่มี ทำภารกิจ เขียนโพสต์ เช็กคุณภาพ แล้วบันทึกผลหลังโพสต์
        </p>
      </div>
    </section>
  );
}

const headerStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1.6fr) minmax(260px,0.9fr)",
  gap: "20px",
  padding: "32px",
  borderRadius: "28px",
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
  margin: "10px 0",
};

const subtitleStyle: CSSProperties = {
  color: "#374151",
  fontSize: "18px",
  lineHeight: "1.7",
  maxWidth: "720px",
};

const buttonGroupStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "20px",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #c7d2fe",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const sideCardStyle: CSSProperties = {
  border: "1px solid #c7d2fe",
  borderRadius: "22px",
  padding: "22px",
  background: "white",
};