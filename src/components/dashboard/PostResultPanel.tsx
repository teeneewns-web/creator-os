"use client";

import { useEffect, useState } from "react";

type PostResultPanelProps = {
  day: number;
};

type PostResult = {
  posted: boolean;
  platform: string;
  likes: string;
  comments: string;
  shares: string;
  notes: string;
};

const STORAGE_KEY = "creator-os-post-result-day-";

function getStorageKey(day: number) {
  return STORAGE_KEY + day;
}

const emptyResult: PostResult = {
  posted: false,
  platform: "",
  likes: "",
  comments: "",
  shares: "",
  notes: "",
};

export default function PostResultPanel({ day }: PostResultPanelProps) {
  const [result, setResult] = useState<PostResult>(emptyResult);
  const [loadedDay, setLoadedDay] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(day));

    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      setResult(emptyResult);
    }

    setLoadedDay(day);
  }, [day]);

  useEffect(() => {
    if (loadedDay !== day) return;

    localStorage.setItem(getStorageKey(day), JSON.stringify(result));
  }, [result, day, loadedDay]);

  function updateField(field: keyof PostResult, value: string | boolean) {
    setResult((current) => {
      return {
        ...current,
        [field]: value,
      };
    });
  }

  function clearResult() {
    setResult(emptyResult);
    localStorage.removeItem(getStorageKey(day));
  }

  return (
    <section
      style={{
        marginTop: "24px",
        border: result.posted ? "2px solid #22c55e" : "1px solid #ddd",
        borderRadius: "20px",
        padding: "20px",
        background: result.posted ? "#f0fdf4" : "white",
      }}
    >
      <h2>📈 บันทึกผลหลังโพสต์ Day {day}</h2>

      <p style={{ color: "#555" }}>
        หลังจากนำโพสต์ไปลงจริง ให้จดผลลัพธ์ไว้ เพื่อดูว่าเนื้อหาแบบไหนใช้ได้ผล
      </p>

      <label
        style={{
          display: "block",
          marginTop: "16px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={result.posted}
          onChange={(event) => updateField("posted", event.target.checked)}
          style={{ marginRight: "10px" }}
        />
        โพสต์นี้ลงจริงแล้ว
      </label>

      <div style={{ marginTop: "16px" }}>
        <label>แพลตฟอร์มที่ลง</label>
        <input
          value={result.platform}
          onChange={(event) => updateField("platform", event.target.value)}
          placeholder="เช่น Facebook, TikTok, YouTube Shorts"
          style={{
            width: "100%",
            marginTop: "6px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <div>
          <label>ไลก์</label>
          <input
            value={result.likes}
            onChange={(event) => updateField("likes", event.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <label>คอมเมนต์</label>
          <input
            value={result.comments}
            onChange={(event) => updateField("comments", event.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div>
          <label>แชร์</label>
          <input
            value={result.shares}
            onChange={(event) => updateField("shares", event.target.value)}
            placeholder="0"
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <label>สิ่งที่ได้เรียนรู้จากโพสต์นี้</label>
        <textarea
          value={result.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="เช่น Hook แบบนี้คนสนใจดี / โพสต์ยาวเกินไป / คนคอมเมนต์เยอะตอนถามคำถามท้ายโพสต์"
          style={{
            width: "100%",
            minHeight: "120px",
            marginTop: "6px",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            lineHeight: "1.6",
          }}
        />
      </div>

      <button
        onClick={clearResult}
        style={{
          marginTop: "14px",
          padding: "8px 12px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        🗑️ ล้างผลลัพธ์
      </button>
    </section>
  );
}