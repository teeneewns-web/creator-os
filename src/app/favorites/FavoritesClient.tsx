"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import CopyButton from "../../components/dashboard/CopyButton";
import type { FavoriteItem } from "../../components/favorites/FavoriteButton";

const STORAGE_KEY = "creator-os-favorites";

function readFavorites() {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
}

function writeFavorites(items: FavoriteItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getSourceLabel(source: string) {
  if (source === "hooks") return "คลัง Hook";
  if (source === "search") return "หน้าค้นหา";
  if (source === "captions") return "แคปชัน";
  if (source === "caption") return "แคปชัน";
  if (source === "cta") return "CTA";
  if (source === "scripts") return "สคริปต์";
  if (source === "script") return "สคริปต์";

  return source;
}

function getLevelLabel(level?: string) {
  if (!level) return "";

  if (level === "premium-ready") return "พร้อมพรีเมียม";
  if (level === "pro") return "ระดับ Pro";
  if (level === "free") return "ใช้ฟรี";
  if (level === "needs-rewrite") return "ควรเขียนใหม่";

  return level;
}

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  function removeFavorite(id: string) {
    const nextFavorites = favorites.filter((item) => item.id !== id);

    writeFavorites(nextFavorites);
    setFavorites(nextFavorites);
  }

  function clearFavorites() {
    writeFavorites([]);
    setFavorites([]);
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section style={heroStyle}>
        <p style={labelStyle}>บันทึกไว้</p>

        <h1 style={titleStyle}>ไอเดียที่คุณบันทึกไว้</h1>

        <p style={subtitleStyle}>
          เก็บ Hook หรือไอเดียที่ชอบไว้ในหน้านี้
          เพื่อกลับมาคัดลอกไปเขียนโพสต์ ทำคลิป ทำสคริปต์
          หรือใช้วางแผนคอนเทนต์ต่อได้ง่ายขึ้น
        </p>

        <div style={buttonRowStyle}>
          <Link href="/hooks">
            <button style={primaryButtonStyle}>ไปเลือก Hook</button>
          </Link>

          <Link href="/search">
            <button style={secondaryButtonStyle}>ค้นหาไอเดียเพิ่ม</button>
          </Link>

          {favorites.length > 0 ? (
            <button
              type="button"
              onClick={clearFavorites}
              style={dangerButtonStyle}
            >
              ล้างทั้งหมด
            </button>
          ) : null}
        </div>
      </section>

      <section style={summaryStyle}>
        <p style={{ margin: 0, color: "#555" }}>
          ตอนนี้คุณบันทึกไว้ทั้งหมด <strong>{favorites.length}</strong> รายการ
        </p>
      </section>

      {favorites.length > 0 ? (
        <section style={gridStyle}>
          {favorites.map((item, index) => (
            <article key={item.id} style={cardStyle}>
              <div style={topRowStyle}>
                <span style={sourceBadgeStyle}>
                  {getSourceLabel(item.source)}
                </span>

                <span style={numberStyle}>รายการที่ {index + 1}</span>
              </div>

              <h2 style={textStyle}>{item.text}</h2>

              <p style={categoryStyle}>หมวด: {item.category}</p>

              <div style={tagRowStyle}>
                {item.level ? (
                  <span style={tagStyle}>{getLevelLabel(item.level)}</span>
                ) : null}

                {typeof item.score === "number" ? (
                  <span style={tagStyle}>คะแนน {item.score}/100</span>
                ) : null}
              </div>

              <div style={buttonRowStyle}>
                <CopyButton text={item.text} />

                <Link href={item.href}>
                  <button style={secondaryButtonStyle}>เปิดต้นทาง</button>
                </Link>

                <button
                  type="button"
                  onClick={() => removeFavorite(item.id)}
                  style={dangerButtonStyle}
                >
                  ลบรายการนี้
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section style={emptyBoxStyle}>
          <h2 style={{ marginTop: 0 }}>ยังไม่มีไอเดียที่บันทึกไว้</h2>

          <p style={{ color: "#555", lineHeight: "1.7" }}>
            ไปที่หน้า คลัง Hook หรือ ค้นหาไอเดีย แล้วกดปุ่ม “บันทึกไว้”
            เพื่อเก็บไอเดียที่อยากกลับมาใช้ต่อ
          </p>

          <div style={buttonRowStyle}>
            <Link href="/hooks">
              <button style={primaryButtonStyle}>เปิดคลัง Hook</button>
            </Link>

            <Link href="/search">
              <button style={secondaryButtonStyle}>เปิดหน้าค้นหา</button>
            </Link>
          </div>
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
  maxWidth: "800px",
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

const dangerButtonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #fecaca",
  background: "#fff7f7",
  color: "#dc2626",
  cursor: "pointer",
  fontWeight: "bold",
};

const summaryStyle: CSSProperties = {
  marginTop: "18px",
  padding: "14px 16px",
  borderRadius: "16px",
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
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "20px",
  background: "white",
};

const topRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
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

const numberStyle: CSSProperties = {
  color: "#777",
  fontWeight: "bold",
};

const textStyle: CSSProperties = {
  fontSize: "22px",
  lineHeight: "1.55",
};

const categoryStyle: CSSProperties = {
  color: "#555",
  lineHeight: "1.7",
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
  border: "1px solid #e5e7eb",
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