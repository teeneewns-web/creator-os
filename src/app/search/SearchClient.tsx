"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../../components/dashboard/CopyButton";

type SearchItem = {
  id: string;
  source: string;
  category: string;
  text: string;
  title?: string;
  description?: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
  href: string;
};

type SearchClientProps = {
  items: SearchItem[];
};

const sourceOptions = [
  {
    value: "all",
    label: "ทุกอย่าง",
  },
  {
    value: "hooks",
    label: "Hook",
  },
  {
    value: "captions",
    label: "Caption",
  },
  {
    value: "cta",
    label: "CTA",
  },
  {
    value: "scripts",
    label: "Script",
  },
];

function getSourceLabel(source: string) {
  if (source === "hooks") return "Hook";
  if (source === "captions") return "Caption";
  if (source === "cta") return "CTA";
  if (source === "scripts") return "Script";

  return source;
}

export default function SearchClient({ items }: SearchClientProps) {
  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState("all");

  const filteredItems = useMemo(() => {
    const cleanKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const matchSource = source === "all" || item.source === source;

      const searchText = [
        item.source,
        item.category,
        item.text,
        item.title || "",
        item.description || "",
        item.type || "",
        item.emotion || "",
        item.platform || "",
        item.language || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchKeyword = cleanKeyword === "" || searchText.includes(cleanKeyword);

      return matchSource && matchKeyword;
    });
  }, [items, keyword, source]);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Search Library</p>

        <h1 style={titleStyle}>ค้นหาไอเดียคอนเทนต์ทั้งหมดในที่เดียว</h1>

        <p style={subtitleStyle}>
          ค้นหา Hook, Caption, CTA และ Script จากคลังข้อมูลของ Creator OS
          แล้วคัดลอกไปใช้กับโพสต์หรือ Dashboard ได้ทันที
        </p>
      </section>

      <section style={searchBoxStyle}>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="ค้นหา เช่น เกม เงิน ขายของ คอมเมนต์ TikTok"
          style={inputStyle}
        />

        <select
          value={source}
          onChange={(event) => setSource(event.target.value)}
          style={selectStyle}
        >
          {sourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section style={summaryStyle}>
        <p style={{ color: "#555", margin: 0 }}>
          พบทั้งหมด <strong>{filteredItems.length}</strong> รายการ
        </p>

        <div style={quickFilterStyle}>
          {sourceOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSource(option.value)}
              style={{
                border: source === option.value ? "1px solid #4f46e5" : "1px solid #ddd",
                background: source === option.value ? "#eef2ff" : "white",
                color: source === option.value ? "#4f46e5" : "#374151",
                padding: "8px 12px",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {filteredItems.length > 0 ? (
        <section style={gridStyle}>
          {filteredItems.map((item, index) => (
            <article key={item.id} style={cardStyle}>
              <div style={cardTopRowStyle}>
                <p style={sourceBadgeStyle}>{getSourceLabel(item.source)}</p>

                <p style={{ color: "#777", margin: 0 }}>#{index + 1}</p>
              </div>

              <h2 style={cardTitleStyle}>{item.text}</h2>

              <p style={{ color: "#555", lineHeight: "1.7" }}>
                {item.category}
              </p>

              <div style={tagRowStyle}>
                {item.type ? <span style={tagStyle}>{item.type}</span> : null}
                {item.emotion ? <span style={tagStyle}>{item.emotion}</span> : null}
                {item.platform ? <span style={tagStyle}>{item.platform}</span> : null}
                {item.language ? <span style={tagStyle}>{item.language}</span> : null}
              </div>

              <div style={buttonRowStyle}>
                <CopyButton text={item.text} />

                <Link href={item.href}>
                  <button style={secondaryButtonStyle}>เปิดหมวดนี้</button>
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ไม่พบผลลัพธ์</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            ลองเปลี่ยนคำค้นหา หรือเลือกเป็น “ทุกอย่าง”
          </p>
        </section>
      )}
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

const searchBoxStyle: CSSProperties = {
  marginTop: "24px",
  display: "grid",
  gridTemplateColumns: "minmax(220px,1fr) 180px",
  gap: "12px",
};

const inputStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "16px",
};

const selectStyle: CSSProperties = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "16px",
  background: "white",
};

const summaryStyle: CSSProperties = {
  marginTop: "18px",
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  flexWrap: "wrap",
  alignItems: "center",
};

const quickFilterStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
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

const cardTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  alignItems: "center",
};

const sourceBadgeStyle: CSSProperties = {
  margin: 0,
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontWeight: "bold",
  fontSize: "13px",
};

const cardTitleStyle: CSSProperties = {
  fontSize: "21px",
  lineHeight: "1.55",
  whiteSpace: "pre-wrap",
};

const tagRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const tagStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  fontSize: "13px",
  fontWeight: "bold",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
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