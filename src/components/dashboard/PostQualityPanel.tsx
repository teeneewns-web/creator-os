"use client";

import { useEffect, useState } from "react";

type PostQualityPanelProps = {
  day: number;
};

type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
};

const STORAGE_KEY = "creator-os-post-quality-day-";

const checklistItems: ChecklistItem[] = [
  {
    id: "hook",
    title: "มี Hook เปิดโพสต์",
    detail: "บรรทัดแรกต้องทำให้คนอยากหยุดอ่าน",
  },
  {
    id: "clear",
    title: "อ่านแล้วเข้าใจง่าย",
    detail: "ใช้ประโยคสั้น ไม่อธิบายยาวเกินไป",
  },
  {
    id: "value",
    title: "มีประโยชน์กับคนอ่าน",
    detail: "คนอ่านควรได้ไอเดีย วิธีแก้ หรือข้อคิดบางอย่าง",
  },
  {
    id: "cta",
    title: "มี CTA ปิดท้าย",
    detail: "ชวนให้คอมเมนต์ แชร์ บันทึก หรือกดติดตาม",
  },
  {
    id: "hashtag",
    title: "มี Hashtag",
    detail: "ใส่ Hashtag ที่เกี่ยวกับเนื้อหา ไม่ต้องเยอะเกินไป",
  },
];

function getStorageKey(day: number) {
  return STORAGE_KEY + day;
}

export default function PostQualityPanel({ day }: PostQualityPanelProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [loadedDay, setLoadedDay] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(day));

    if (saved) {
      setCheckedItems(JSON.parse(saved));
    } else {
      setCheckedItems([]);
    }

    setLoadedDay(day);
  }, [day]);

  useEffect(() => {
    if (loadedDay !== day) return;

    localStorage.setItem(getStorageKey(day), JSON.stringify(checkedItems));
  }, [checkedItems, day, loadedDay]);

  function toggleItem(itemId: string) {
    setCheckedItems((current) => {
      if (current.includes(itemId)) {
        return current.filter((id) => id !== itemId);
      }

      return [...current, itemId];
    });
  }

  const completedCount = checkedItems.length;
  const progress = Math.round((completedCount / checklistItems.length) * 100);
  const readyToPost = progress === 100;

  return (
    <section
      style={{
        marginTop: "24px",
        border: readyToPost ? "2px solid #22c55e" : "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px",
        background: readyToPost ? "#f0fdf4" : "white",
      }}
    >
      <h2>✅ เช็กลิสต์ก่อนโพสต์ Day {day}</h2>

      <p style={{ color: "#555" }}>
        ตรวจโพสต์ก่อนนำไปลงจริง เพื่อให้โพสต์ดูน่าอ่านและมีโอกาสได้ปฏิสัมพันธ์มากขึ้น
      </p>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "14px",
        }}
      >
        <div
          style={{
            width: progress + "%",
            height: "100%",
            background: "#22c55e",
          }}
        />
      </div>

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        ตรวจแล้ว {completedCount} จาก {checklistItems.length} ข้อ
      </p>

      <div style={{ marginTop: "18px" }}>
        {checklistItems.map((item) => {
          const checked = checkedItems.includes(item.id);

          return (
            <label
              key={item.id}
              style={{
                display: "block",
                border: "1px solid #ddd",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "10px",
                cursor: "pointer",
                background: checked ? "#f0fdf4" : "white",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleItem(item.id)}
                style={{ marginRight: "10px" }}
              />

              <strong>{item.title}</strong>

              <p style={{ color: "#555", margin: "6px 0 0 28px" }}>
                {item.detail}
              </p>
            </label>
          );
        })}
      </div>

      {readyToPost && (
        <p
          style={{
            marginTop: "14px",
            padding: "12px",
            borderRadius: "12px",
            background: "#dcfce7",
            fontWeight: "bold",
          }}
        >
          🎉 โพสต์นี้พร้อมนำไปลงแล้ว
        </p>
      )}
    </section>
  );
}