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
  level?: string;
  score?: number;
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

const levelOptions = [
  {
    value: "all",
    label: "ทุกระดับ",
  },
  {
    value: "premium-ready",
    label: "Premium-ready",
  },
  {
    value: "pro",
    label: "Pro",
  },
  {
    value: "free",
    label: "Free",
  },
  {
    value: "needs-rewrite",
    label: "Needs rewrite",
  },
];

function getSourceLabel(source: string) {
  if (source === "hooks") return "Hook";
  if (source === "captions") return "Caption";
  if (source === "cta") return "CTA";
  if (source === "scripts") return "Script";

  return source;
}

function getLevelLabel(level: string | undefined) {
  if (level === "premium-ready") return "Premium-ready";
  if (level === "pro") return "Pro";
  if (level === "free") return "Free";
  if (level === "needs-rewrite") return "Needs rewrite";

  return "";
}

function getLevelBadgeStyle(level: string | undefined): CSSProperties {
  if (level === "premium-ready") {
    return {
      ...levelBadgeBaseStyle,
      background: "#eef2ff",
      color: "#4f46e5",
      border: "1px solid #c7d2fe",
    };
  }

  if (level === "pro") {
    return {
      ...levelBadgeBaseStyle,
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
    };
  }

  if (level === "free") {
    return {
      ...levelBadgeBaseStyle,
      background: "#fffbeb",
      color: "#92400e",
      border: "1px solid #fde68a",
    };
  }

  if (level === "needs-rewrite") {
    return {
      ...levelBadgeBaseStyle,
      background: "#fff7f7",
      color: "#dc2626",
      border: "1px solid #fecaca",
    };
  }

  return levelBadgeBaseStyle;
}

function getScoreByLevel(items: SearchItem[], level: string) {
  return items.filter((item) => item.level === level).length;
}

export default function SearchClient({ items }: SearchClientProps) {
  const [keyword, setKeyword] = useState("");
  const [source, setSource] = useState("all");
  const [level, setLevel] = useState("all");

  const filteredItems = useMemo(() => {
    const cleanKeyword = keyword.trim().toLowerCase();

    return items.filter((item) => {
      const matchSource = source === "all" || item.source === source;

      const matchLevel =
        level === "all" || (item.source === "hooks" && item.level === level);

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
        item.level || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchKeyword = cleanKeyword === "" || searchText.includes(cleanKeyword);

      return matchSource && matchLevel && matchKeyword;
    });
  }, [items, keyword, source, level]);

  const premiumCount = getScoreByLevel(items, "premium-ready");
  const proCount = getScoreByLevel(items, "pro");
  const freeCount = getScoreByLevel(items, "free");
  const rewriteCount = getScoreByLevel(items, "needs-rewrite");

  function handleSelectLevel(nextLevel: string) {
    setLevel(nextLevel);
    setSource("hooks");
  }

  function resetFilters() {
    setKeyword("");
    setSource("all");
    setLevel("all");
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>Search Library</p>

        <h1 style={titleStyle}>ค้นหาไอเดียคอนเทนต์ทั้งหมดในที่เดียว</h1>

        <p style={subtitleStyle}>
          ค้นหา Hook, Caption, CTA และ Script จากคลังข้อมูลของ Creator OS
          พร้อมเริ่มแยกระดับ Hook ว่าอันไหนพร้อมขาย อันไหนควรปรับก่อนทำเป็น Premium
        </p>
      </section>

      <section style={scoreSummaryGridStyle}>
        <button
          type="button"
          onClick={() => handleSelectLevel("premium-ready")}
          style={scoreButtonStyle(level === "premium-ready")}
        >
          <p style={scoreLabelStyle}>Premium-ready</p>
          <h2 style={scoreNumberStyle}>{premiumCount}</h2>
          <span style={scoreHintStyle}>กดเพื่อกรอง</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLevel("pro")}
          style={scoreButtonStyle(level === "pro")}
        >
          <p style={scoreLabelStyle}>Pro</p>
          <h2 style={scoreNumberStyle}>{proCount}</h2>
          <span style={scoreHintStyle}>กดเพื่อกรอง</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLevel("free")}
          style={scoreButtonStyle(level === "free")}
        >
          <p style={scoreLabelStyle}>Free</p>
          <h2 style={scoreNumberStyle}>{freeCount}</h2>
          <span style={scoreHintStyle}>กดเพื่อกรอง</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectLevel("needs-rewrite")}
          style={scoreButtonStyle(level === "needs-rewrite")}
        >
          <p style={scoreLabelStyle}>Needs rewrite</p>
          <h2 style={scoreNumberStyle}>{rewriteCount}</h2>
          <span style={scoreHintStyle}>กดเพื่อกรอง</span>
        </button>
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

        <select
          value={level}
          onChange={(event) => handleSelectLevel(event.target.value)}
          style={selectStyle}
        >
          {levelOptions.map((option) => (
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
              type="button"
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

          <button type="button" onClick={resetFilters} style={resetButtonStyle}>
            ล้างตัวกรอง
          </button>
        </div>
      </section>

      <section style={levelFilterRowStyle}>
        {levelOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelectLevel(option.value)}
            style={{
              border: level === option.value ? "1px solid #4f46e5" : "1px solid #ddd",
              background: level === option.value ? "#eef2ff" : "white",
              color: level === option.value ? "#4f46e5" : "#374151",
              padding: "8px 12px",
              borderRadius: "999px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {option.label}
          </button>
        ))}
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

              {item.level ? (
                <div style={qualityRowStyle}>
                  <span style={getLevelBadgeStyle(item.level)}>
                    {getLevelLabel(item.level)}
                  </span>

                  {typeof item.score === "number" ? (
                    <span style={scorePillStyle}>{item.score}/100</span>
                  ) : null}
                </div>
              ) : null}

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
            ลองเปลี่ยนคำค้นหา เลือกเป็น “ทุกอย่าง” หรือเปลี่ยนระดับคุณภาพ
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
  maxWidth: "800px",
};

const scoreSummaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "14px",
  marginTop: "22px",
};

function scoreButtonStyle(active: boolean): CSSProperties {
  return {
    textAlign: "left",
    border: active ? "1px solid #4f46e5" : "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "16px",
    background: active ? "#eef2ff" : "white",
    cursor: "pointer",
  };
}

const scoreLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
  fontWeight: "bold",
};

const scoreNumberStyle: CSSProperties = {
  margin: "8px 0 0",
  fontSize: "30px",
};

const scoreHintStyle: CSSProperties = {
  display: "inline-block",
  marginTop: "8px",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "bold",
};

const searchBoxStyle: CSSProperties = {
  marginTop: "24px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
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

const resetButtonStyle: CSSProperties = {
  border: "1px solid #dc2626",
  background: "#fff7f7",
  color: "#dc2626",
  padding: "8px 12px",
  borderRadius: "999px",
  cursor: "pointer",
  fontWeight: "bold",
};

const levelFilterRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "12px",
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

const qualityRowStyle: CSSProperties = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  alignItems: "center",
  marginTop: "10px",
};

const levelBadgeBaseStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  fontWeight: "bold",
  fontSize: "13px",
};

const scorePillStyle: CSSProperties = {
  display: "inline-block",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#374151",
  fontWeight: "bold",
  fontSize: "13px",
  border: "1px solid #e5e7eb",
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