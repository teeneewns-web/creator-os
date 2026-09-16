"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type ResultData = {
  likes?: string;
  comments?: string;
  shares?: string;
  lesson?: string;
};

type DayResult = {
  day: number;
  likes: number;
  comments: number;
  shares: number;
  lesson: string;
};

function toNumber(value?: string) {
  const number = Number(value || 0);

  if (Number.isNaN(number)) {
    return 0;
  }

  return number;
}

export default function WeeklyResultSummary() {
  const [results, setResults] = useState<DayResult[]>([]);

  useEffect(() => {
    const loadedResults: DayResult[] = [];

    for (let day = 1; day <= 7; day++) {
      const storageKey = "creator-os-post-result-day-" + day;
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed: ResultData = JSON.parse(saved);

          loadedResults.push({
            day,
            likes: toNumber(parsed.likes),
            comments: toNumber(parsed.comments),
            shares: toNumber(parsed.shares),
            lesson: parsed.lesson || "",
          });
        } catch {
          loadedResults.push({
            day,
            likes: 0,
            comments: 0,
            shares: 0,
            lesson: "",
          });
        }
      }
    }

    setResults(loadedResults);
  }, []);

  const totalLikes = results.reduce((sum, item) => sum + item.likes, 0);
  const totalComments = results.reduce((sum, item) => sum + item.comments, 0);
  const totalShares = results.reduce((sum, item) => sum + item.shares, 0);

  const activeResults = results.filter((item) => {
    return item.likes > 0 || item.comments > 0 || item.shares > 0 || item.lesson;
  });

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Result Summary</p>

      <h2 style={{ margin: "6px 0" }}>สรุปผลลัพธ์หลังโพสต์</h2>

      <p style={{ color: "#555", lineHeight: "1.7" }}>
        รวมตัวเลขไลก์ คอมเมนต์ แชร์ และบทเรียนจากแต่ละวันที่คุณบันทึกไว้
      </p>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <p style={statLabelStyle}>ไลก์รวม</p>
          <strong style={statNumberStyle}>{totalLikes}</strong>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>คอมเมนต์รวม</p>
          <strong style={statNumberStyle}>{totalComments}</strong>
        </div>

        <div style={statCardStyle}>
          <p style={statLabelStyle}>แชร์รวม</p>
          <strong style={statNumberStyle}>{totalShares}</strong>
        </div>
      </div>

      {activeResults.length > 0 ? (
        <div style={listStyle}>
          {activeResults.map((item) => (
            <article key={item.day} style={resultCardStyle}>
              <p style={dayLabelStyle}>Day {item.day}</p>

              <div style={miniStatsStyle}>
                <span>👍 {item.likes}</span>
                <span>💬 {item.comments}</span>
                <span>🔁 {item.shares}</span>
              </div>

              {item.lesson ? (
                <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
                  บทเรียน: {item.lesson}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div style={emptyBoxStyle}>
          <h3 style={{ marginTop: 0 }}>ยังไม่มีผลลัพธ์ที่บันทึกไว้</h3>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            กลับไปหน้า Dashboard แล้วกรอกผลลัพธ์หลังโพสต์ในแต่ละ Day
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "12px",
  marginTop: "18px",
};

const statCardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const statLabelStyle: CSSProperties = {
  marginTop: 0,
  color: "#555",
};

const statNumberStyle: CSSProperties = {
  fontSize: "26px",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  marginTop: "18px",
};

const resultCardStyle: CSSProperties = {
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

const miniStatsStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  fontWeight: "bold",
};

const emptyBoxStyle: CSSProperties = {
  marginTop: "18px",
  border: "1px dashed #cbd5e1",
  borderRadius: "18px",
  padding: "20px",
  background: "#f8fafc",
};