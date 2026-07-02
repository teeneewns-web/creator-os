"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";

type DraftItem = {
  day: number;
  draft: string;
};

export default function WeeklyDraftArchive() {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);

  useEffect(() => {
    const loadedDrafts: DraftItem[] = [];

    for (let day = 1; day <= 7; day++) {
      const storageKey = "creator-os-post-draft-day-" + day;
      const saved = localStorage.getItem(storageKey);

      if (saved && saved.trim() !== "") {
        loadedDrafts.push({
          day,
          draft: saved,
        });
      }
    }

    setDrafts(loadedDrafts);
  }, []);

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={labelStyle}>Draft Archive</p>

          <h2 style={{ margin: "6px 0" }}>คลังร่างโพสต์ตลอด 7 วัน</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            รวมร่างโพสต์ที่คุณเขียนไว้ในแต่ละ Day เพื่อกลับมาแก้ไข คัดลอก
            หรือใช้ต่อยอดเป็นโพสต์จริง
          </p>
        </div>

        <Link href="/dashboard">
          <button style={secondaryButtonStyle}>กลับไปเขียนโพสต์</button>
        </Link>
      </div>

      {drafts.length > 0 ? (
        <div style={gridStyle}>
          {drafts.map((item) => (
            <article key={item.day} style={draftCardStyle}>
              <p style={dayLabelStyle}>Day {item.day}</p>

              <p style={draftTextStyle}>{item.draft}</p>

              <div style={buttonRowStyle}>
                <CopyButton text={item.draft} />

                <Link href={"/dashboard?day=" + item.day}>
                  <button style={smallButtonStyle}>แก้ไข Day {item.day}</button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div style={emptyBoxStyle}>
          <h3 style={{ marginTop: 0 }}>ยังไม่มีร่างโพสต์ที่บันทึกไว้</h3>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            กลับไปหน้า Dashboard แล้วเขียนร่างโพสต์ในแต่ละ Day
            ระบบจะนำมาแสดงรวมไว้ตรงนี้
          </p>
        </div>
      )}
    </section>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: "24px",
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const headerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "14px",
  marginTop: "18px",
};

const draftCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  padding: "18px",
  background: "#f8fafc",
};

const dayLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const draftTextStyle: CSSProperties = {
  color: "#374151",
  lineHeight: "1.8",
  whiteSpace: "pre-wrap",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const secondaryButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};

const smallButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #4f46e5",
  background: "white",
  color: "#4f46e5",
  cursor: "pointer",
  fontWeight: "bold",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "18px",
  border: "1px dashed #cbd5e1",
  borderRadius: "18px",
  padding: "20px",
  background: "#f8fafc",
};