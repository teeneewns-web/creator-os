import Link from "next/link";

const planTypes = [
  {
    title: "🆕 เพจใหม่",
    desc: "สำหรับคนที่เพิ่งเริ่มสร้างเพจตั้งแต่ศูนย์",
    href: "/plans/new-page",
    active: true,
  },
  {
    title: "📈 เพจที่มีผู้ติดตามแล้ว",
    desc: "สำหรับเพจที่อยากเพิ่มยอดเข้าถึงและการมีส่วนร่วม",
    active: false,
  },
  {
    title: "🛍️ เพจขายของ",
    desc: "สำหรับเพจที่ต้องการเพิ่มยอดขายและลูกค้า",
    active: false,
  },
  {
    title: "🎥 Creator วิดีโอ",
    desc: "สำหรับคนทำ Reels, TikTok, Shorts",
    active: false,
  },
  {
    title: "🏢 ธุรกิจ / แบรนด์",
    desc: "สำหรับธุรกิจที่อยากสร้างความน่าเชื่อถือ",
    active: false,
  },
];

export default function PlansPage() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <Link href="/">
        <button>⬅️ กลับหน้าแรก</button>
      </Link>

      <h1 style={{ marginTop: "20px" }}>📅 แผนสร้างคอนเทนต์</h1>

      <p style={{ color: "#666", marginBottom: "24px" }}>
        เลือกประเภทที่ตรงกับคุณ แล้วเข้าไปเลือกแผนที่เหมาะสม
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "18px",
        }}
      >
        {planTypes.map((item) =>
          item.active ? (
            <Link
              key={item.title}
              href={item.href!}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "2px solid #22c55e",
                  borderRadius: "18px",
                  padding: "20px",
                  cursor: "pointer",
                }}
              >
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </Link>
          ) : (
            <div
              key={item.title}
              style={{
                border: "2px solid #ddd",
                borderRadius: "18px",
                padding: "20px",
                opacity: 0.55,
              }}
            >
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
              <small>🚧 กำลังพัฒนา</small>
            </div>
          )
        )}
      </div>
    </main>
  );
}