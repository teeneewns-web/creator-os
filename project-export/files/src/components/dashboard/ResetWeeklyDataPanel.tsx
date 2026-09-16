"use client";

import type { CSSProperties } from "react";

export default function ResetWeeklyDataPanel() {
  function resetAllData() {
    const confirmed = window.confirm(
      "ต้องการล้างข้อมูล Dashboard ทั้งหมดจริงไหม? ข้อมูลร่างโพสต์ เช็กคุณภาพ ผลลัพธ์ และความคืบหน้า 7 วันจะถูกลบ"
    );

    if (!confirmed) return;

    localStorage.removeItem("creator-os-dashboard-progress");

    for (let day = 1; day <= 7; day++) {
      localStorage.removeItem("creator-os-post-draft-day-" + day);
      localStorage.removeItem("creator-os-post-quality-day-" + day);
      localStorage.removeItem("creator-os-post-result-day-" + day);
    }

    window.location.reload();
  }

  return (
    <section style={sectionStyle}>
      <p style={labelStyle}>Danger Zone</p>

      <h2 style={{ margin: "6px 0" }}>รีเซ็ตข้อมูล 7 วัน</h2>

      <p style={{ color: "#555", lineHeight: "1.7" }}>
        ใช้เมื่อคุณต้องการเริ่มแผนใหม่ตั้งแต่ Day 1 ระบบจะล้างข้อมูลที่บันทึกไว้ในเครื่องนี้
      </p>

      <button onClick={resetAllData} style={dangerButtonStyle}>
        ล้างข้อมูลทั้งหมด
      </button>
    </section>
  );
}

const sectionStyle: CSSProperties = {
  border: "1px solid #fecaca",
  borderRadius: "24px",
  padding: "22px",
  background: "#fff7f7",
};

const labelStyle: CSSProperties = {
  color: "#dc2626",
  fontWeight: "bold",
  marginTop: 0,
};

const dangerButtonStyle: CSSProperties = {
  width: "100%",
  marginTop: "12px",
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid #dc2626",
  background: "#dc2626",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};