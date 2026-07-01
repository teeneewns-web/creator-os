"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

type PostResultPanelProps = {
  day?: number;
  [key: string]: unknown;
};

type ResultData = {
  likes: string;
  comments: string;
  shares: string;
  lesson: string;
};

const emptyResult: ResultData = {
  likes: "",
  comments: "",
  shares: "",
  lesson: "",
};

export default function PostResultPanel(props: PostResultPanelProps) {
  const day = props.day || 1;
  const storageKey = "creator-os-post-result-day-" + day;

  const [result, setResult] = useState<ResultData>(emptyResult);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      setResult(emptyResult);
    }
  }, [storageKey]);

  function updateResult(field: keyof ResultData, value: string) {
    const nextResult = {
      ...result,
      [field]: value,
    };

    setResult(nextResult);
    localStorage.setItem(storageKey, JSON.stringify(nextResult));
  }

  function clearResult() {
    setResult(emptyResult);
    localStorage.setItem(storageKey, JSON.stringify(emptyResult));
  }

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={labelStyle}>Post Result</p>

          <h2 style={{ margin: "6px 0" }}>บันทึกผลหลังโพสต์</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            หลังโพสต์จริง ให้จดผลลัพธ์และบทเรียน เพื่อพัฒนาคอนเทนต์วันต่อไป
          </p>
        </div>

        <button onClick={clearResult} style={clearButtonStyle}>
          ล้างผลลัพธ์
        </button>
      </div>

      <div style={statsGridStyle}>
        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>ไลก์</span>
          <input
            value={result.likes}
            onChange={(event) => updateResult("likes", event.target.value)}
            placeholder="เช่น 120"
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>คอมเมนต์</span>
          <input
            value={result.comments}
            onChange={(event) => updateResult("comments", event.target.value)}
            placeholder="เช่น 14"
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>แชร์</span>
          <input
            value={result.shares}
            onChange={(event) => updateResult("shares", event.target.value)}
            placeholder="เช่น 8"
            style={inputStyle}
          />
        </label>
      </div>

      <label style={{ display: "block", marginTop: "16px" }}>
        <span style={fieldLabelStyle}>บทเรียนจากโพสต์นี้</span>

        <textarea
          value={result.lesson}
          onChange={(event) => updateResult("lesson", event.target.value)}
          placeholder="เช่น Hook แบบคำถามทำให้คนคอมเมนต์มากขึ้น..."
          style={textareaStyle}
        />
      </label>
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

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "14px",
  marginTop: "18px",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const fieldLabelStyle: CSSProperties = {
  fontWeight: "bold",
  color: "#374151",
};

const inputStyle: CSSProperties = {
  padding: "13px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "16px",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "130px",
  marginTop: "8px",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "16px",
  lineHeight: "1.7",
  resize: "vertical",
};

const clearButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
};