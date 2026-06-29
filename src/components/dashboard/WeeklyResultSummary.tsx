"use client";

import { useEffect, useState } from "react";

type PostResult = {
  posted: boolean;
  platform: string;
  likes: string;
  comments: string;
  shares: string;
  notes: string;
};

type DayResult = {
  day: number;
  result: PostResult;
};

const STORAGE_KEY = "creator-os-post-result-day-";

function getStorageKey(day: number) {
  return STORAGE_KEY + day;
}

function toNumber(value: string) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

export default function WeeklyResultSummary() {
  const [results, setResults] = useState<DayResult[]>([]);

  useEffect(() => {
    const loadedResults: DayResult[] = [];

    for (let day = 1; day <= 7; day++) {
      const saved = localStorage.getItem(getStorageKey(day));

      if (saved) {
        loadedResults.push({
          day,
          result: JSON.parse(saved),
        });
      }
    }

    setResults(loadedResults);
  }, []);

  const postedResults = results.filter((item) => item.result.posted);

  const totalLikes = postedResults.reduce((sum, item) => {
    return sum + toNumber(item.result.likes);
  }, 0);

  const totalComments = postedResults.reduce((sum, item) => {
    return sum + toNumber(item.result.comments);
  }, 0);

  const totalShares = postedResults.reduce((sum, item) => {
    return sum + toNumber(item.result.shares);
  }, 0);

  const bestResult = postedResults.reduce<DayResult | null>((best, item) => {
    if (!best) return item;

    const currentScore =
      toNumber(item.result.likes) +
      toNumber(item.result.comments) +
      toNumber(item.result.shares);

    const bestScore =
      toNumber(best.result.likes) +
      toNumber(best.result.comments) +
      toNumber(best.result.shares);

    if (currentScore > bestScore) {
      return item;
    }

    return best;
  }, null);

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
      <h2>📈 สรุปผลโพสต์ 7 วัน</h2>

      <p style={{ color: "#555" }}>
        ดูภาพรวมว่าโพสต์ที่ลงจริงได้ผลลัพธ์ประมาณไหน
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "12px",
          marginTop: "18px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "14px",
            background: "#f8fafc",
          }}
        >
          <p style={{ color: "#555", margin: 0 }}>ลงโพสต์แล้ว</p>
          <h3 style={{ margin: "8px 0 0" }}>{postedResults.length} วัน</h3>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "14px",
            background: "#f8fafc",
          }}
        >
          <p style={{ color: "#555", margin: 0 }}>ไลก์รวม</p>
          <h3 style={{ margin: "8px 0 0" }}>{totalLikes}</h3>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "14px",
            background: "#f8fafc",
          }}
        >
          <p style={{ color: "#555", margin: 0 }}>คอมเมนต์รวม</p>
          <h3 style={{ margin: "8px 0 0" }}>{totalComments}</h3>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            padding: "14px",
            background: "#f8fafc",
          }}
        >
          <p style={{ color: "#555", margin: 0 }}>แชร์รวม</p>
          <h3 style={{ margin: "8px 0 0" }}>{totalShares}</h3>
        </div>
      </div>

      {bestResult ? (
        <div
          style={{
            marginTop: "18px",
            padding: "14px",
            borderRadius: "14px",
            background: "#eef2ff",
          }}
        >
          <strong>🏆 Day ที่ผลงานดีที่สุดตอนนี้: Day {bestResult.day}</strong>

          <p style={{ color: "#555", marginBottom: 0 }}>
            แพลตฟอร์ม: {bestResult.result.platform || "ยังไม่ได้ระบุ"}
          </p>
        </div>
      ) : (
        <p
          style={{
            marginTop: "18px",
            padding: "14px",
            borderRadius: "14px",
            background: "#f8fafc",
            color: "#555",
          }}
        >
          ยังไม่มีข้อมูลผลลัพธ์หลังโพสต์
        </p>
      )}
    </section>
  );
}