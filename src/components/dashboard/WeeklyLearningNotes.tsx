"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PostResult = {
  posted: boolean;
  platform: string;
  likes: string;
  comments: string;
  shares: string;
  notes: string;
};

type LearningNote = {
  day: number;
  platform: string;
  notes: string;
};

const STORAGE_KEY = "creator-os-post-result-day-";

function getStorageKey(day: number) {
  return STORAGE_KEY + day;
}

export default function WeeklyLearningNotes() {
  const [notes, setNotes] = useState<LearningNote[]>([]);

  useEffect(() => {
    const loadedNotes: LearningNote[] = [];

    for (let day = 1; day <= 7; day++) {
      const saved = localStorage.getItem(getStorageKey(day));

      if (saved) {
        const result: PostResult = JSON.parse(saved);

        if (result.notes.trim() !== "") {
          loadedNotes.push({
            day,
            platform: result.platform,
            notes: result.notes,
          });
        }
      }
    }

    setNotes(loadedNotes);
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
      <h2>🧠 บทเรียนจากโพสต์ 7 วัน</h2>

      <p style={{ color: "#555" }}>
        รวมสิ่งที่คุณได้เรียนรู้จากการลงโพสต์แต่ละวัน เพื่อนำไปปรับโพสต์ต่อไป
      </p>

      {notes.length === 0 ? (
        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            borderRadius: "14px",
            background: "#f8fafc",
            color: "#555",
          }}
        >
          ยังไม่มีบทเรียนที่บันทึกไว้ ลองไปกรอกในช่องบันทึกผลหลังโพสต์ก่อน
        </div>
      ) : (
        <div style={{ marginTop: "16px" }}>
          {notes.map((item) => (
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

              <p style={{ color: "#555", marginTop: "6px" }}>
                แพลตฟอร์ม: {item.platform || "ยังไม่ได้ระบุ"}
              </p>

              <p style={{ lineHeight: "1.6" }}>{item.notes}</p>

              <Link href={"/dashboard?day=" + item.day}>
                <button>กลับไปดู Day {item.day}</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}