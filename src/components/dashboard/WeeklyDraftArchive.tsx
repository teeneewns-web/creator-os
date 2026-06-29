"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";

type DraftItem = {
  day: number;
  draft: string;
};

const STORAGE_KEY = "creator-os-post-draft-day-";

function getStorageKey(day: number) {
  return STORAGE_KEY + day;
}

export default function WeeklyDraftArchive() {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);

  useEffect(() => {
    const loadedDrafts: DraftItem[] = [];

    for (let day = 1; day <= 7; day++) {
      const saved = localStorage.getItem(getStorageKey(day));

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
    <section
      style={{
        marginTop: "24px",
        border: "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px",
        background: "white",
      }}
    >
      <h2>📝 คลังโพสต์ที่เขียนไว้ 7 วัน</h2>

      <p style={{ color: "#555" }}>
        รวมโพสต์ที่คุณร่างไว้ในแต่ละวัน เพื่อกลับมาแก้ไขหรือคัดลอกไปใช้งานจริง
      </p>

      {drafts.length === 0 ? (
        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            borderRadius: "14px",
            background: "#f8fafc",
            color: "#555",
          }}
        >
          ยังไม่มีโพสต์ที่ร่างไว้ ลองไปเขียนโพสต์ในหน้า Dashboard ก่อน
        </div>
      ) : (
        <div style={{ marginTop: "16px" }}>
          {drafts.map((item) => (
            <div
              key={item.day}
              style={{
                border: "1px solid #ddd",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "12px",
                background: "#f8fafc",
              }}
            >
              <strong>Day {item.day}</strong>

              <p
                style={{
                  marginTop: "10px",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                }}
              >
                {item.draft.length > 300
                  ? item.draft.slice(0, 300) + "..."
                  : item.draft}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                <CopyButton text={item.draft} />

                <Link href={"/dashboard?day=" + item.day}>
                  <button
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    แก้ไข Day {item.day}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
