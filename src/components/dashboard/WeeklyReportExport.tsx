"use client";

import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

type PostResult = {
  posted: boolean;
  platform: string;
  likes: string;
  comments: string;
  shares: string;
  notes: string;
};

const DRAFT_KEY = "creator-os-post-draft-day-";
const RESULT_KEY = "creator-os-post-result-day-";

function getDraftKey(day: number) {
  return DRAFT_KEY + day;
}

function getResultKey(day: number) {
  return RESULT_KEY + day;
}

export default function WeeklyReportExport() {
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    let text = "รายงานสรุปแผนสร้างเพจ 7 วัน\n\n";

    for (let day = 1; day <= 7; day++) {
      const draft = localStorage.getItem(getDraftKey(day));
      const savedResult = localStorage.getItem(getResultKey(day));

      let result: PostResult | null = null;

      if (savedResult) {
        result = JSON.parse(savedResult);
      }

      text =
        text +
        "------------------------------\n" +
        "Day " +
        day +
        "\n";

      if (draft && draft.trim() !== "") {
        text = text + "\nโพสต์ที่ร่างไว้:\n" + draft + "\n";
      } else {
        text = text + "\nโพสต์ที่ร่างไว้: ยังไม่มี\n";
      }

      if (result) {
        text =
          text +
          "\nลงโพสต์แล้ว: " +
          (result.posted ? "ใช่" : "ยังไม่ได้ลง") +
          "\nแพลตฟอร์ม: " +
          (result.platform || "ยังไม่ได้ระบุ") +
          "\nไลก์: " +
          (result.likes || "0") +
          "\nคอมเมนต์: " +
          (result.comments || "0") +
          "\nแชร์: " +
          (result.shares || "0") +
          "\nบทเรียนที่ได้:\n" +
          (result.notes || "ยังไม่มี") +
          "\n\n";
      } else {
        text = text + "\nผลลัพธ์หลังโพสต์: ยังไม่มีข้อมูล\n\n";
      }
    }

    setReportText(text);
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
      <h2>📤 รายงานสรุป 7 วัน</h2>

      <p style={{ color: "#555" }}>
        รวมโพสต์ ผลลัพธ์ และบทเรียนทั้งหมดเป็นข้อความเดียว สามารถคัดลอกไปเก็บไว้ได้
      </p>

      <textarea
        value={reportText}
        readOnly
        style={{
          width: "100%",
          minHeight: "260px",
          marginTop: "14px",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid #ddd",
          fontSize: "15px",
          lineHeight: "1.6",
        }}
      />

      <CopyButton text={reportText} />
    </section>
  );
}