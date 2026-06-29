"use client";

import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

type PostDraftPanelProps = {
  day: number;
  hooks?: string[];
  postStructure?: string[];
  cta?: string;
  hashtags?: string;
};

const STORAGE_KEY = "creator-os-post-draft-day-";

function getStorageKey(day: number) {
  return STORAGE_KEY + day;
}

export default function PostDraftPanel({
  day,
  hooks = [],
  postStructure = [],
  cta = "",
  hashtags = "",
}: PostDraftPanelProps) {
  const [draft, setDraft] = useState("");
  const [loadedDay, setLoadedDay] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(day));

    if (saved) {
      setDraft(saved);
    } else {
      setDraft("");
    }

    setLoadedDay(day);
  }, [day]);

  useEffect(() => {
    if (loadedDay !== day) return;

    localStorage.setItem(getStorageKey(day), draft);
  }, [draft, day, loadedDay]);

  function clearDraft() {
    setDraft("");
    localStorage.removeItem(getStorageKey(day));
  }

  function insertTemplate() {
    const firstHook = hooks.length > 0 ? hooks[0] : "";

    const structureText =
      postStructure.length > 0
        ? postStructure.map((item, index) => index + 1 + ". " + item).join("\n")
        : "";

    const template =
      "Hook:\n" +
      firstHook +
      "\n\nเนื้อหาโพสต์:\n" +
      structureText +
      "\n\nCTA:\n" +
      cta +
      "\n\nHashtags:\n" +
      hashtags;

    setDraft(template);
  }

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
      <h2>✍️ เขียนโพสต์ของ Day {day}</h2>

      <p style={{ color: "#555" }}>
        เขียนโพสต์จริงของคุณตรงนี้ ระบบจะจำข้อความไว้ให้ แม้รีเฟรชหน้า
      </p>

      <button
        onClick={insertTemplate}
        style={{
          marginTop: "12px",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        🧩 ใส่แม่แบบโพสต์อัตโนมัติ
      </button>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="เริ่มเขียนโพสต์ของวันนี้ที่นี่..."
        style={{
          width: "100%",
          minHeight: "220px",
          marginTop: "14px",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid #ddd",
          fontSize: "16px",
          lineHeight: "1.6",
        }}
      />

      <p style={{ color: "#555", marginTop: "8px" }}>
        จำนวนตัวอักษร: {draft.length}
      </p>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "12px",
        }}
      >
        <CopyButton text={draft} />

        <button
          onClick={clearDraft}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          🗑️ ล้างข้อความ
        </button>
      </div>
    </section>
  );
}