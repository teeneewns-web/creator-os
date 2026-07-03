"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../../components/dashboard/CopyButton";
import FavoriteButton from "../../components/favorites/FavoriteButton";

export type SearchItem = {
  id: string | number;
  text: string;
  source: string;
  category: string;
  href: string;
  level?: "premium-ready" | "pro" | "free" | "needs-rewrite";
  score?: number;
};

type SearchClientProps = {
  items?: SearchItem[];
  searchItems?: SearchItem[];
  allItems?: SearchItem[];
  data?: SearchItem[];
  [key: string]: unknown;
};

type SourceFilter = "all" | "hooks" | "captions" | "cta" | "scripts";
type LevelFilter = "all" | "premium-ready" | "pro" | "free" | "needs-rewrite";

function getSourceLabel(source: string) {
  if (source === "hooks") return "คลัง Hook";
  if (source === "captions") return "แคปชัน";
  if (source === "cta") return "CTA / คำชวนให้ทำ";
  if (source === "scripts") return "สคริปต์";

  return source;
}

function getLevelLabel(level?: string) {
  if (!level) return "ไม่ระบุระดับ";

  if (level === "premium-ready") return "พร้อมพรีเมียม";
  if (level === "pro") return "ระดับ Pro";
  if (level === "free") return "ใช้ฟรี";
  if (level === "needs-rewrite") return "ควรเขียนใหม่";

  return level;
}

function getLevelDescription(level?: string) {
  if (level === "premium-ready") {
    return "เหมาะนำไปใช้จริงหรือทำแพ็กขาย";
  }

  if (level === "pro") {
    return "ใช้ได้ดี เหมาะกับงานจริง";
  }

  if (level === "free") {
    return "ใช้เป็นตัวอย่างหรือไอเดียเริ่มต้น";
  }

  if (level === "needs-rewrite") {
    return "ควรปรับถ้อยคำก่อนนำไปใช้จริง";
  }

  return "ยังไม่มีคะแนนคุณภาพ";
}

function getItemsFromProps(props: SearchClientProps) {
  if (Array.isArray(props.items)) return props.items;
  if (Array.isArray(props.searchItems)) return props.searchItems;
  if (Array.isArray(props.allItems)) return props.allItems;
  if (Array.isArray(props.data)) return props.data;

  return [];
}

