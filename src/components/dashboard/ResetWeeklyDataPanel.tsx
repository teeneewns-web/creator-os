"use client";

export default function ResetWeeklyDataPanel() {
  function resetAllData() {
    const confirmed = window.confirm(
      "ต้องการล้างข้อมูลแผน 7 วันทั้งหมดใช่ไหม? ข้อมูลภารกิจ โพสต์ที่ร่างไว้ เช็กลิสต์ และผลลัพธ์จะถูกลบทั้งหมด"
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
    <section
      style={{
        marginTop: "24px",
        border: "1px solid #fecaca",
        borderRadius: "20px",
        padding: "20px",
        background: "#fff1f2",
      }}
    >
      <h2>🧹 ล้างข้อมูลทดสอบ</h2>

      <p style={{ color: "#555" }}>
        ใช้สำหรับรีเซ็ตข้อมูลแผน 7 วันทั้งหมด ตอนทดสอบระบบหรือเริ่มใหม่
      </p>

      <button
        onClick={resetAllData}
        style={{
          marginTop: "12px",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid #fca5a5",
          background: "white",
          cursor: "pointer",
        }}
      >
        🗑️ ล้างข้อมูลทั้งหมด
      </button>
    </section>
  );
}