"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

type PostDraftPanelProps = {
  day?: number;
  draft?: string;
  value?: string;
  initialDraft?: string;
  onChange?: (value: string) => void;
  onChangeDraft?: (value: string) => void;
  [key: string]: unknown;
};

export default function PostDraftPanel(props: PostDraftPanelProps) {
  const day = props.day || 1;
  const storageKey = "creator-os-post-draft-day-" + day;

  const startValue =
    props.draft || props.value || props.initialDraft || "";

  const [draft, setDraft] = useState(startValue);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setDraft(saved);
    } else {
      setDraft(startValue);
    }
  }, [storageKey]);

  function handleChange(value: string) {
    setDraft(value);
    localStorage.setItem(storageKey, value);

    if (props.onChange) {
      props.onChange(value);
    }

    if (props.onChangeDraft) {
      props.onChangeDraft(value);
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={headerRowStyle}>
        <div>
          <p style={labelStyle}>Post Draft</p>

          <h2 style={{ margin: "6px 0" }}>ร่างโพสต์ของวันนี้</h2>

          <p style={{ color: "#555", lineHeight: "1.7", marginBottom: 0 }}>
            เขียนโพสต์จาก Hook / โครงโพสต์ / CTA แล้วระบบจะบันทึกแยกตาม Day
          </p>
        </div>

        <div style={wordBoxStyle}>
          <p style={{ margin: 0, color: "#555" }}>จำนวนตัวอักษร</p>
          <strong style={{ fontSize: "24px" }}>{draft.length}</strong>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="เริ่มร่างโพสต์ของคุณที่นี่..."
        style={textareaStyle}
      />

      <div style={buttonRowStyle}>
        <CopyButton text={draft} />

        <button
          onClick={() => handleChange("")}
          style={clearButtonStyle}
        >
          ล้างร่างโพสต์
        </button>
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

const wordBoxStyle: CSSProperties = {
  minWidth: "150px",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "16px",
  background: "#f8fafc",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: "220px",
  marginTop: "18px",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid #ddd",
  fontSize: "16px",
  lineHeight: "1.7",
  resize: "vertical",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "14px",
};

const clearButtonStyle: CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
}