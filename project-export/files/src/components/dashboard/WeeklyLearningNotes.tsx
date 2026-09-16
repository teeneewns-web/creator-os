"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type ResultData = {
  likes?: string;
  comments?: string;
  shares?: string;
  lesson?: string;
};

type LessonItem = {
  day: number;
  lesson: string;
};

export default function WeeklyLearningNotes() {
  const [lessons, setLessons] = useState<LessonItem[]>([]);

  useEffect(() => {
    const loadedLessons: LessonItem[] = [];

    for (let day = 1; day <= 7; day++) {
      const storageKey = "creator-os-post-result-day-" + day;
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed: ResultData = JSON.parse(saved);

          if (parsed.lesson) {
            loadedLessons.push({
              day,
              lesson: parsed.lesson,
            });
          }
        } catch {
          // skip broken data
        }
      }
    }

    setLessons(loadedLessons);
  }, []);

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Learning Notes</p>

      <h2 style={{ margin: "6px 0" }}>บทเรียนจากการทำคอนเทนต์</h2>

      <p style={{ color: "#555", lineHeight: "1.7" }}>
        รวมสิ่งที่คุณเรียนรู้จากแต่ละโพสต์ เพื่อใช้ปรับ Hook เนื้อหา CTA
        และแนวทางการโพสต์ครั้งต่อไป
      </p>

      {lessons.length > 0 ? (
        <div style={listStyle}>
          {lessons.map((item) => (
            <article key={item.day} style={noteCardStyle}>
              <p style={dayLabelStyle}>Day {item.day}</p>

              <p style={{ color: "#374151", lineHeight: "1.8", marginBottom: 0 }}>
                {item.lesson}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div style={emptyBoxStyle}>
          <h3 style={{ marginTop: 0 }}>ยังไม่มีบทเรียนที่บันทึกไว้</h3>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            หลังโพสต์จริง ให้กลับไปกรอกช่อง “บทเรียนจากโพสต์นี้”
            ในหน้า Dashboard ของแต่ละ Day
          </p>
        </div>
      )}
    </section>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "24px",
  padding: "24px",
  background: "white",
};

const labelStyle: CSSProperties = {
  color: "#4f46e5",
  fontWeight: "bold",
  marginTop: 0,
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};

const noteCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const dayLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#4f46e5",
  fontWeight: "bold",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "18px",
  border: "1px dashed #cbd5e1",
  borderRadius: "18px",
  padding: "20px",
  background: "#f8fafc",
};