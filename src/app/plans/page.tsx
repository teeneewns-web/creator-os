import Link from "next/link";

export default function PlansPage() {
  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1>📅 แผนสร้างคอนเทนต์</h1>

      <p
        style={{
          color: "#555",
          marginBottom: "30px",
        }}
      >
        เลือกประเภทเพจที่คุณต้องการพัฒนา
      </p>

      <div
        style={{
          display: "grid",
          gap: "16px",
        }}
      >
        <Link href="/plans/new-page">
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "16px",
              padding: "20px",
              cursor: "pointer",
            }}
          >
            <h2>🆕 เพจใหม่</h2>

            <p>
              สำหรับคนที่เพิ่งเริ่มสร้างเพจ
            </p>
          </div>
        </Link>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>📈 เพจที่มีผู้ติดตามแล้ว</h2>

          <p>
            สำหรับเพจที่ต้องการเติบโตต่อ
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>💰 เพจขายของ</h2>

          <p>
            สำหรับเพจที่เน้นยอดขาย
          </p>
        </div>
      </div>
    </main>
  );
}