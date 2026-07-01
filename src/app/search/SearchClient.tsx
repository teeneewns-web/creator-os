"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "../../components/dashboard/CopyButton";

type SearchItem = {
  id: string;
  category: string;
  text: string;
  type?: string;
  emotion?: string;
  platform?: string;
  language?: string;
};

type SearchClientProps = {
  items: SearchItem[];
};

export default function SearchClient({ items }: SearchClientProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchKeyword =
        keyword.trim() === "" ||
        item.text.toLowerCase().includes(keyword.toLowerCase()) ||
        item.category.toLowerCase().includes(keyword.toLowerCase()) ||
        (item.type || "").toLowerCase().includes(keyword.toLowerCase()) ||
        (item.emotion || "").toLowerCase().includes(keyword.toLowerCase()) ||
        (item.platform || "").toLowerCase().includes(keyword.toLowerCase());

      const matchCategory =
        category === "all" || item.category.toLowerCase() === category;

      return matchKeyword && matchCategory;
    });
  }, [items, keyword, category]);

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <section
        style={{
          padding: "40px 24px",
          borderRadius: "24px",
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#4f46e5", fontWeight: "bold" }}>
          Search Library
        </p>

        <h1 style={{ fontSize: "42px", lineHeight: "1.15", margin: "12px 0" }}>
          ค้นหา Hook ที่เหมาะกับโพสต์ของคุณ
        </h1>

        <p style={{ color: "#555", fontSize: "18px", maxWidth: "760px" }}>
          พิมพ์คำค้นหา เช่น ความงาม การเงิน เกม TikTok หรืออารมณ์ของคอนเทนต์
          เพื่อหา Hook ที่นำไปใช้ได้เร็วขึ้น
        </p>
      </section>

      <section
        style={{
          marginTop: "24px",
          display: "grid",
          gridTemplateColumns: "minmax(220px,1fr) 180px",
          gap: "12px",
        }}
      >
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="ค้นหา Hook..."
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            fontSize: "16px",
            background: "white",
          }}
        >
          <option value="all">ทุกหมวด</option>
          <option value="beauty">Beauty</option>
          <option value="finance">Finance</option>
          <option value="gaming">Gaming</option>
        </select>
      </section>

      <section style={{ marginTop: "20px" }}>
        <p style={{ color: "#555" }}>
          พบทั้งหมด <strong>{filteredItems.length}</strong> รายการ
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "18px",
          marginTop: "18px",
        }}
      >
        {filteredItems.map((item, index) => (
          <article
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "20px",
              padding: "20px",
              background: "white",
            }}
          >
            <p
              style={{
                color: "#4f46e5",
                fontWeight: "bold",
                marginTop: 0,
              }}
            >
              {item.category.toUpperCase()} #{index + 1}
            </p>

            <h2
              style={{
                fontSize: "22px",
                lineHeight: "1.45",
                marginBottom: "14px",
              }}
            >
              {item.text}
            </h2>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              {item.type ? <span style={tagStyle}>{item.type}</span> : null}
              {item.emotion ? <span style={tagStyle}>{item.emotion}</span> : null}
              {item.platform ? <span style={tagStyle}>{item.platform}</span> : null}
              {item.language ? <span style={tagStyle}>{item.language}</span> : null}
            </div>

            <CopyButton text={item.text} />
          </article>
        ))}
      </section>

      {filteredItems.length === 0 ? (
        <section
          style={{
            marginTop: "24px",
            padding: "24px",
            borderRadius: "20px",
            border: "1px dashed #cbd5e1",
            textAlign: "center",
            background: "white",
          }}
        >
          <h2>ไม่พบผลลัพธ์</h2>

          <p style={{ color: "#555" }}>
            ลองเปลี่ยนคำค้นหา หรือเลือกเป็นทุกหมวดอีกครั้ง
          </p>
        </section>
      ) : null}

      <section
        style={{
          marginTop: "34px",
          padding: "24px",
          borderRadius: "22px",
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
          textAlign: "center",
        }}
      >
        <h2>อยากใช้ Hook กับระบบวางโพสต์?</h2>

        <p style={{ color: "#555", fontSize: "17px" }}>
          เปิด Dashboard เพื่อใช้ Hook ร่วมกับโครงโพสต์ CTA และระบบภารกิจรายวัน
        </p>

        <Link href="/dashboard">
          <button style={primaryButtonStyle}>🏠 ไปที่ภารกิจวันนี้</button>
        </Link>
      </section>
    </main>
  );
}

const tagStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eef2ff",
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "bold",
};

const primaryButtonStyle = {
  marginTop: "14px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #4f46e5",
  background: "#4f46e5",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};