export default function SearchClient(props: SearchClientProps) {
  const items = getItemsFromProps(props);

  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [level, setLevel] = useState<LevelFilter>("all");

  const filteredItems = useMemo(() => {
    const cleanKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const matchKeyword =
        cleanKeyword === "" ||
        item.text.toLowerCase().includes(cleanKeyword) ||
        item.category.toLowerCase().includes(cleanKeyword) ||
        item.source.toLowerCase().includes(cleanKeyword);

      const matchSource = source === "all" || item.source === source;

      const matchLevel = level === "all" || item.level === level;

      return matchKeyword && matchSource && matchLevel;
    });
  }, [items, keyword, source, level]);

  const premiumReadyCount = items.filter(
    (item) => item.level === "premium-ready"
  ).length;

  const proCount = items.filter((item) => item.level === "pro").length;
  const freeCount = items.filter((item) => item.level === "free").length;

  const needsRewriteCount = items.filter(
    (item) => item.level === "needs-rewrite"
  ).length;

  function resetFilters() {
    setKeyword("");
    setSource("all");
    setLevel("all");
  }

  function handleSelectLevel(nextLevel: LevelFilter) {
    setLevel(nextLevel);

    if (nextLevel !== "all") {
      setSource("hooks");
    }
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>ค้นหาไอเดีย</p>

        <h1 style={titleStyle}>ค้นหา Hook แคปชัน CTA และสคริปต์จากที่เดียว</h1>

        <p style={subtitleStyle}>
          ใช้หน้านี้เพื่อค้นหาไอเดียจากคลังคอนเทนต์ทั้งหมด
          แล้วกรองตามประเภทหรือระดับคุณภาพ เพื่อเลือกข้อความที่เหมาะกับงานจริงได้เร็วขึ้น
        </p>
      </section>

      <section style={summaryGridStyle}>
        <button
          type="button"
          onClick={() => handleSelectLevel("premium-ready")}
          style={
            level === "premium-ready" ? activeSummaryCardStyle : summaryCardStyle
          }
        >
          <p style={summaryLabelStyle}>พร้อมพรีเมียม</p>
          <h2 style={summaryNumberStyle}>{premiumReadyCount}</h2>
          <span style={summaryHintStyle}>Hook ที่เหมาะใช้ขายหรือใช้จริง</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLevel("pro")}
          style={level === "pro" ? activeSummaryCardStyle : summaryCardStyle}
        >
          <p style={summaryLabelStyle}>ระดับ Pro</p>
          <h2 style={summaryNumberStyle}>{proCount}</h2>
          <span style={summaryHintStyle}>ไอเดียที่คุณภาพดี ใช้งานง่าย</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLevel("free")}
          style={level === "free" ? activeSummaryCardStyle : summaryCardStyle}
        >
          <p style={summaryLabelStyle}>ใช้ฟรี</p>
          <h2 style={summaryNumberStyle}>{freeCount}</h2>
          <span style={summaryHintStyle}>เหมาะเป็นตัวอย่างหรือไอเดียตั้งต้น</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLevel("needs-rewrite")}
          style={
            level === "needs-rewrite"
              ? activeSummaryCardStyle
              : summaryCardStyle
          }
        >
          <p style={summaryLabelStyle}>ควรเขียนใหม่</p>
          <h2 style={summaryNumberStyle}>{needsRewriteCount}</h2>
          <span style={summaryHintStyle}>ควรปรับก่อนใช้จริง</span>
        </button>
      </section>

      <section style={filterBoxStyle}>
        <div>
          <label style={inputLabelStyle} htmlFor="search-keyword">
            ค้นหาด้วยคำ
          </label>

          <input
            id="search-keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="เช่น ขายของ, มือใหม่, TikTok, ความงาม"
            style={inputStyle}
          />
        </div>

        <div style={filterGroupStyle}>
          <p style={filterTitleStyle}>เลือกประเภทข้อมูล</p>

          <div style={buttonRowStyle}>
            <button
              type="button"
              onClick={() => setSource("all")}
              style={source === "all" ? activeFilterButtonStyle : filterButtonStyle}
            >
              ทั้งหมด
            </button>

            <button
              type="button"
              onClick={() => setSource("hooks")}
              style={
                source === "hooks" ? activeFilterButtonStyle : filterButtonStyle
              }
            >
              คลัง Hook
            </button>

            <button
              type="button"
              onClick={() => setSource("captions")}
              style={
                source === "captions" ? activeFilterButtonStyle : filterButtonStyle
              }
            >
              แคปชัน
            </button>

            <button
              type="button"
              onClick={() => setSource("cta")}
              style={source === "cta" ? activeFilterButtonStyle : filterButtonStyle}
            >
              CTA / คำชวนให้ทำ
            </button>

            <button
              type="button"
              onClick={() => setSource("scripts")}
              style={
                source === "scripts" ? activeFilterButtonStyle : filterButtonStyle
              }
            >
              สคริปต์
            </button>
          </div>
        </div>

        <div style={filterGroupStyle}>
          <p style={filterTitleStyle}>เลือกระดับคุณภาพ</p>

          <div style={buttonRowStyle}>
            <button
              type="button"
              onClick={() => setLevel("all")}
              style={level === "all" ? activeFilterButtonStyle : filterButtonStyle}
            >
              ทุกระดับ
            </button>

            <button
              type="button"
              onClick={() => handleSelectLevel("premium-ready")}
              style={
                level === "premium-ready"
                  ? activeFilterButtonStyle
                  : filterButtonStyle
              }
            >
              พร้อมพรีเมียม
            </button>

            <button
              type="button"
              onClick={() => handleSelectLevel("pro")}
              style={level === "pro" ? activeFilterButtonStyle : filterButtonStyle}
            >
              ระดับ Pro
            </button>

            <button
              type="button"
              onClick={() => handleSelectLevel("free")}
              style={level === "free" ? activeFilterButtonStyle : filterButtonStyle}
            >
              ใช้ฟรี
            </button>

            <button
              type="button"
              onClick={() => handleSelectLevel("needs-rewrite")}
              style={
                level === "needs-rewrite"
                  ? activeFilterButtonStyle
                  : filterButtonStyle
              }
            >
              ควรเขียนใหม่
            </button>
          </div>
        </div>

        <div style={resultTopRowStyle}>
          <p style={resultCountStyle}>
            แสดงผล <strong>{filteredItems.length}</strong> จากทั้งหมด{" "}
            <strong>{items.length}</strong> รายการ
          </p>

          <button type="button" onClick={resetFilters} style={resetButtonStyle}>
            ล้างตัวกรอง
          </button>
        </div>
      </section>

      {filteredItems.length > 0 ? (
        <section style={gridStyle}>
          {filteredItems.map((item) => (
            <article key={String(item.id)} style={cardStyle}>
              <div style={topRowStyle}>
                <span style={sourceBadgeStyle}>
                  {getSourceLabel(item.source)}
                </span>

                {item.level ? (
                  <span style={levelBadgeStyle}>{getLevelLabel(item.level)}</span>
                ) : null}
              </div>

              <h2 style={itemTextStyle}>{item.text}</h2>

              <p style={categoryStyle}>หมวด: {item.category}</p>

              <div style={metaRowStyle}>
                {typeof item.score === "number" ? (
                  <span style={metaBadgeStyle}>คะแนน {item.score}/100</span>
                ) : null}

                <span style={metaBadgeStyle}>
                  {getLevelDescription(item.level)}
                </span>
              </div>

              <div style={buttonRowStyle}>
                <CopyButton text={item.text} />

                <FavoriteButton
                  item={{
                    id: "search-" + String(item.id),
                    text: item.text,
                    source: item.source,
                    category: item.category,
                    href: item.href,
                    level: item.level,
                    score: item.score,
                  }}
                />

                <Link href={item.href}>
                  <button style={secondaryButtonStyle}>เปิดต้นทาง</button>
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ไม่พบไอเดียที่ตรงกับตัวกรอง</h2>

          <p style={{ color: "#555", lineHeight: "1.7" }}>
            ลองเปลี่ยนคำค้น ล้างตัวกรอง หรือเลือกดูทุกประเภทข้อมูลอีกครั้ง
          </p>

          <button type="button" onClick={resetFilters} style={primaryButtonStyle}>
            ล้างตัวกรองทั้งหมด
          </button>
        </section>
      )}
    </main>
  );
}

const heroStyle: CSSProperties = {
  padding: "42px 24px",
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
  maxWidth: "860px",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "14px",
  marginTop: "22px",
};

const summaryCardStyle: CSSProperties = {
  textAlign: "left",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "18px",
  background: "white",
  cursor: "pointer",
};

const activeSummaryCardStyle: CSSProperties = {
  textAlign: "left",
  border: "2px solid #4f46e5",
  borderRadius: "18px",
  padding: "18px",
  background: "#eef2ff",
  cursor: "pointer",
};

const summaryLabelStyle: CSSProperties = {
  color: "#555",
  fontWeight: "bold",
  margin: 0,
};

const summaryNumberStyle: CSSProperties = {
  fontSize: "34px",
  margin: "8px 0",
};

const summaryHintStyle: CSSProperties = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
};

const filterBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "22px",
  borderRadius: "22px",
  border: "1px solid #e5e7eb",
  background: "white",
};

const inputLabelStyle: CSSProperties = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "8px",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
};

const filterGroupStyle: CSSProperties = {
  marginTop: "18px",
};

const filterTitleStyle: CSSProperties = {
  fontWeight: "bold",
  marginBottom: "10px",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const filterButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#374151",
};

const activeFilterButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #4f46e5",
  background: "#eef2ff",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#4f46e5",
};

const resultTopRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  flexWrap: "wrap",
  marginTop: "20px",
};

const resultCountStyle: CSSProperties = {
  margin: 0,
  color: "#555",
};

const resetButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "18px",
  marginTop: "22px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  background: "white",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const sourceBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontWeight: "bold",
  fontSize: "13px",
};

const levelBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontWeight: "bold",
  fontSize: "13px",
};

const itemTextStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: "1.55",
};

const categoryStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "10px",
};

const metaBadgeStyle: CSSProperties = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  border: "1px solid #e5e7eb",
  fontSize: "13px",
  fontWeight: "bold",
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

const emptyBoxStyle: CSSProperties = {
  marginTop: "24px",
  padding: "24px",
  borderRadius: "20px",
  border: "1px dashed #cbd5e1",
  background: "white",
  textAlign: "center",
};