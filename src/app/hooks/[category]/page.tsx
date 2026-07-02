import type { CSSProperties } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "../../../components/dashboard/CopyButton";
import {
  hookCategories,
  hookCategoryList,
} from "../../../data/hooks/hookCategories";

type HookItem = {
  id: number | string;
  text?: string;
  hook?: string;
  title?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
};

type HookCategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return hookCategoryList.map((category) => {
    return {
      category: category.slug,
    };
  });
}

function getHookText(item: HookItem) {
  return item.text || item.hook || item.title || "";
}

function loadHooks(category: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "data",
    "hooks",
    category + ".json"
  );

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const hooks: HookItem[] = JSON.parse(fileContent);

  return hooks;
}

export default async function HookCategoryPage({
  params,
}: HookCategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  const categoryData = hookCategories[category as keyof typeof hookCategories];

  if (!categoryData) {
    notFound();
  }

  const hooks = loadHooks(category);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>
          {categoryData.icon} {categoryData.label}
        </p>

        <h1 style={titleStyle}>{categoryData.title}</h1>

        <p style={subtitleStyle}>{categoryData.description}</p>

        <div style={buttonRowStyle}>
          <Link href="/hooks">
            <button style={secondaryButtonStyle}>← กลับไปคลัง Hook</button>
          </Link>

          <Link href="/search">
            <button style={primaryButtonStyle}>🔍 ค้นหา Hook เพิ่ม</button>
          </Link>

          <Link href="/dashboard">
            <button style={secondaryButtonStyle}>🏠 ใช้กับ Dashboard</button>
          </Link>
        </div>
      </section>

      <section style={summaryStyle}>
        <p style={{ margin: 0, color: "#555" }}>
          พบทั้งหมด <strong>{hooks.length}</strong> รายการในหมวดนี้
        </p>
      </section>

      {hooks.length > 0 ? (
        <section style={gridStyle}>
          {hooks.map((item, index) => {
            const text = getHookText(item);

            return (
              <article key={String(item.id || index)} style={cardStyle}>
                <p style={cardLabelStyle}>
                  {categoryData.label} Hook #{index + 1}
                </p>

                <h2 style={hookTextStyle}>{text}</h2>

                <div style={tagRowStyle}>
                  {item.type ? <span style={tagStyle}>{item.type}</span> : null}
                  {item.emotion ? (
                    <span style={tagStyle}>{item.emotion}</span>
                  ) : null}
                  {item.platform ? (
                    <span style={tagStyle}>{item.platform}</span>
                  ) : null}
                  {item.language ? (
                    <span style={tagStyle}>{item.language}</span>
                  ) : null}
                </div>

                <div style={buttonRowStyle}>
                  <CopyButton text={text} />
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ยังไม่มี Hook ในหมวดนี้</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            เพิ่มข้อมูลในไฟล์ JSON ของหมวดนี้ แล้วระบบจะแสดงผลอัตโนมัติ
          </p>
        </section>
      )}

      <section style={bottomCtaStyle}>
        <h2 style={{ marginTop: 0 }}>อยากเอา Hook ไปเขียนโพสต์ต่อ?</h2>

        <p style={{ color: "#d1d5db", lineHeight: "1.8", fontSize: "17px" }}>
          คัดลอก Hook ที่ชอบ แล้วนำไปต่อกับ Caption, CTA และร่างโพสต์ใน Dashboard
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
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryStyle: CSSProperties = {
  marginTop: "20px",
  padding: "16px 18px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "20px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "22px",
  padding: "20px",
  background: "white",
};

const cardLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const hookTextStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: "1.55",
};

const tagRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "12px",
};

const tagStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "bold",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  background: "white",
  textAlign: "center",
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