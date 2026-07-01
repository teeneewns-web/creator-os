"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type QualityItem = {
  id: string;
  title: string;
  description: string;
};

type PostQualityPanelProps = {
  day?: number;
  items?: QualityItem[];
  checklist?: QualityItem[];
  [key: string]: unknown;
};

const defaultChecklist: QualityItem[] = [
  {
    id: "hook",
    title: "มี Hook ดึงความสนใจ",
    description: "ประโยคแรกควรทำให้คนอยากอ่านต่อ",
  },
  {
    id: "clear",
    title: "ใจความชัดเจน",
    description: "คนอ่านควรรู้ทันทีว่าโพสต์นี้กำลังบอกอะไร",
  },
  {
    id: "value",
    title: "มีประโยชน์หรือความรู้สึกบางอย่าง",
    description: "ให้ข้อมูล แรงบันดาลใจ ความบันเทิง หรือมุมมองใหม่",
  },
  {
    id: "cta",
    title: "มี CTA ปิดท้าย",
    description: "ชวนให้คอมเมนต์ แชร์ กดติดตาม หรือทดลองทำตาม",
  },
];

export default function PostQualityPanel(props: PostQualityPanelProps) {
  const day = props.day || 1;
  const storageKey = "creator-os-post-quality-day-" + day;
  const checklist = props.items || props.checklist || defaultChecklist;

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setCheckedItems(JSON.parse(saved));
    } else {
      setCheckedItems([]);
    }
  }, [storageKey]);

  function toggleItem(itemId: string) {
    let nextItems: string[];

    if (checkedItems.includes(itemId)) {
      nextItems = checkedItems.filter((id) => id !== itemId);
    } else {
      nextItems = [...checkedItems, itemId];
    }

    setCheckedItems(nextItems);
    localStorage.setItem(storageKey, JSON.stringify(nextItems));
  }

  const score =
    checklist.length === 0
      ? 0
      : Math.round((checkedItems.length / checklist.length) * 100);

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={labelStyle}>Post Quality</p>

          <h2 style={{ margin: "6px 0" }}>เช็กคุณภาพก่อนโพสต์</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            ติ๊กเช็กก่อนโพสต์จริง เพื่อให้คอนเทนต์มีโอกาสน่าสนใจมากขึ้น
          </p>
        </div>

        <div style={scoreBoxStyle}>
          <p style={{ margin: 0, color: "#555" }}>คะแนนพร้อมโพสต์</p>
          <strong style={{ fontSize: "26px" }}>{score}%</strong>
        </div>
      </div>

      <div style={progressTrackStyle}>
        <div
          style={{
            width: score + "%",
            height: "100%",
            borderRadius: "999px",
            background: score >= 75 ? "#22c55e" : "#4f46e5",
          }}
        />
      </div>

      <div style={listStyle}>
        {checklist.map((item) => {
          const checked = checkedItems.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              style={{
                border: checked ? "2px solid #22c55e" : "1px solid #ddd",
                borderRadius: "18px",
                padding: "16px",
                background: checked ? "#f0fdf4" : "white",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {checked ? "✅" : "⬜"} {item.title}
              </h3>

              <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
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

const scoreBoxStyle: CSSProperties = {
  minWidth: "160px",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const progressTrackStyle: CSSProperties = {
  width: "100%",
  height: "12px",
  background: "#e5e7eb",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "18px",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};